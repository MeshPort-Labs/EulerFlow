import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Wallet, X } from 'lucide-react';
import { useWallet } from '../../hooks/useWallet';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose }) => {
  const { connectWallet, connectors, isPending } = useWallet();

  const walletIcons: Record<string, string> = {
    metaMask: '🦊',
    coinbaseWallet: '🔵',
    walletConnect: '🔗',
    injected: '👤',
  };

  const walletNames: Record<string, string> = {
    metaMask: 'MetaMask',
    coinbaseWallet: 'Coinbase Wallet',
    walletConnect: 'WalletConnect',
    injected: 'Browser Wallet',
  };

  const handleConnectWallet = async (connectorId: string) => {
    try {
      await connectWallet(connectorId);
    } catch (error) {
      console.error('Connection failed:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Connect Wallet
          </DialogTitle>
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
          >
            <X className="h-4 w-4" />
          </button>
        </DialogHeader>
        
        <div className="space-y-3">
          <p className="text-sm text-gray-600 mb-4">
            Choose a wallet to connect to EulerFlow
          </p>
          
          {connectors.map((connector) => (
            <Button
              key={connector.id}
              variant="outline"
              className="w-full justify-start h-12"
              onClick={() => handleConnectWallet(connector.id)}
              disabled={isPending}
            >
              <span className="text-2xl mr-3">
                {walletIcons[connector.id] || '💼'}
              </span>
              <span className="font-medium">
                {walletNames[connector.id] || connector.name}
              </span>
              {connector.id === 'metaMask' && (
                <span className="ml-auto text-xs text-gray-500">
                  Recommended
                </span>
              )}
            </Button>
          ))}
          
          <div className="mt-6 p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-800">
              💡 <strong>Devland Setup:</strong> Make sure your devland is running on localhost:8545 
              and add the network to your wallet if needed.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};