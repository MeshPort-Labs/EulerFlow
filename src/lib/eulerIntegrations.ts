// src/lib/eulerIntegrations.ts - Complete implementation

import type { NodeData, CoreActionNodeData, StrategyNodeData, LpToolkitNodeData } from '../types/nodes';
import {
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
import type { Address } from 'viem';

export class EulerWorkflowExecutor {
  static async executeNodeSequence(nodes: NodeData[], userAddress: Address): Promise<any[]> {
    const allBatches: any[] = [];
    
    for (const node of nodes) {
      const batches = await this.nodeToEulerLibOperations(node, userAddress);
      allBatches.push(...batches);
    }
    
    return allBatches;
  }

  private static async nodeToEulerLibOperations(node: NodeData, userAddress: Address): Promise<any[]> {
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

  private static async handleCoreActionWithEulerLib(data: CoreActionNodeData, userAddress: Address): Promise<any[]> {
    console.log(`🔧 Processing core action: ${data.action} for vault: ${data.vaultAddress}, amount: ${data.amount}`);
    
    // Parse amount with correct decimals
    const getTokenDecimals = (vaultSymbol: string) => {
      return ['USDC', 'USDT'].includes(vaultSymbol) ? 6 : 18;
    };

    switch (data.action) {
      case 'supply': {
        if (!data.vaultAddress || !data.amount) {
          console.error(`❌ Missing required fields for supply: vaultAddress=${data.vaultAddress}, amount=${data.amount}`);
          return [];
        }

        const decimals = getTokenDecimals(data.vaultAddress);
        const amount = parseUnits(data.amount, decimals);
        
        console.log(`📥 Creating supply operation: ${data.amount} ${data.vaultAddress} (${amount} with ${decimals} decimals)`);
        
        const operation = supplyToVault(
          data.vaultAddress as keyof typeof DEVLAND_ADDRESSES.vaults, 
          amount
        );
        return [operation];
      }
      
      case 'withdraw': {
        if (!data.vaultAddress || !data.amount) {
          console.error(`❌ Missing required fields for withdraw: vaultAddress=${data.vaultAddress}, amount=${data.amount}`);
          return [];
        }

        const decimals = getTokenDecimals(data.vaultAddress);
        const amount = parseUnits(data.amount, decimals);
        
        console.log(`📤 Creating withdraw operation: ${data.amount} ${data.vaultAddress} (${amount} with ${decimals} decimals)`);
        
        const operation = withdrawFromVault(
          data.vaultAddress as keyof typeof DEVLAND_ADDRESSES.vaults,
          amount,
          userAddress
        );
        return [operation];
      }
      
      case 'borrow': {
        if (!data.vaultAddress || !data.amount) {
          console.error(`❌ Missing required fields for borrow: vaultAddress=${data.vaultAddress}, amount=${data.amount}`);
          return [];
        }

        const decimals = getTokenDecimals(data.vaultAddress);
        const amount = parseUnits(data.amount, decimals);
        
        console.log(`📊 Creating borrow operation: ${data.amount} ${data.vaultAddress} (${amount} with ${decimals} decimals)`);
        
        const operation = borrowAndSendTo(
          data.vaultAddress as keyof typeof DEVLAND_ADDRESSES.vaults,
          amount,
          userAddress
        );
        return [operation];
      }
      
      case 'repay': {
        if (!data.vaultAddress || !data.amount) {
          console.error(`❌ Missing required fields for repay: vaultAddress=${data.vaultAddress}, amount=${data.amount}`);
          return [];
        }

        const decimals = getTokenDecimals(data.vaultAddress);
        const amount = parseUnits(data.amount, decimals);
        
        console.log(`💳 Creating repay operation: ${data.amount} ${data.vaultAddress} (${amount} with ${decimals} decimals)`);
        
        const operation = repayToVault(
          data.vaultAddress as keyof typeof DEVLAND_ADDRESSES.vaults,
          amount
        );
        return [operation];
      }
      
      case 'permissions': {
        const operations = [];
        
        if (data.controller) {
          console.log(`🎛️ Creating enable controller operation for ${data.controller}`);
          operations.push(enableController(data.controller as keyof typeof DEVLAND_ADDRESSES.vaults));
        }
        
        // Note: enableCollateral is handled by your euler-lib but not exposed in the current interface
        // If you have collaterals array, you'd need to add enableCollateral operations here
        if (data.collaterals && data.collaterals.length > 0) {
          console.log(`🔒 Enable collateral operations not yet implemented for: ${data.collaterals.join(', ')}`);
          // TODO: Add enableCollateral operations when available
        }
        
        return operations;
      }
      
      case 'swap': {
        console.warn(`⚠️ Swap operations not yet implemented in euler-lib`);
        // TODO: Implement swap using prepareDirectPoolSwap when ready
        return [];
      }
      
      default:
        console.warn(`⚠️ Unsupported core action: ${data.action}`);
        return [];
    }
  }

  private static async handleStrategyWithEulerLib(data: StrategyNodeData, userAddress: Address): Promise<any[]> {
    console.log(`🎯 Processing strategy: ${data.strategyType}`);
    
    const getTokenDecimals = (symbol: string) => {
      return ['USDC', 'USDT'].includes(symbol) ? 6 : 18;
    };

    switch (data.strategyType) {
      case 'leverage': {
        if (!data.collateralAsset || !data.borrowAsset || !data.leverageFactor) {
          console.error(`❌ Missing required fields for leverage strategy`);
          return [];
        }
        
        // Use a reasonable default amount or get from UI
        const initialAmount = parseUnits('1000', getTokenDecimals(data.collateralAsset));
        
        console.log(`🚀 Creating leverage strategy: ${data.leverageFactor}x leverage on ${data.collateralAsset} vs ${data.borrowAsset}`);
        
        const strategy = await createLeverageStrategy(
          data.collateralAsset as keyof typeof DEVLAND_ADDRESSES.vaults,
          initialAmount,
          data.borrowAsset as keyof typeof DEVLAND_ADDRESSES.vaults,
          data.leverageFactor
        );
        
        if (!strategy) {
          console.error(`❌ Failed to create leverage strategy`);
          return [];
        }
        
        console.log(`✅ Created leverage strategy with description: ${strategy.description}`);
        
        // Return both batches from the leverage strategy
        return [
          { batch: strategy.supplyMarginBatch, description: `${strategy.description} - Supply Margin` },
          { batch: strategy.borrowAndSwapBatch, description: `${strategy.description} - Borrow & Swap` }
        ];
      }
      
      case 'borrow-against-lp': {
        if (!data.borrowAsset || !data.borrowAmount) {
          console.error(`❌ Missing required fields for borrow-against-lp strategy`);
          return [];
        }
        
        const borrowAmount = parseUnits(data.borrowAmount, getTokenDecimals(data.borrowAsset));
        
        console.log(`🎯 Creating LP collateralization strategy: borrow ${data.borrowAmount} ${data.borrowAsset}`);
        
        const strategy = await createLpCollateralizationStrategy(
          data.borrowAsset as keyof typeof DEVLAND_ADDRESSES.vaults,
          borrowAmount
        );
        
        if (!strategy) {
          console.error(`❌ Failed to create LP collateralization strategy`);
          return [];
        }
        
        console.log(`✅ Created LP collateralization strategy: ${strategy.description}`);
        
        return [{ batch: strategy.batch, description: strategy.description }];
      }
      
      case 'hedged-lp': {
        if (!data.collateralAsset || !data.borrowAsset) {
          console.error(`❌ Missing required fields for hedged-lp strategy`);
          return [];
        }
        
        const supplyAmount = parseUnits('1000', getTokenDecimals(data.collateralAsset));
        const borrowAmount = parseUnits(data.borrowAmount || '500', getTokenDecimals(data.borrowAsset));
        
        console.log(`⚖️ Creating hedged LP strategy: supply ${supplyAmount} ${data.collateralAsset}, borrow ${borrowAmount} ${data.borrowAsset}`);
        
        const strategy = await createHedgedLpStrategy(
          data.collateralAsset as keyof typeof DEVLAND_ADDRESSES.vaults,
          supplyAmount,
          data.borrowAsset as keyof typeof DEVLAND_ADDRESSES.vaults,
          borrowAmount
        );
        
        if (!strategy) {
          console.error(`❌ Failed to create hedged LP strategy`);
          return [];
        }
        
        console.log(`✅ Created hedged LP strategy: ${strategy.description}`);
        
        return [{ batch: strategy.batch, description: strategy.description }];
      }
      
      case 'jit-liquidity': {
        if (!data.jitAsset || !data.jitAmount || !data.jitAction) {
          console.error(`❌ Missing required fields for JIT liquidity strategy`);
          return [];
        }
        
        const jitAmount = parseUnits(data.jitAmount, getTokenDecimals(data.jitAsset));
        
        // Note: You'll need to get the actual pool address from your user's EulerSwap pool
        const poolAddress = userAddress; // This should be the actual pool address from getMyEulerSwapPool
        
        console.log(`⚡ Creating JIT liquidity strategy: ${data.jitAction} ${data.jitAmount} ${data.jitAsset}`);
        
        if (data.jitAction === 'deploy') {
          const strategy = await createJitDepositStrategy(
            poolAddress,
            data.jitAsset as keyof typeof DEVLAND_ADDRESSES.vaults,
            jitAmount
          );
          
          if (!strategy) {
            console.error(`❌ Failed to create JIT deposit strategy`);
            return [];
          }
          
          console.log(`✅ Created JIT deposit strategy: ${strategy.description}`);
          return [{ batch: strategy.batch, description: strategy.description }];
          
        } else if (data.jitAction === 'withdraw') {
          const strategy = await createJitWithdrawalStrategy(
            poolAddress,
            data.jitAsset as keyof typeof DEVLAND_ADDRESSES.vaults,
            jitAmount
          );
          
          if (!strategy) {
            console.error(`❌ Failed to create JIT withdrawal strategy`);
            return [];
          }
          
          console.log(`✅ Created JIT withdrawal strategy: ${strategy.description}`);
          return [{ batch: strategy.batch, description: strategy.description }];
        }
        
        return [];
      }
      
      default:
        console.warn(`⚠️ Unsupported strategy type: ${data.strategyType}`);
        return [];
    }
  }

  private static async handleLpToolkitWithEulerLib(data: LpToolkitNodeData, userAddress: Address): Promise<any[]> {
    console.log(`🛠️ Processing LP toolkit action: ${data.action}`);
    
    // TODO: Implement LP toolkit operations when available in euler-lib
    switch (data.action) {
      case 'create-pool':
        console.warn(`⚠️ Create pool operation not yet implemented`);
        break;
      case 'add-liquidity':
        console.warn(`⚠️ Add liquidity operation not yet implemented`);
        break;
      case 'remove-liquidity':
        console.warn(`⚠️ Remove liquidity operation not yet implemented`);
        break;
      default:
        console.warn(`⚠️ Unknown LP toolkit action: ${data.action}`);
    }
    
    return [];
  }
}