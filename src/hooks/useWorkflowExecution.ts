import { useState, useCallback } from 'react';
import type { Node, Edge } from '@xyflow/react';
import type { NodeData, VaultNodeData, SwapNodeData } from '../types/nodes';
import type { BatchOperation } from '../types/euler';

interface ExecutionResult {
  success: boolean;
  transactionHash?: string;
  error?: string;
  gasUsed?: bigint;
}

interface ExecutionStep {
  nodeId: string;
  operation: BatchOperation;
  status: 'pending' | 'executing' | 'completed' | 'failed';
  result?: any;
  error?: string;
}

export const useWorkflowExecution = () => {
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionSteps, setExecutionSteps] = useState<ExecutionStep[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(-1);

  // Topological sort to determine execution order
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

  // Convert node to batch operation
  const nodeToBatchOperation = useCallback((node: Node): BatchOperation | null => {
    const data = node.data as NodeData;

    switch (data.category) {
      case 'vault':
        return generateVaultOperation(data as VaultNodeData);
      case 'swap':
        return generateSwapOperation(data as SwapNodeData);
      default:
        return null; // Start/End nodes don't generate operations
    }
  }, []);

  // Generate vault operation
  const generateVaultOperation = (data: VaultNodeData): BatchOperation => {
    // Mock implementation - in real app, this would generate actual EVC calldata
    const target = data.vaultAddress || '0x0000000000000000000000000000000000000000';
    
    switch (data.action) {
      case 'deposit':
        return {
          target,
          value: 0n,
          calldata: `0x${Buffer.from(`deposit(${data.amount})`).toString('hex')}`,
        };
      case 'withdraw':
        return {
          target,
          value: 0n,
          calldata: `0x${Buffer.from(`withdraw(${data.amount})`).toString('hex')}`,
        };
      case 'borrow':
        return {
          target,
          value: 0n,
          calldata: `0x${Buffer.from(`borrow(${data.amount})`).toString('hex')}`,
        };
      case 'repay':
        return {
          target,
          value: 0n,
          calldata: `0x${Buffer.from(`repay(${data.amount})`).toString('hex')}`,
        };
      default:
        throw new Error(`Unknown vault action: ${data.action}`);
    }
  };

  // Generate swap operation
  const generateSwapOperation = (data: SwapNodeData): BatchOperation => {
    // Mock implementation - in real app, this would use Order Flow Router API
    return {
      target: '0x2Bba09866b6F1025258542478C39720A09B728bF', // Swapper contract
      value: 0n,
      calldata: `0x${Buffer.from(`swap(${data.tokenIn},${data.tokenOut},${data.amountIn})`).toString('hex')}`,
    };
  };

  // Validate workflow before execution
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

    // Validate each node configuration
    nodes.forEach(node => {
      const data = node.data as NodeData;
      
      if (data.category === 'vault') {
        const vaultData = data as VaultNodeData;
        if (!vaultData.vaultAddress) {
          errors.push(`Vault node "${data.label}" missing vault address`);
        }
        if (!vaultData.amount) {
          errors.push(`Vault node "${data.label}" missing amount`);
        }
      }
      
      if (data.category === 'swap') {
        const swapData = data as SwapNodeData;
        if (!swapData.tokenIn || !swapData.tokenOut) {
          errors.push(`Swap node "${data.label}" missing token selection`);
        }
        if (!swapData.amountIn) {
          errors.push(`Swap node "${data.label}" missing amount`);
        }
      }
    });

    // Check connectivity
    const executionOrder = getExecutionOrder(nodes, edges);
    if (executionOrder.length !== nodes.length) {
      errors.push('Workflow contains cycles or disconnected components');
    }

    return { valid: errors.length === 0, errors };
  }, [getExecutionOrder]);

  // Execute workflow
  const executeWorkflow = useCallback(async (nodes: Node[], edges: Edge[]): Promise<ExecutionResult> => {
    setIsExecuting(true);
    setCurrentStep(-1);

    try {
      // Validate workflow
      const validation = validateWorkflow(nodes, edges);
      if (!validation.valid) {
        throw new Error(`Workflow validation failed: ${validation.errors.join(', ')}`);
      }

      // Get execution order
      const executionOrder = getExecutionOrder(nodes, edges);
      
      // Generate batch operations
      const steps: ExecutionStep[] = [];
      const batchOperations: BatchOperation[] = [];

      for (const nodeId of executionOrder) {
        const node = nodes.find(n => n.id === nodeId);
        if (!node) continue;

        const operation = nodeToBatchOperation(node);
        if (operation) {
          const step: ExecutionStep = {
            nodeId,
            operation,
            status: 'pending',
          };
          steps.push(step);
          batchOperations.push(operation);
        }
      }

      setExecutionSteps(steps);

      // Simulate execution (in real app, this would call EVC.batch())
      for (let i = 0; i < steps.length; i++) {
        setCurrentStep(i);
        
        // Update step status to executing
        setExecutionSteps(prev => 
          prev.map((step, index) => 
            index === i ? { ...step, status: 'executing' } : step
          )
        );

        // Simulate operation execution
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Update step status to completed
        setExecutionSteps(prev => 
          prev.map((step, index) => 
            index === i ? { ...step, status: 'completed', result: 'Success' } : step
          )
        );
      }

      setCurrentStep(-1);
      
      return {
        success: true,
        transactionHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
        gasUsed: 150000n,
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      // Mark current step as failed
      if (currentStep >= 0) {
        setExecutionSteps(prev => 
          prev.map((step, index) => 
            index === currentStep ? { ...step, status: 'failed', error: errorMessage } : step
          )
        );
      }

      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setIsExecuting(false);
    }
  }, [validateWorkflow, getExecutionOrder, nodeToBatchOperation, currentStep]);

  // Simulate workflow (dry run)
  const simulateWorkflow = useCallback(async (nodes: Node[], edges: Edge[]) => {
    const validation = validateWorkflow(nodes, edges);
    if (!validation.valid) {
      return { success: false, errors: validation.errors };
    }

    const executionOrder = getExecutionOrder(nodes, edges);
    const operations = executionOrder
      .map(nodeId => nodes.find(n => n.id === nodeId))
      .filter(node => node)
      .map(node => nodeToBatchOperation(node!))
      .filter(op => op !== null);

    return {
      success: true,
      operations,
      estimatedGas: BigInt(operations.length * 50000), // Mock gas estimation
      executionOrder,
    };
  }, [validateWorkflow, getExecutionOrder, nodeToBatchOperation]);

  return {
    isExecuting,
    executionSteps,
    currentStep,
    executeWorkflow,
    simulateWorkflow,
    validateWorkflow,
  };
};