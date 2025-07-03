import { useState, useCallback } from 'react';
import type { Node, Edge } from '@xyflow/react';
import type { CoreActionNodeData, LpToolkitNodeData, NodeData, StrategyNodeData } from '../types/nodes';
import { EulerWorkflowExecutor } from '../lib/eulerIntegrations';
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
    case 'core':
      return generateCoreActionOperation(data as CoreActionNodeData);
    case 'strategy':
      return generateStrategyOperation(data as StrategyNodeData);
    case 'lp-toolkit':
      return generateLpToolkitOperation(data as LpToolkitNodeData);
    case 'control':
      return null; // Control nodes don't generate operations
    default:
      return null;
  }
}, []);

// Generate core action operation
const generateCoreActionOperation = (data: CoreActionNodeData): BatchOperation => {
  const target = data.vaultAddress || '0x0000000000000000000000000000000000000000';
  
  switch (data.action) {
    case 'supply':
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
    case 'swap':
      return {
        target: '0x2Bba09866b6F1025258542478C39720A09B728bF', // Swapper contract
        value: 0n,
        calldata: `0x${Buffer.from(`swap(${data.tokenIn},${data.tokenOut},${data.amount})`).toString('hex')}`,
      };
    case 'permissions':
      return {
        target: '0x0C9a3dd6b8F28529d72d7f9cE918D493519EE383', // EVC contract
        value: 0n,
        calldata: `0x${Buffer.from(`enableCollateral(${data.controller})`).toString('hex')}`,
      };
    default:
      throw new Error(`Unknown core action: ${data.action}`);
  }
};

// Generate strategy operation (these will call your euler-lib functions)
const generateStrategyOperation = (data: StrategyNodeData): BatchOperation => {
  // This is where you'll integrate with your euler-lib strategy composers
  // For now, return a mock operation
  switch (data.strategyType) {
    case 'leverage':
      return {
        target: '0x0000000000000000000000000000000000000000', // Strategy executor
        value: 0n,
        calldata: `0x${Buffer.from(`leverage(${data.collateralAsset},${data.borrowAsset},${data.leverageFactor})`).toString('hex')}`,
      };
    case 'borrow-against-lp':
      return {
        target: '0x0000000000000000000000000000000000000000',
        value: 0n,
        calldata: `0x${Buffer.from(`borrowAgainstLP(${data.borrowAsset},${data.borrowAmount})`).toString('hex')}`,
      };
    case 'hedged-lp':
      return {
        target: '0x0000000000000000000000000000000000000000',
        value: 0n,
        calldata: `0x${Buffer.from(`hedgedLP(${data.collateralAsset},${data.borrowAsset})`).toString('hex')}`,
      };
    case 'jit-liquidity':
      return {
        target: '0x0000000000000000000000000000000000000000',
        value: 0n,
        calldata: `0x${Buffer.from(`jitLiquidity(${data.jitAsset},${data.jitAmount},${data.jitAction})`).toString('hex')}`,
      };
    default:
      throw new Error(`Unknown strategy type: ${data.strategyType}`);
  }
};

// Generate LP toolkit operation
const generateLpToolkitOperation = (data: LpToolkitNodeData): BatchOperation => {
  switch (data.action) {
    case 'create-pool':
      return {
        target: '0x55d09f01fBF9D8D891c6608C5a54EA7AD6d528fb', // EulerSwap Factory
        value: 0n,
        calldata: `0x${Buffer.from(`createPool(${data.vault0},${data.vault1},${data.fee})`).toString('hex')}`,
      };
    case 'add-liquidity':
      return {
        target: data.poolAddress || '0x0000000000000000000000000000000000000000',
        value: 0n,
        calldata: `0x${Buffer.from(`addLiquidity(${data.amount0},${data.amount1})`).toString('hex')}`,
      };
    case 'remove-liquidity':
      return {
        target: data.poolAddress || '0x0000000000000000000000000000000000000000',
        value: 0n,
        calldata: `0x${Buffer.from(`removeLiquidity(${data.amount0},${data.amount1})`).toString('hex')}`,
      };
    default:
      throw new Error(`Unknown LP toolkit action: ${data.action}`);
  }
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
    
    switch (data.category) {
      case 'core':
        const coreData = data as CoreActionNodeData;
        switch (coreData.action) {
          case 'supply':
          case 'withdraw':
          case 'borrow':
          case 'repay':
            if (!coreData.vaultAddress) {
              errors.push(`Core action node "${data.label}" missing vault address`);
            }
            if (!coreData.amount) {
              errors.push(`Core action node "${data.label}" missing amount`);
            }
            break;
          case 'swap':
            if (!coreData.tokenIn || !coreData.tokenOut) {
              errors.push(`Swap node "${data.label}" missing token selection`);
            }
            if (!coreData.amount) {
              errors.push(`Swap node "${data.label}" missing amount`);
            }
            break;
          case 'permissions':
            if (!coreData.controller && (!coreData.collaterals || coreData.collaterals.length === 0)) {
              errors.push(`Permissions node "${data.label}" missing controller or collaterals`);
            }
            break;
        }
        break;

      case 'strategy':
        const strategyData = data as StrategyNodeData;
        switch (strategyData.strategyType) {
          case 'leverage':
            if (!strategyData.collateralAsset) {
              errors.push(`Leverage strategy "${data.label}" missing collateral asset`);
            }
            if (!strategyData.borrowAsset) {
              errors.push(`Leverage strategy "${data.label}" missing borrow asset`);
            }
            if (!strategyData.leverageFactor || strategyData.leverageFactor <= 1) {
              errors.push(`Leverage strategy "${data.label}" missing or invalid leverage factor`);
            }
            break;
          case 'borrow-against-lp':
            if (!strategyData.borrowAsset) {
              errors.push(`Borrow against LP strategy "${data.label}" missing borrow asset`);
            }
            if (!strategyData.borrowAmount) {
              errors.push(`Borrow against LP strategy "${data.label}" missing borrow amount`);
            }
            break;
          case 'hedged-lp':
            if (!strategyData.collateralAsset) {
              errors.push(`Hedged LP strategy "${data.label}" missing collateral asset`);
            }
            if (!strategyData.borrowAsset) {
              errors.push(`Hedged LP strategy "${data.label}" missing borrow asset`);
            }
            break;
          case 'jit-liquidity':
            if (!strategyData.jitAsset) {
              errors.push(`JIT liquidity strategy "${data.label}" missing JIT asset`);
            }
            if (!strategyData.jitAmount) {
              errors.push(`JIT liquidity strategy "${data.label}" missing JIT amount`);
            }
            if (!strategyData.jitAction) {
              errors.push(`JIT liquidity strategy "${data.label}" missing JIT action`);
            }
            break;
        }
        break;

      case 'lp-toolkit':
        const lpData = data as LpToolkitNodeData;
        switch (lpData.action) {
          case 'create-pool':
            if (!lpData.vault0) {
              errors.push(`Create pool node "${data.label}" missing vault 0`);
            }
            if (!lpData.vault1) {
              errors.push(`Create pool node "${data.label}" missing vault 1`);
            }
            if (!lpData.fee) {
              errors.push(`Create pool node "${data.label}" missing fee`);
            }
            break;
          case 'add-liquidity':
          case 'remove-liquidity':
            if (!lpData.amount0) {
              errors.push(`${lpData.action} node "${data.label}" missing amount 0`);
            }
            if (!lpData.amount1) {
              errors.push(`${lpData.action} node "${data.label}" missing amount 1`);
            }
            if (!lpData.poolAddress && (lpData.action === 'add-liquidity' || lpData.action === 'remove-liquidity')) {
              errors.push(`${lpData.action} node "${data.label}" missing pool address`);
            }
            break;
        }
        break;

      case 'control':
        // Control nodes are always valid - no configuration needed
        break;

      default:
        const nodeData = data as NodeData;
        errors.push(`Unknown node category "${nodeData.category}" in node "${nodeData.label}"`);
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
      
      // Convert nodes to NodeData and execute
      const nodeDataSequence = executionOrder
        .map(nodeId => nodes.find(n => n.id === nodeId))
        .filter(node => node && node.data.category !== 'control')
        .map(node => node!.data as NodeData);
  
      // Use the new executor
      const batchOperations = await EulerWorkflowExecutor.executeNodeSequence(nodeDataSequence);
  
      // Create execution steps
      const steps: ExecutionStep[] = batchOperations.map((operation, index) => ({
        nodeId: executionOrder[index] || `step-${index}`,
        operation,
        status: 'pending',
      }));
  
      setExecutionSteps(steps);
  
      // Execute the operations (simulate for now)
      for (let i = 0; i < steps.length; i++) {
        setCurrentStep(i);
        
        setExecutionSteps(prev => 
          prev.map((step, index) => 
            index === i ? { ...step, status: 'executing' } : step
          )
        );
  
        // Simulate execution
        await new Promise(resolve => setTimeout(resolve, 1000));
  
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
      // Handle errors...
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    } finally {
      setIsExecuting(false);
    }
  }, [validateWorkflow, getExecutionOrder]);

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