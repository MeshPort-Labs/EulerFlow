// src/lib/eulerIntegrations.ts
import type { NodeData, CoreActionNodeData, StrategyNodeData, LpToolkitNodeData } from '../types/nodes';
import {
  executeEVCBatch,
  supplyToVault,
  borrowAndSendTo,
  repayToVault,
  withdrawFromVault,
  enableController,
  createLeverageStrategy,
  createLpCollateralizationStrategy,
  createHedgedLpStrategy,
  createJitDepositStrategy,
  createJitWithdrawalStrategy,
} from './euler/eulerLib';
import { DEVLAND_ADDRESSES } from './euler/addresses';
import { parseUnits } from 'viem';
import { useAccount } from 'wagmi';

export class EulerWorkflowExecutor {
  static async executeNodeSequence(nodes: NodeData[], userAddress: string): Promise<any[]> {
    const allBatches: any[] = [];
    
    for (const node of nodes) {
      const batches = await this.nodeToEulerLibOperations(node, userAddress);
      allBatches.push(...batches);
    }
    
    return allBatches;
  }

  private static async nodeToEulerLibOperations(node: NodeData, userAddress: string): Promise<any[]> {
    switch (node.category) {
      case 'core':
        return this.handleCoreActionWithEulerLib(node as CoreActionNodeData, userAddress);
      case 'strategy':
        return this.handleStrategyWithEulerLib(node as StrategyNodeData, userAddress);
      case 'lp-toolkit':
        return this.handleLpToolkitWithEulerLib(node as LpToolkitNodeData, userAddress);
      default:
        return [];
    }
  }

  private static async handleCoreActionWithEulerLib(data: CoreActionNodeData, userAddress: string): Promise<any[]> {
    const amount = parseUnits(data.amount || '0', 6); // Adjust decimals as needed
    
    switch (data.action) {
      case 'supply': {
        const strategy = await supplyToVault(
          data.vaultAddress as keyof typeof DEVLAND_ADDRESSES.vaults, 
          amount
        );
        return [strategy];
      }
      
      case 'borrow': {
        const strategy = await borrowAndSendTo(
          data.vaultAddress as keyof typeof DEVLAND_ADDRESSES.vaults,
          amount,
          userAddress as any // Send borrowed assets to user's address
        );
        return [strategy];
      }
      
      case 'repay': {
        const strategy = await repayToVault(
          data.vaultAddress as keyof typeof DEVLAND_ADDRESSES.vaults,
          amount
        );
        return [strategy];
      }
      
      case 'withdraw': {
        const strategy = await withdrawFromVault(
          data.vaultAddress as keyof typeof DEVLAND_ADDRESSES.vaults,
          amount,
          userAddress as any // Send withdrawn assets to user's address
        );
        return [strategy];
      }
      
      case 'permissions': {
        const batches = [];
        if (data.controller) {
          batches.push(enableController(data.controller as keyof typeof DEVLAND_ADDRESSES.vaults));
        }
        return batches;
      }
      
      default:
        return [];
    }
  }

  private static async handleStrategyWithEulerLib(data: StrategyNodeData, userAddress: string): Promise<any[]> {
    const amount = parseUnits(data.amount as string || '1000', 6);
    
    switch (data.strategyType) {
      case 'leverage': {
        const strategy = await createLeverageStrategy(
          data.collateralAsset as keyof typeof DEVLAND_ADDRESSES.vaults,
          amount,
          data.borrowAsset as keyof typeof DEVLAND_ADDRESSES.vaults,
          data.leverageFactor || 2
        );
        return strategy ? [strategy.supplyMarginBatch, strategy.borrowAndSwapBatch] : [];
      }
      
      case 'borrow-against-lp': {
        const borrowAmount = parseUnits(data.borrowAmount || '500', 6);
        const strategy = await createLpCollateralizationStrategy(
          data.borrowAsset as keyof typeof DEVLAND_ADDRESSES.vaults,
          borrowAmount
        );
        return strategy ? [strategy] : [];
      }
      
      case 'hedged-lp': {
        const borrowAmount = parseUnits(data.borrowAmount || '500', 18);
        const strategy = await createHedgedLpStrategy(
          data.collateralAsset as keyof typeof DEVLAND_ADDRESSES.vaults,
          amount,
          data.borrowAsset as keyof typeof DEVLAND_ADDRESSES.vaults,
          borrowAmount
        );
        return strategy ? [strategy] : [];
      }
      
      case 'jit-liquidity': {
        const jitAmount = parseUnits(data.jitAmount || '1000', 6);
        if (data.jitAction === 'deploy') {
          const strategy = await createJitDepositStrategy(
            userAddress as any, // Pool address - you'll need to get this properly
            data.jitAsset as keyof typeof DEVLAND_ADDRESSES.vaults,
            jitAmount
          );
          return strategy ? [strategy] : [];
        } else {
          const strategy = await createJitWithdrawalStrategy(
            userAddress as any, // Pool address
            data.jitAsset as keyof typeof DEVLAND_ADDRESSES.vaults,
            jitAmount
          );
          return strategy ? [strategy] : [];
        }
      }
      
      default:
        return [];
    }
  }

  private static async handleLpToolkitWithEulerLib(data: LpToolkitNodeData, userAddress: string): Promise<any[]> {
    // LP Toolkit operations would need to be implemented in euler-lib
    console.log('LP Toolkit operations not yet implemented in euler-lib');
    return [];
  }
}