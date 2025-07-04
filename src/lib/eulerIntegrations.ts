// src/lib/eulerIntegrations.ts (Fixed)
import type { NodeData, CoreActionNodeData, StrategyNodeData, LpToolkitNodeData } from '../types/nodes';
import { EulerPrimitives, type BatchOperation } from './euler/primitives';
import { DEVLAND_ADDRESSES, DEVLAND_USER, getVaultAddress } from './euler/addresses';
import { EulerStrategies } from './euler/strategies';

export class EulerWorkflowExecutor {
  private static primitives: EulerPrimitives;
  private static strategies: EulerStrategies;
  private static initialized = false;

  static async initialize() {
    if (!this.initialized) {
      this.primitives = new EulerPrimitives(DEVLAND_ADDRESSES, DEVLAND_USER);
      this.strategies = new EulerStrategies(DEVLAND_ADDRESSES, DEVLAND_USER);
      this.initialized = true;
      console.log('🔧 EulerWorkflowExecutor initialized with devland addresses');
    }
  }

  static async executeNodeSequence(nodes: NodeData[]): Promise<BatchOperation[]> {
    await this.initialize();
    
    const operations: BatchOperation[] = [];
    
    for (const node of nodes) {
      const nodeOps = await this.nodeToOperations(node);
      operations.push(...nodeOps);
    }
    
    console.log(`📦 Generated ${operations.length} batch operations from ${nodes.length} nodes`);
    return operations;
  }

  private static async nodeToOperations(node: NodeData): Promise<BatchOperation[]> {
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
        console.warn(`Unknown node category: ${node.category}`);
        return [];
    }
  }

  private static async handleCoreAction(data: CoreActionNodeData): Promise<BatchOperation[]> {
    console.log(`🔧 Processing core action: ${data.action}`);
    console.log(`🔧 Node data:`, data);
    
    switch (data.action) {
      case 'supply': {
        // Check if vaultAddress is properly set
        if (!data.vaultAddress) {
          throw new Error(`Supply action missing vault address. Available fields: ${Object.keys(data).join(', ')}`);
        }
        
        // Try to get vault address by symbol first, then use direct address
        let vaultAddress;
        try {
          vaultAddress = getVaultAddress(data.vaultAddress as keyof typeof DEVLAND_ADDRESSES.vaults);
        } catch (error) {
          // If not a known symbol, try to use as direct address
          if (data.vaultAddress.startsWith('0x')) {
            vaultAddress = data.vaultAddress as `0x${string}`;
          } else {
            throw new Error(`Invalid vault address: ${data.vaultAddress}. Must be one of: ${Object.keys(DEVLAND_ADDRESSES.vaults).join(', ')}`);
          }
        }
        
        const amount = this.parseAmount(data.amount);
        console.log(`💰 Supply ${amount} to vault ${vaultAddress} (${data.vaultAddress})`);
        return [this.primitives.supplyToVault(vaultAddress, amount, DEVLAND_USER)];
      }
      
      case 'withdraw': {
        if (!data.vaultAddress) {
          throw new Error(`Withdraw action missing vault address`);
        }
        const vaultAddress = getVaultAddress(data.vaultAddress as keyof typeof DEVLAND_ADDRESSES.vaults);
        const amount = this.parseAmount(data.amount);
        return [this.primitives.withdrawFromVault(vaultAddress, amount, DEVLAND_USER)];
      }
      
      case 'borrow': {
        if (!data.vaultAddress) {
          throw new Error(`Borrow action missing vault address`);
        }
        const vaultAddress = getVaultAddress(data.vaultAddress as keyof typeof DEVLAND_ADDRESSES.vaults);
        const amount = this.parseAmount(data.amount);
        return [this.primitives.borrowFromVault(vaultAddress, amount, DEVLAND_USER)];
      }
      
      case 'repay': {
        if (!data.vaultAddress) {
          throw new Error(`Repay action missing vault address`);
        }
        const vaultAddress = getVaultAddress(data.vaultAddress as keyof typeof DEVLAND_ADDRESSES.vaults);
        const amount = this.parseAmount(data.amount);
        return [this.primitives.repayToVault(vaultAddress, amount)];
      }
      
      case 'permissions': {
        const ops: BatchOperation[] = [];
        
        // Enable collaterals
        if (data.collaterals) {
          data.collaterals.forEach(collateral => {
            const vaultAddress = getVaultAddress(collateral as keyof typeof DEVLAND_ADDRESSES.vaults);
            ops.push(this.primitives.enableCollateral(vaultAddress));
          });
        }
        
        // Enable controller
        if (data.controller) {
          const vaultAddress = getVaultAddress(data.controller as keyof typeof DEVLAND_ADDRESSES.vaults);
          ops.push(this.primitives.enableController(vaultAddress));
        }
        
        return ops;
      }
      
      case 'swap': {
        // TODO: Implement swap through EulerSwap
        console.warn('Swap action not yet implemented');
        return [];
      }
      
      default:
        console.warn(`Unknown core action: ${data.action}`);
        return [];
    }
  }

  private static async handleStrategy(data: StrategyNodeData): Promise<BatchOperation[]> {
    console.log(`🎯 Processing strategy: ${data.strategyType}`);
    
    switch (data.strategyType) {
      case 'leverage': {
        if (!data.collateralAsset || !data.borrowAsset) {
          throw new Error('Leverage strategy requires collateralAsset and borrowAsset');
        }
        
        const collateralVault = getVaultAddress(data.collateralAsset as keyof typeof DEVLAND_ADDRESSES.vaults);
        const borrowVault = getVaultAddress(data.borrowAsset as keyof typeof DEVLAND_ADDRESSES.vaults);
        const amount = this.parseAmount(data.amount as string | undefined);
        const leverageFactor = data.leverageFactor || 2;
        
        return this.strategies.createLeverageStrategy(
          collateralVault,
          borrowVault,
          amount,
          leverageFactor
        );
      }
      
      case 'borrow-against-lp': {
        if (!data.collateralAsset || !data.borrowAsset) {
          throw new Error('Borrow against LP strategy requires collateralAsset and borrowAsset');
        }
        
        const lpVault = getVaultAddress(data.collateralAsset as keyof typeof DEVLAND_ADDRESSES.vaults);
        const borrowVault = getVaultAddress(data.borrowAsset as keyof typeof DEVLAND_ADDRESSES.vaults);
        const borrowAmount = this.parseAmount(data.borrowAmount);
        
        return this.strategies.createLpCollateralizationStrategy(
          lpVault,
          borrowVault,
          borrowAmount
        );
      }
      
      default:
        console.warn(`Strategy type not implemented: ${data.strategyType}`);
        return [];
    }
  }

  private static async handleLpToolkit(data: LpToolkitNodeData): Promise<BatchOperation[]> {
    console.log(`🌊 LP toolkit action not yet implemented: ${data.action}`);
    return [];
  }

  // Helper to parse amount strings (enhanced)
  private static parseAmount(amount?: string): bigint {
    if (!amount) {
      console.warn('No amount provided, defaulting to 0');
      return 0n;
    }
    
    try {
      // Remove any whitespace
      const cleanAmount = amount.trim();
      
      // Handle percentage amounts (e.g., "50%")
      if (cleanAmount.endsWith('%')) {
        console.warn('Percentage amounts not yet implemented, defaulting to 1000');
        return BigInt(1000 * 1e18); // Default for testing
      }
      
      // Handle decimal amounts - convert to wei (assuming 18 decimals)
      const num = parseFloat(cleanAmount);
      if (isNaN(num)) {
        console.error('Invalid amount format:', amount);
        return 0n;
      }
      
      return BigInt(Math.floor(num * 1e18));
    } catch (error) {
      console.error('Failed to parse amount:', amount, error);
      return 0n;
    }
  }
}