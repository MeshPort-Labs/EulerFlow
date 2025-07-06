import { useState, useCallback } from "react";
import type { Node, Edge } from "@xyflow/react";
import { EulerWorkflowExecutor } from "../lib/eulerIntegrations";
import { executeEVCBatch } from "../lib/euler/eulerLib";
import type { NodeData } from "../types/nodes";
import { useAccount } from "wagmi";
import { toast } from "sonner";

interface ExecutionResult {
  success: boolean;
  transactionHash?: string;
  error?: string;
  gasUsed?: bigint;
  message?: string;
}

interface ExecutionStep {
  nodeId: string;
  operation: any;
  status: "pending" | "executing" | "completed" | "failed";
  result?: any;
  error?: string;
  description?: string;
}

export const useWorkflowExecution = () => {
  const { address: userAddress } = useAccount(); // Get user address from connected wallet
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionSteps, setExecutionSteps] = useState<ExecutionStep[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(-1);

  // Topological sort for execution order
  const getExecutionOrder = useCallback(
    (nodes: Node[], edges: Edge[]): string[] => {
      const graph = new Map<string, string[]>();
      const inDegree = new Map<string, number>();

      // Initialize graph
      nodes.forEach((node) => {
        graph.set(node.id, []);
        inDegree.set(node.id, 0);
      });

      // Build adjacency list and calculate in-degrees
      edges.forEach((edge) => {
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
        graph.get(current)?.forEach((neighbor) => {
          const newDegree = (inDegree.get(neighbor) || 0) - 1;
          inDegree.set(neighbor, newDegree);

          if (newDegree === 0) {
            queue.push(neighbor);
          }
        });
      }

      return result;
    },
    []
  );

  // Validate workflow
  const validateWorkflow = useCallback(
    (nodes: Node[], edges: Edge[]): { valid: boolean; errors: string[] } => {
      const errors: string[] = [];

      // Check if wallet is connected
      if (!userAddress) {
        errors.push("Wallet must be connected to execute workflow");
      }

      // Check for start node
      const startNodes = nodes.filter((n) => n.type === "startNode");
      if (startNodes.length === 0) {
        errors.push("Workflow must have a start node");
      }
      if (startNodes.length > 1) {
        errors.push("Workflow can only have one start node");
      }

      // Check for end node
      const endNodes = nodes.filter((n) => n.type === "endNode");
      if (endNodes.length === 0) {
        errors.push("Workflow must have an end node");
      }

      // Check connectivity
      const executionOrder = getExecutionOrder(nodes, edges);
      if (executionOrder.length !== nodes.length) {
        errors.push("Workflow contains cycles or disconnected components");
      }

      // Validate individual nodes
      nodes.forEach((node) => {
        const nodeData = node.data as NodeData;

        // Skip control nodes
        if (nodeData.category === "control") return;

        // Validate core actions
        if (nodeData.category === "core") {
          const coreData = nodeData as any;
          switch (coreData.action) {
            case "supply":
            case "withdraw":
            case "borrow":
            case "repay":
              if (!coreData.vaultAddress) {
                errors.push(`${node.data.label}: Vault address is required`);
              }
              if (!coreData.amount) {
                errors.push(`${node.data.label}: Amount is required`);
              }
              break;
            case "swap":
              if (!coreData.tokenIn || !coreData.tokenOut) {
                errors.push(
                  `${node.data.label}: Both input and output tokens are required`
                );
              }
              break;
            case "permissions":
              if (
                !coreData.controller &&
                (!coreData.collaterals || coreData.collaterals.length === 0)
              ) {
                errors.push(
                  `${node.data.label}: Either controller or collaterals must be specified`
                );
              }
              break;
          }
        }

        // Validate strategies
        if (nodeData.category === "strategy") {
          const strategyData = nodeData as any;
          switch (strategyData.strategyType) {
            case "leverage":
              if (!strategyData.collateralAsset || !strategyData.borrowAsset) {
                errors.push(
                  `${node.data.label}: Both collateral and borrow assets are required`
                );
              }
              if (
                !strategyData.leverageFactor ||
                strategyData.leverageFactor < 1.1
              ) {
                errors.push(
                  `${node.data.label}: Leverage factor must be at least 1.1x`
                );
              }
              break;
            case "borrow-against-lp":
              if (!strategyData.borrowAsset || !strategyData.borrowAmount) {
                errors.push(
                  `${node.data.label}: Borrow asset and amount are required`
                );
              }
              break;
          }
        }
      });

      return { valid: errors.length === 0, errors };
    },
    [getExecutionOrder, userAddress]
  );

  // Execute workflow with real EVC calls
  const executeWorkflow = useCallback(async (nodes: Node[], edges: Edge[]): Promise<ExecutionResult> => {
    if (!userAddress) {
      toast.error('Wallet must be connected to execute workflow');
      return {
        success: false,
        error: 'Wallet must be connected to execute workflow'
      };
    }

    setIsExecuting(true);
    setCurrentStep(-1);
    setExecutionSteps([]);

    // Show starting toast
    const executionToastId = toast.loading('Starting workflow execution...', {
      description: 'Preparing transactions and validating workflow'
    });

    try {
      console.log('🚀 Starting workflow execution...');
      console.log('👤 User address:', userAddress);
      
      // Validate workflow
      const validation = validateWorkflow(nodes, edges);
      if (!validation.valid) {
        toast.error('Workflow validation failed', {
          description: validation.errors[0] || 'Unknown validation error',
          id: executionToastId
        });
        throw new Error(`Workflow validation failed:\n${validation.errors.join('\n')}`);
      }

      // Get execution order
      const executionOrder = getExecutionOrder(nodes, edges);
      console.log(`📋 Execution order: ${executionOrder.join(' → ')}`);
      
      // Convert nodes to NodeData and execute (filter out control nodes)
      const actionableNodes = executionOrder
        .map(nodeId => nodes.find(n => n.id === nodeId))
        .filter(node => node && node.data.category !== 'control')
        .map(node => ({ node: node!, data: node!.data as NodeData }));

      console.log(`🔧 Processing ${actionableNodes.length} actionable nodes`);

      if (actionableNodes.length === 0) {
        toast.success('Workflow completed', {
          description: 'No actionable operations to execute',
          id: executionToastId
        });
        return {
          success: true,
          message: 'Workflow completed (no actionable operations)'
        };
      }

      // Update toast with progress
      toast.loading(`Executing ${actionableNodes.length} operations...`, {
        description: 'Processing transactions on-chain',
        id: executionToastId
      });

      // Initialize execution steps
      const steps: ExecutionStep[] = actionableNodes.map(({ node, data }) => ({
        nodeId: node.id,
        operation: data,
        status: 'pending',
        description: `${data.category}: ${node.data.label}`
      }));

      setExecutionSteps(steps);

      // Execute each node
      const completedTransactions: string[] = [];
      
      for (let i = 0; i < actionableNodes.length; i++) {
        const { node, data } = actionableNodes[i];
        
        setCurrentStep(i);
        
        // Update step status to executing
        setExecutionSteps(prev => 
          prev.map((step, index) => 
            index === i ? { ...step, status: 'executing' } : step
          )
        );

        console.log(`⚡ Executing step ${i + 1}/${actionableNodes.length}: ${node.data.label}`);

        try {
          // Generate batch operations using EulerWorkflowExecutor with user address
          const batchOperations = await EulerWorkflowExecutor.executeNodeSequence([data], userAddress);

          if (batchOperations.length === 0) {
            console.log(`⚠️ No operations generated for node: ${node.data.label}`);
            
            // Mark as completed (some nodes might not generate operations)
            setExecutionSteps(prev => 
              prev.map((step, index) => 
                index === i ? { 
                  ...step, 
                  status: 'completed', 
                  result: 'No operations needed' 
                } : step
              )
            );
            continue;
          }

          // Execute each batch operation for this node
          let allSuccessful = true;
          const transactionHashes: string[] = [];

          for (const batch of batchOperations) {
            console.log(`📦 Executing batch for ${node.data.label}...`);
            
            // Handle the batch - it might be a direct BatchOperation or wrapped
            const batchToExecute = Array.isArray(batch) ? batch : [batch];
            
            try {
              const result = await executeEVCBatch(batchToExecute);
              
              // Check if result exists and has success property
              if (!result) {
                throw new Error('No result returned from executeEVCBatch');
              }
              
              if (result.success) {
                console.log(`✅ Batch completed successfully: ${result.transactionHash}`);
                if (result.transactionHash) {
                  transactionHashes.push(result.transactionHash);
                  completedTransactions.push(result.transactionHash);
                }
              } else {
                console.error(`❌ Batch failed: ${result.error}`);
                throw new Error(result.error || 'Batch execution failed');
              }
            } catch (batchError) {
              console.error(`❌ Batch execution error:`, batchError);
              allSuccessful = false;
              throw batchError;
            }
          }

          if (allSuccessful) {
            // Mark step as completed
            setExecutionSteps(prev => 
              prev.map((step, index) => 
                index === i ? { 
                  ...step, 
                  status: 'completed', 
                  result: `Completed (${transactionHashes.length} tx)` 
                } : step
              )
            );
          } else {
            throw new Error('One or more batches failed');
          }

        } catch (stepError) {
          console.error(`❌ Step ${i + 1} failed:`, stepError);
          
          // Mark step as failed
          setExecutionSteps(prev => 
            prev.map((step, index) => 
              index === i ? { 
                ...step, 
                status: 'failed', 
                error: stepError instanceof Error ? stepError.message : 'Unknown error' 
              } : step
            )
          );

          // Show failure toast
          toast.error(`Step ${i + 1} failed: ${node.data.label}`, {
            description: stepError instanceof Error ? stepError.message : 'Unknown error',
            id: executionToastId
          });

          throw stepError; // Stop execution on first failure
        }
      }

      setCurrentStep(-1);
      
      // Show success toast with transaction details
      toast.success('Workflow executed successfully! 🎉', {
        description: `Completed ${actionableNodes.length} operations with ${completedTransactions.length} transactions`,
        id: executionToastId,
        action: completedTransactions.length > 0 ? {
          label: 'View Transaction',
          onClick: () => {
            // Open the first transaction in block explorer
            const txHash = completedTransactions[0];
            window.open(`https://etherscan.io/tx/${txHash}`, '_blank');
          }
        } : undefined
      });
      
      console.log('✅ Workflow execution completed successfully!');
      return {
        success: true,
        message: `Workflow executed successfully! Completed ${actionableNodes.length} operations.`,
        transactionHash: completedTransactions[0] // Return first transaction hash
      };

    } catch (error) {
      console.error('❌ Workflow execution failed:', error);
      
      // Show failure toast
      toast.error('Workflow execution failed', {
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        id: executionToastId
      });
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    } finally {
      setIsExecuting(false);
    }
  }, [validateWorkflow, getExecutionOrder, userAddress]);

  // Update simulateWorkflow as well
  const simulateWorkflow = useCallback(async (nodes: Node[], edges: Edge[]) => {
    if (!userAddress) {
      toast.error('Wallet must be connected for simulation');
      return { success: false, errors: ['Wallet must be connected'] };
    }

    const simulationToastId = toast.loading('Simulating workflow...', {
      description: 'Validating operations and estimating gas'
    });

    console.log('🔍 Simulating workflow...');
    
    const validation = validateWorkflow(nodes, edges);
    if (!validation.valid) {
      toast.error('Simulation failed', {
        description: validation.errors[0] || 'Workflow validation failed',
        id: simulationToastId
      });
      return { success: false, errors: validation.errors };
    }

    const executionOrder = getExecutionOrder(nodes, edges);
    const nodeDataSequence = executionOrder
      .map(nodeId => nodes.find(n => n.id === nodeId))
      .filter(node => node && node.data.category !== 'control')
      .map(node => node!.data as NodeData);

    try {
      // Simulate by generating operations without executing
      const operations = await EulerWorkflowExecutor.executeNodeSequence(nodeDataSequence, userAddress);
      
      toast.success('Simulation successful! ✅', {
        description: `Generated ${operations.length} operations, ready for execution`,
        id: simulationToastId
      });
      
      return {
        success: true,
        operations,
        estimatedGas: BigInt(operations.length * 100000), // Mock gas estimation
        executionOrder,
        nodeCount: nodeDataSequence.length
      };
    } catch (error) {
      toast.error('Simulation failed', {
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        id: simulationToastId
      });
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Simulation failed',
      };
    }
  }, [validateWorkflow, getExecutionOrder, userAddress]);

  return {
    isExecuting,
    executionSteps,
    currentStep,
    executeWorkflow,
    simulateWorkflow,
    validateWorkflow,
  };
};
