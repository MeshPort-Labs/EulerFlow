import { createPublicClient, http, type Address, formatUnits } from 'viem';
import { mainnet } from 'viem/chains';
import { DEVLAND_ADDRESSES } from './addresses';
import { EVC_ABI, EULERSWAP_ABI, ERC20_ABI, EVAULT_ABI } from './abis';

// --- DEVLAND CLIENT SETUP ---
const anvilChain = { ...mainnet, id: 31337, name: 'Anvil Local' };

export const publicClient = createPublicClient({
  chain: anvilChain,
  transport: http('http://127.0.0.1:8545')
});

console.log("Connecting to Anvil node at http://127.0.0.1:8545...");

// --- CONSTANTS ---
export const USER0_ADDRESS = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266' as Address;
export const VAULT_LENS_ADDRESS = DEVLAND_ADDRESSES.lens.maglev as Address;
export const EULERSWAP_FACTORY_ADDRESS = DEVLAND_ADDRESSES.eulerSwap.factory as Address;
export const EULERSWAP_PERIPHERY_ADDRESS = DEVLAND_ADDRESSES.eulerSwap.periphery as Address;

// Use addresses from your addresses.ts instead of reading from files
export const VAULT_ADDRESSES = DEVLAND_ADDRESSES.vaults;

// Add missing factory ABI
const EULERSWAP_FACTORY_ABI = [
  {
    name: 'poolByEulerAccount',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'address' }]
  }
] as const;

// --- QUERY FUNCTIONS ---
export async function getTokenBalance(tokenSymbol: keyof typeof VAULT_ADDRESSES, userAddress: Address) {
  console.log(`\nQuerying ${tokenSymbol} balance for user ${userAddress}...`);
  try {
    const vaultAddress = VAULT_ADDRESSES[tokenSymbol];
    const assetAddress = await publicClient.readContract({
      address: vaultAddress, 
      abi: EVAULT_ABI, 
      functionName: 'asset',
    }) as Address;
    
    const balance = await publicClient.readContract({
      address: assetAddress, 
      abi: ERC20_ABI, 
      functionName: 'balanceOf', 
      args: [userAddress]
    });
    
    const decimals = await publicClient.readContract({
      address: assetAddress, 
      abi: ERC20_ABI, 
      functionName: 'decimals',
    });
    
    return {
      balance, 
      decimals, 
      formatted: formatUnits(balance as bigint, decimals as number)
    };
  } catch (e) {
    console.error(`  ❌ Failed to query balance for ${tokenSymbol}:`, e);
    return null;
  }
}

export async function getMyEulerSwapPool(userAddress: Address): Promise<Address | null> {
  console.log(`\nQuerying for EulerSwap pool owned by ${userAddress}...`);
  try {
    const poolAddress = await publicClient.readContract({
      address: EULERSWAP_FACTORY_ADDRESS,
      abi: EULERSWAP_FACTORY_ABI,
      functionName: 'poolByEulerAccount',
      args: [userAddress],
    }) as Address;

    if (poolAddress === '0x0000000000000000000000000000000000000000') {
      console.log("  - No EulerSwap pool found for this user.");
      return null;
    }
    console.log(`  ✅ Found EulerSwap pool at: ${poolAddress}`);
    return poolAddress;
  } catch (e) {
    console.error("  ❌ Failed to query for EulerSwap pool:", e);
    return null;
  }
}

export async function getQuoteOnChain(
  poolAddress: Address,
  tokenInSymbol: keyof typeof VAULT_ADDRESSES,
  tokenOutSymbol: keyof typeof VAULT_ADDRESSES,
  amountIn: bigint
): Promise<bigint | null> {
  console.log(`\nGetting ON-CHAIN quote from pool ${poolAddress}...`);
  
  const tokenInAddress = await publicClient.readContract({ 
    address: VAULT_ADDRESSES[tokenInSymbol], 
    abi: EVAULT_ABI, 
    functionName: 'asset' 
  }) as Address;
  
  const tokenOutAddress = await publicClient.readContract({ 
    address: VAULT_ADDRESSES[tokenOutSymbol], 
    abi: EVAULT_ABI, 
    functionName: 'asset' 
  }) as Address;

  try {
    const amountOut = await publicClient.readContract({
      address: poolAddress,
      abi: EULERSWAP_ABI,
      functionName: 'computeQuote',
      args: [tokenInAddress, tokenOutAddress, amountIn, true] // true for exactIn
    }) as bigint;

    const decimalsOut = await publicClient.readContract({ 
      address: VAULT_ADDRESSES[tokenOutSymbol], 
      abi: EVAULT_ABI, 
      functionName: 'decimals' 
    });
    
    console.log(`  ✅ On-chain quote received: Swap will yield approx. ${formatUnits(amountOut, decimalsOut as number)} ${tokenOutSymbol}`);
    return amountOut;
  } catch (e) {
    console.error("  ❌ Failed to get on-chain quote:", e);
    return null;
  }
}