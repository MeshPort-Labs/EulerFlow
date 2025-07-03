import { useState, useCallback } from 'react';

interface WalletState {
  address: string | null;
  isConnected: boolean;
  chainId: number | null;
  error: string | null;
}

export const useWallet = () => {
  const [wallet, setWallet] = useState<WalletState>({
    address: null,
    isConnected: false,
    chainId: null,
    error: null,
  });

  const connectWallet = useCallback(async () => {
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed');
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      // Get chain ID
      const chainId = await window.ethereum.request({
        method: 'eth_chainId',
      });

      setWallet({
        address: accounts[0],
        isConnected: true,
        chainId: parseInt(chainId, 16),
        error: null,
      });

      // Listen for account changes
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          setWallet(prev => ({ ...prev, address: accounts[0] }));
        }
      });

      // Listen for chain changes
      window.ethereum.on('chainChanged', (chainId: string) => {
        setWallet(prev => ({ ...prev, chainId: parseInt(chainId, 16) }));
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to connect wallet';
      setWallet(prev => ({ ...prev, error: errorMessage }));
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    setWallet({
      address: null,
      isConnected: false,
      chainId: null,
      error: null,
    });
  }, []);

  const switchToMainnet = useCallback(async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x1' }], // Mainnet
      });
    } catch (error) {
      console.error('Failed to switch to mainnet:', error);
    }
  }, []);

  return {
    wallet,
    connectWallet,
    disconnectWallet,
    switchToMainnet,
  };
};

// Extend window object for TypeScript
declare global {
  interface Window {
    ethereum?: any;
  }
}