// src/lib/eulerIntegration.ts
import type { NodeData, CoreActionNodeData, StrategyNodeData, LpToolkitNodeData } from '../types/nodes';
import type { BatchOperation } from '../types/euler';

// Import your euler-lib functions
// import { 
//   supplyToVault, 
//   borrowAndSendTo, 
//   createLeverageStrategy,
//   createLpCollateralizationStrategy,
//   // ... other functions
// } from 'euler-lib';

export class EulerWorkflowExecutor {
  
  static async executeNodeSequence(nodes: NodeData[]): Promise<BatchOperation[]> {
    const operations: BatchOperation[] = [];
    
    for (const node of nodes) {
      const nodeOps = await this.nodeToOperations(node);
      operations.push(...nodeOps);
    }
    
    return operations;
  }

  static async nodeToOperations(node: NodeData): Promise<BatchOperation[]> {
    switch (node.category) {
      case 'core':
        return this.handleCoreAction(node as CoreActionNodeData);
      case 'strategy':
        return this.handleStrategy(node as StrategyNodeData);
      case 'lp-toolkit':
        return this.handleLpToolkit(node as LpToolkitNodeData);
      case 'control':
        return []; // Control nodes don't generate operations
      default:
        return [];
    }
  }

  private static async handleCoreAction(data: CoreActionNodeData): Promise<BatchOperation[]> {
    // Convert UI data to euler-lib function calls
    switch (data.action) {
      case 'supply':
        // return [supplyToVault(data.vaultAddress, parseUnits(data.amount, 18))];
        return [{
          target: data.vaultAddress!,
          value: 0n,
          calldata: `0x${Buffer.from(`deposit(${data.amount})`).toString('hex')}`,
        }];
      
      case 'withdraw':
        // return [withdrawFromVault(data.vaultAddress, parseUnits(data.amount, 18), userAddress)];
        return [{
          target: data.vaultAddress!,
          value: 0n,
          calldata: `0x${Buffer.from(`withdraw(${data.amount})`).toString('hex')}`,
        }];
      
      case 'borrow':
        // return [borrowAndSendTo(data.vaultAddress, parseUnits(data.amount, 18), userAddress)];
        return [{
          target: data.vaultAddress!,
          value: 0n,
          calldata: `0x${Buffer.from(`borrow(${data.amount})`).toString('hex')}`,
        }];
      
      case 'repay':
        // return [repayToVault(data.vaultAddress, parseUnits(data.amount, 18))];
        return [{
          target: data.vaultAddress!,
          value: 0n,
          calldata: `0x${Buffer.from(`repay(${data.amount})`).toString('hex')}`,
        }];
      
      case 'swap':
        // return [await prepareDirectPoolSwap(poolAddress, data.tokenIn, data.tokenOut, amount, minOut, receiver)];
        return [{
          target: '0x2Bba09866b6F1025258542478C39720A09B728bF', // Swapper
          value: 0n,
          calldata: `0x${Buffer.from(`swap(${data.tokenIn},${data.tokenOut},${data.amount})`).toString('hex')}`,
        }];
      
      case 'permissions':
        // return [enableCollateral(data.controller), ...data.collaterals.map(c => enableCollateral(c))];
        return [{
          target: '0x0C9a3dd6b8F28529d72d7f9cE918D493519EE383', // EVC
          value: 0n,
          calldata: `0x${Buffer.from(`enableCollateral(${data.controller})`).toString('hex')}`,
        }];
      
      default:
        return [];
    }
  }

  private static async handleStrategy(data: StrategyNodeData): Promise<BatchOperation[]> {
    // Convert UI data to euler-lib strategy composer calls
    switch (data.strategyType) {
      case 'leverage':
        // const strategy = await createLeverageStrategy(
        //   data.collateralAsset, 
        //   parseUnits(data.collateralAmount, 18),
        //   data.borrowAsset,
        //   data.leverageFactor
        // );
        // return strategy.supplyMarginBatch.concat(strategy.borrowAndSwapBatch);
        return [{
          target: '0x0000000000000000000000000000000000000000', // Strategy executor
          value: 0n,
          calldata: `0x${Buffer.from(`leverage(${data.collateralAsset},${data.borrowAsset},${data.leverageFactor})`).toString('hex')}`,
        }];
      
      case 'borrow-against-lp':
        // const lpStrategy = await createLpCollateralizationStrategy(
        //   data.borrowAsset,
        //   parseUnits(data.borrowAmount, 18)
        // );
        // return lpStrategy.batch;
        return [{
          target: '0x0000000000000000000000000000000000000000',
          value: 0n,
          calldata: `0x${Buffer.from(`borrowAgainstLP(${data.borrowAsset},${data.borrowAmount})`).toString('hex')}`,
        }];
      
      case 'hedged-lp':
        // const hedgedStrategy = await createHedgedLpStrategy(
        //   data.collateralAsset,
        //   parseUnits(data.collateralAmount, 18),
        //   data.borrowAsset,
        //   parseUnits(data.borrowAmount, 18)
        // );
        // return hedgedStrategy.batch;
        return [{
          target: '0x0000000000000000000000000000000000000000',
          value: 0n,
          calldata: `0x${Buffer.from(`hedgedLP(${data.collateralAsset},${data.borrowAsset})`).toString('hex')}`,
        }];
      
      case 'jit-liquidity':
        // if (data.jitAction === 'deploy') {
        //   const jitDeployStrategy = await createJitDepositStrategy(
        //     poolAddress,
        //     data.jitAsset,
        //     parseUnits(data.jitAmount, 18)
        //   );
        //   return jitDeployStrategy.batch;
        // } else {
        //   const jitWithdrawStrategy = await createJitWithdrawalStrategy(
        //     poolAddress,
        //     data.jitAsset,
        //     parseUnits(data.jitAmount, 18)
        //   );
        //   return jitWithdrawStrategy.batch;
        // }
        return [{
          target: '0x0000000000000000000000000000000000000000',
          value: 0n,
          calldata: `0x${Buffer.from(`jitLiquidity(${data.jitAsset},${data.jitAmount},${data.jitAction})`).toString('hex')}`,
        }];
      
      default:
        return [];
    }
  }

  private static async handleLpToolkit(data: LpToolkitNodeData): Promise<BatchOperation[]> {
    switch (data.action) {
      case 'create-pool':
        // Call EulerSwap factory to create pool
        return [{
          target: '0x55d09f01fBF9D8D891c6608C5a54EA7AD6d528fb', // EulerSwap Factory
          value: 0n,
          calldata: `0x${Buffer.from(`createPool(${data.vault0},${data.vault1},${data.fee})`).toString('hex')}`,
        }];
      
      case 'add-liquidity':
        // Add liquidity to existing pool
        return [{
          target: data.poolAddress!,
          value: 0n,
          calldata: `0x${Buffer.from(`addLiquidity(${data.amount0},${data.amount1})`).toString('hex')}`,
        }];
      
      case 'remove-liquidity':
        // Remove liquidity from pool
        return [{
          target: data.poolAddress!,
          value: 0n,
          calldata: `0x${Buffer.from(`removeLiquidity(${data.amount0},${data.amount1})`).toString('hex')}`,
        }];
      
      default:
        return [];
    }
  }
}