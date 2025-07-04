import { useState, useEffect } from 'react';
import { getTokenBalance, getMyEulerSwapPool } from '../lib/euler/eulerLib';
import { DEVLAND_ADDRESSES } from '../lib/euler/addresses';
import { useAccount } from 'wagmi';
import type { Address } from 'viem';

interface TokenBalance {
  balance: bigint;
  decimals: number;
  formatted: string;
}

export const useEulerData = () => {
  const { address: userAddress } = useAccount(); // Get user address from connected wallet
  const [balances, setBalances] = useState<Record<string, TokenBalance>>({});
  const [userPool, setUserPool] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBalances = async (address: Address) => {
    const newBalances: Record<string, TokenBalance> = {};
    
    for (const [symbol] of Object.entries(DEVLAND_ADDRESSES.vaults)) {
      try {
        const balance = await getTokenBalance(
          symbol as keyof typeof DEVLAND_ADDRESSES.vaults,
          address
        );
        if (balance) {
          newBalances[symbol] = balance;
        }
      } catch (error) {
        console.error(`Failed to fetch ${symbol} balance:`, error);
      }
    }
    
    setBalances(newBalances);
  };

  const fetchUserPool = async (address: Address) => {
    try {
      const pool = await getMyEulerSwapPool(address);
      setUserPool(pool);
    } catch (error) {
      console.error('Failed to fetch user pool:', error);
    }
  };

  const refetch = async () => {
    if (!userAddress) {
      setBalances({});
      setUserPool(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      await Promise.all([fetchBalances(userAddress), fetchUserPool(userAddress)]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetch();
    
    // Set up periodic updates every 30 seconds (only if user is connected)
    if (userAddress) {
      const interval = setInterval(refetch, 30000);
      return () => clearInterval(interval);
    }
  }, [userAddress]); // Re-run when user address changes

  return {
    balances,
    userPool,
    loading,
    error,
    refetch,
    userAddress, // Export userAddress for components that need it
  };
};