import { useState, useCallback } from 'react';
import type { Node, Edge } from '@xyflow/react';
import { EulerWorkflowExecutor } from '../lib/eulerIntegrations';
import { executeEVCBatch } from '../lib/euler/executor';
import type { NodeData } from '../types/nodes';

interface ExecutionResult {
  success: boolean;
  transactionHash?: string;
  error?: string;
  gasUsed?: bigint;
}

interface ExecutionStep {
  nodeId: string;
  operation: any;
  status: 'pending' | 'executing' | 'completed' | 'failed';
  result?: any;
  error?: string;
}

export const useWorkflowExecution = () => {
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionSteps, setExecutionSteps] = useState<ExecutionStep[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(-1);

  // Topological sort for execution order
  const getExecutionOrder = useCallback((nodes: Node[], edges: Edge[]): string[] => {
    const graph = new Map<string, string[]>();
    const inDegree = new Map<string, number>();

    // Initialize graph
    nodes.forEach(node => {
      graph.set(node.id, []);
      inDegree.set(node.id, 0);
    });

    // Build adjacency list and calculate in-degrees
    edges.forEach(edge => {
      const sourceId = edge.source;
      const targetId = edge.target;
      
      graph.get(sourceId)?.push(targetId);
      inDegree.set(targetId, (inDegree.get(targetId) || 0) + 1);
    });

    // Topological sort using Kahn's algorithm
    const queue: string[] = [];
    const result: string[] = [];

    // Find all nodes with no incoming edges
    inDegree.forEach((degree, nodeId) => {
      if (degree === 0) {
        queue.push(nodeId);
      }
    });

    while (queue.length > 0) {
      const current = queue.shift()!;
      result.push(current);

      // Remove current node and update in-degrees
      graph.get(current)?.forEach(neighbor => {
        const newDegree = (inDegree.get(neighbor) || 0) - 1;
        inDegree.set(neighbor, newDegree);
        
        if (newDegree === 0) {
          queue.push(neighbor);
        }
      });
    }

    return result;
  }, []);

  // Validate workflow
  const validateWorkflow = useCallback((nodes: Node[], edges: Edge[]): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];

    // Check for start node
    const startNodes = nodes.filter(n => n.type === 'startNode');
    if (startNodes.length === 0) {
      errors.push('Workflow must have a start node');
    }
    if (startNodes.length > 1) {
      errors.push('Workflow can only have one start node');
    }

    // Check for end node
    const endNodes = nodes.filter(n => n.type === 'endNode');
    if (endNodes.length === 0) {
      errors.push('Workflow must have an end node');
    }

    // Check connectivity
    const executionOrder = getExecutionOrder(nodes, edges);
    if (executionOrder.length !== nodes.length) {
      errors.push('Workflow contains cycles or disconnected components');
    }

    return { valid: errors.length === 0, errors };
  }, [getExecutionOrder]);

  // Execute workflow with real EVC calls
  const executeWorkflow = useCallback(async (nodes: Node[], edges: Edge[]): Promise<ExecutionResult> => {
    setIsExecuting(true);
    setCurrentStep(-1);
    setExecutionSteps([]);

    try {
      console.log('🚀 Starting workflow execution...');
      
      // Validate workflow
      const validation = validateWorkflow(nodes, edges);
      if (!validation.valid) {
        throw new Error(`Workflow validation failed: ${validation.errors.join(', ')}`);
      }

      // Get execution order
      const executionOrder = getExecutionOrder(nodes, edges);
      console.log(`📋 Execution order: ${executionOrder.join(' → ')}`);
      
      // Convert nodes to NodeData and execute
      const nodeDataSequence = executionOrder
        .map(nodeId => nodes.find(n => n.id === nodeId))
        .filter(node => node && node.data.category !== 'control')
        .map(node => node!.data as NodeData);

      console.log(`🔧 Processing ${nodeDataSequence.length} actionable nodes`);

      // Generate batch operations
      const batchOperations = await EulerWorkflowExecutor.executeNodeSequence(nodeDataSequence);

      if (batchOperations.length === 0) {
        throw new Error('No operations generated from workflow');
      }

      // Create execution steps for UI
      const steps: ExecutionStep[] = batchOperations.map((operation, index) => ({
        nodeId: executionOrder[index] || `step-${index}`,
        operation,
        status: 'pending',
      }));

      setExecutionSteps(steps);
      setCurrentStep(0);

      // Execute the batch on-chain
      console.log('⛽ Executing EVC batch on devland...');
      const result = await executeEVCBatch(batchOperations);

      if (result.success) {
        // Mark all steps as completed
        setExecutionSteps(prev => 
          prev.map(step => ({ ...step, status: 'completed', result: 'Success' }))
        );

        setCurrentStep(-1);
        
        console.log('✅ Workflow execution completed successfully!');
        return {
          success: true,
          transactionHash: result.transactionHash,
          gasUsed: result.gasUsed,
        };
      } else {
        throw new Error(result.error || 'Transaction failed');
      }

    } catch (error) {
      console.error('❌ Workflow execution failed:', error);
      
      // Mark current step as failed
      setExecutionSteps(prev => 
        prev.map((step, index) => 
          index === currentStep ? { 
            ...step, 
            status: 'failed', 
            error: error instanceof Error ? error.message : 'Unknown error' 
          } : step
        )
      );

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    } finally {
      setIsExecuting(false);
    }
  }, [validateWorkflow, getExecutionOrder, currentStep]);

  // Simulate workflow (dry run)
  const simulateWorkflow = useCallback(async (nodes: Node[], edges: Edge[]) => {
    const validation = validateWorkflow(nodes, edges);
    if (!validation.valid) {
      return { success: false, errors: validation.errors };
    }

    const executionOrder = getExecutionOrder(nodes, edges);
    const nodeDataSequence = executionOrder
      .map(nodeId => nodes.find(n => n.id === nodeId))
      .filter(node => node && node.data.category !== 'control')
      .map(node => node!.data as NodeData);

    try {
      const operations = await EulerWorkflowExecutor.executeNodeSequence(nodeDataSequence);
      
      return {
        success: true,
        operations,
        estimatedGas: BigInt(operations.length * 50000), // Mock gas estimation
        executionOrder,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Simulation failed',
      };
    }
  }, [validateWorkflow, getExecutionOrder]);

  return {
    isExecuting,
    executionSteps,
    currentStep,
    executeWorkflow,
    simulateWorkflow,
    validateWorkflow,
  };
};