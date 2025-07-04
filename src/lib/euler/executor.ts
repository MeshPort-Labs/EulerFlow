import { DEVLAND_ADDRESSES } from './addresses';
import { EVC_ABI } from './abis';
import type { BatchOperation } from './primitives';
import { writeContract, waitForTransactionReceipt, simulateContract } from 'wagmi/actions';
import { wagmiConfig } from '../wallet/config';

export async function executeEVCBatch(operations: BatchOperation[]) {
  console.log(`\n🚀 Executing EVC Batch with ${operations.length} operation(s)...`);
  
  const batchItems = operations.map(op => ({
    onBehalfOfAccount: op.onBehalfOfAccount || '0x0000000000000000000000000000000000000000',
    targetContract: op.targetContract,
    value: op.value || 0n,
    data: op.data,
  }));

  try {
    // Simulate first
    console.log(`  🔍 Simulating batch on EVC: ${DEVLAND_ADDRESSES.evc}`);
    const { request } = await simulateContract(wagmiConfig, {
      address: DEVLAND_ADDRESSES.evc,
      abi: EVC_ABI,
      functionName: 'batch',
      args: [batchItems],
    });

    console.log("  ✅ Simulation successful! Sending transaction...");
    
    // Execute
    const hash = await writeContract(wagmiConfig, request);
    console.log(`  📤 Transaction sent: ${hash}`);
    
    const receipt = await waitForTransactionReceipt(wagmiConfig, { hash });
    
    console.log(`  ✅ Batch transaction confirmed! Status: ${receipt.status}`);
    console.log(`  ⛽ Gas used: ${receipt.gasUsed}`);
    
    return {
      success: true,
      transactionHash: hash,
      gasUsed: receipt.gasUsed,
    };
  } catch (error) {
    console.error("  ❌ Batch transaction failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}