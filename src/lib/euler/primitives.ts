import { encodeFunctionData, type Address, type Hex } from 'viem';
import { EVC_ABI, EVAULT_ABI, EULERSWAP_ABI } from './abis';
import { DEVLAND_ADDRESSES, type DevlandAddresses } from './addresses';
import { publicClient } from '../wallet/devlandWallet';

export interface BatchOperation {
  targetContract: Address;
  value: bigint;
  data: Hex;
  onBehalfOfAccount?: Address;
}

export class EulerPrimitives {
  constructor(
    private addresses: DevlandAddresses,
    private userAccount: Address
  ) {}

  // EVC Operations
  enableCollateral(collateralVault: Address): BatchOperation {
    console.log(`  🔒 Enabling collateral: ${collateralVault}`);
    return {
      targetContract: this.addresses.evc,
      value: 0n,
      data: encodeFunctionData({
        abi: EVC_ABI,
        functionName: 'enableCollateral',
        args: [this.userAccount, collateralVault],
      }),
    };
  }

  enableController(controllerVault: Address): BatchOperation {
    console.log(`  🎛️ Enabling controller: ${controllerVault}`);
    return {
      targetContract: this.addresses.evc,
      value: 0n,
      data: encodeFunctionData({
        abi: EVC_ABI,
        functionName: 'enableController',
        args: [this.userAccount, controllerVault],
      }),
    };
  }

  // Vault Operations
  supplyToVault(vaultAddress: Address, amount: bigint, receiver: Address): BatchOperation {
    console.log(`  💰 Supply ${amount} to vault ${vaultAddress}`);
    return {
      targetContract: vaultAddress,
      value: 0n,
      data: encodeFunctionData({
        abi: EVAULT_ABI,
        functionName: 'deposit',
        args: [amount, receiver],
      }),
      onBehalfOfAccount: this.userAccount,
    };
  }

  withdrawFromVault(vaultAddress: Address, amount: bigint, receiver: Address): BatchOperation {
    console.log(`  📤 Withdraw ${amount} from vault ${vaultAddress}`);
    return {
      targetContract: vaultAddress,
      value: 0n,
      data: encodeFunctionData({
        abi: EVAULT_ABI,
        functionName: 'withdraw',
        args: [amount, receiver, this.userAccount],
      }),
      onBehalfOfAccount: this.userAccount,
    };
  }

  borrowFromVault(vaultAddress: Address, amount: bigint, receiver: Address): BatchOperation {
    console.log(`  📊 Borrow ${amount} from vault ${vaultAddress}`);
    return {
      targetContract: vaultAddress,
      value: 0n,
      data: encodeFunctionData({
        abi: EVAULT_ABI,
        functionName: 'borrow',
        args: [amount, receiver],
      }),
      onBehalfOfAccount: this.userAccount,
    };
  }

  repayToVault(vaultAddress: Address, amount: bigint): BatchOperation {
    console.log(`  💳 Repay ${amount} to vault ${vaultAddress}`);
    return {
      targetContract: vaultAddress,
      value: 0n,
      data: encodeFunctionData({
        abi: EVAULT_ABI,
        functionName: 'repay',
        args: [amount, this.userAccount],
      }),
      onBehalfOfAccount: this.userAccount,
    };
  }

  // EulerSwap Operations
  async directPoolSwap(
    poolAddress: Address,
    tokenInVault: Address,
    tokenOutVault: Address,
    amountIn: bigint,
    minAmountOut: bigint,
    recipient: Address
  ): Promise<BatchOperation> {
    console.log(`  🔄 Swap via pool ${poolAddress}`);
    
    // Get underlying asset addresses
    const tokenInAddress = await publicClient.readContract({
      address: tokenInVault,
      abi: EVAULT_ABI,
      functionName: 'asset',
    }) as Address;
    
    const tokenOutAddress = await publicClient.readContract({
      address: tokenOutVault,
      abi: EVAULT_ABI,
      functionName: 'asset',
    }) as Address;

    // Determine if tokenIn is asset0 or asset1
    const isAsset0In = tokenInAddress < tokenOutAddress;
    const amount0Out = isAsset0In ? 0n : minAmountOut;
    const amount1Out = isAsset0In ? minAmountOut : 0n;

    return {
      targetContract: poolAddress,
      value: 0n,
      data: encodeFunctionData({
        abi: EULERSWAP_ABI,
        functionName: 'swap',
        args: [amount0Out, amount1Out, recipient, '0x'],
      }),
      onBehalfOfAccount: this.userAccount,
    };
  }
}