import type { Address } from 'viem';
import { EulerPrimitives, type BatchOperation } from './primitives';
import type { DevlandAddresses } from './addresses';

export class EulerStrategies {
  private primitives: EulerPrimitives;

  constructor(addresses: DevlandAddresses, userAccount: Address) {
    this.primitives = new EulerPrimitives(addresses, userAccount);
  }

  // Strategy: Basic Leverage
  createLeverageStrategy(
    collateralVault: Address,
    borrowVault: Address,
    initialAmount: bigint,
    leverageFactor: number
  ): BatchOperation[] {
    console.log(`  🚀 Creating leverage strategy: ${leverageFactor}x`);
    
    const borrowAmount = (initialAmount * BigInt(Math.floor((leverageFactor - 1) * 100))) / 100n;
    
    return [
      // Setup permissions
      this.primitives.enableCollateral(collateralVault),
      this.primitives.enableController(borrowVault),
      
      // Supply initial collateral
      this.primitives.supplyToVault(collateralVault, initialAmount, this.primitives['userAccount']),
      
      // Borrow against it
      this.primitives.borrowFromVault(borrowVault, borrowAmount, this.primitives['userAccount']),
      
      // Note: For full leverage, we'd need to add swap + supply steps
    ];
  }

  // Strategy: LP Collateralization
  createLpCollateralizationStrategy(
    lpTokenVault: Address,
    borrowVault: Address,
    borrowAmount: bigint
  ): BatchOperation[] {
    console.log(`  🌊 Creating LP collateralization strategy`);
    
    return [
      this.primitives.enableCollateral(lpTokenVault),
      this.primitives.enableController(borrowVault),
      this.primitives.borrowFromVault(borrowVault, borrowAmount, this.primitives['userAccount']),
    ];
  }

  // Strategy: Hedged LP Position
  createHedgedLpStrategy(
    asset0Vault: Address,
    asset1Vault: Address,
    amount0: bigint,
    borrowAmount1: bigint
  ): BatchOperation[] {
    console.log(`  ⚖️ Creating hedged LP strategy`);
    
    return [
      this.primitives.enableCollateral(asset0Vault),
      this.primitives.enableController(asset1Vault),
      this.primitives.supplyToVault(asset0Vault, amount0, this.primitives['userAccount']),
      this.primitives.borrowFromVault(asset1Vault, borrowAmount1, this.primitives['userAccount']),
      // Note: Would need to add LP creation step
    ];
  }

  // Strategy: JIT Liquidity (Deposit)
  createJitDepositStrategy(
    borrowVault: Address,
    poolVault: Address,
    borrowAmount: bigint
  ): BatchOperation[] {
    console.log(`  ⚡ Creating JIT deposit strategy`);
    
    return [
      this.primitives.enableController(borrowVault),
      this.primitives.borrowFromVault(borrowVault, borrowAmount, this.primitives['userAccount']),
      // Note: Would need to add pool deposit step
    ];
  }

  // Strategy: JIT Liquidity (Withdrawal)
  createJitWithdrawalStrategy(
    poolVault: Address,
    repayVault: Address,
    withdrawAmount: bigint,
    repayAmount: bigint
  ): BatchOperation[] {
    console.log(`  ⚡ Creating JIT withdrawal strategy`);
    
    return [
      // Note: Would need pool withdrawal step
      this.primitives.repayToVault(repayVault, repayAmount),
    ];
  }
}