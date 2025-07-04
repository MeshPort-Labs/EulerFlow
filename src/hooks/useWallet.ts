import { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain } from 'wagmi';
import { devlandChain } from '../lib/wallet/config';

export const useWallet = () => {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  const wallet = {
    isConnected,
    address: address || null,
    chainId: chainId || null,
    isCorrectChain: chainId === devlandChain.id,
  };

  const connectWallet = async (connectorId?: string) => {
    if (connectorId) {
      const connector = connectors.find(c => c.id === connectorId);
      if (connector) {
        try {
          await connect({ connector });
          setIsWalletModalOpen(false);
        } catch (error) {
          console.error('Failed to connect wallet:', error);
          throw error;
        }
      }
    } else {
      // Open wallet selection modal
      setIsWalletModalOpen(true);
    }
  };

  const disconnectWallet = () => {
    disconnect();
    console.log('🔌 Wallet disconnected');
  };

  const switchToDevland = async () => {
    try {
      await switchChain({ chainId: devlandChain.id });
    } catch (error) {
      console.error('Failed to switch to devland:', error);
      // If the chain doesn't exist in the wallet, try to add it
      if (window.ethereum) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: `0x${devlandChain.id.toString(16)}`,
              chainName: devlandChain.name,
              nativeCurrency: devlandChain.nativeCurrency,
              rpcUrls: [devlandChain.rpcUrls.default.http[0]],
            }],
          });
        } catch (addError) {
          console.error('Failed to add devland chain:', addError);
        }
      }
    }
  };

  return {
    wallet,
    connectWallet,
    disconnectWallet,
    switchToDevland,
    connectors,
    isPending,
    isWalletModalOpen,
    setIsWalletModalOpen,
  };
};