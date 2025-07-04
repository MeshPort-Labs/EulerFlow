import React from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { useWallet } from '../../hooks/useWallet';

export const ChainSwitcher: React.FC = () => {
  const { wallet, switchToDevland } = useWallet();

  if (!wallet.isConnected) return null;

  const getChainInfo = (chainId: number | null) => {
    switch (chainId) {
      case 31337:
        return { name: 'Devland', color: 'green', icon: <CheckCircle className="h-4 w-4" /> };
      case 1:
        return { name: 'Ethereum', color: 'blue', icon: <CheckCircle className="h-4 w-4" /> };
      default:
        return { name: 'Unknown', color: 'red', icon: <AlertTriangle className="h-4 w-4" /> };
    }
  };

  const chainInfo = getChainInfo(wallet.chainId);

  return (
    <div className="flex items-center space-x-2">
      <Badge 
        variant={wallet.isCorrectChain ? 'default' : 'destructive'}
        className={`flex items-center gap-1 ${
          wallet.isCorrectChain 
            ? 'bg-green-100 text-green-800 border-green-200' 
            : 'bg-red-100 text-red-800 border-red-200'
        }`}
      >
        {chainInfo.icon}
        {chainInfo.name}
      </Badge>
      
      {!wallet.isCorrectChain && (
        <Button
          size="sm"
          variant="outline"
          onClick={switchToDevland}
          className="text-xs"
        >
          Switch to Devland
        </Button>
      )}
    </div>
  );
};