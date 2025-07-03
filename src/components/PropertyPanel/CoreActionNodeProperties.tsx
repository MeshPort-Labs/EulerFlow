// src/components/PropertyPanel/CoreActionNodeProperties.tsx
import React from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Switch } from '../ui/switch';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Database, ArrowRightLeft, Settings } from 'lucide-react';
import type { CoreActionNodeData, NodeData } from '../../types/nodes';

interface CoreActionNodePropertiesProps {
  data: NodeData;
  onUpdate: (updates: Partial<NodeData>) => void;
}

const mockVaults = [
  { address: '0x1234...5678', symbol: 'USDC', name: 'USD Coin Vault' },
  { address: '0x2345...6789', symbol: 'WETH', name: 'Wrapped Ethereum Vault' },
  { address: '0x3456...7890', symbol: 'DAI', name: 'Dai Stablecoin Vault' },
];

const mockTokens = ['USDC', 'WETH', 'DAI', 'USDT', 'wstETH'];

export const CoreActionNodeProperties: React.FC<CoreActionNodePropertiesProps> = ({ data, onUpdate }) => {
  const coreData = data as CoreActionNodeData;

  const renderVaultActionProperties = () => (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium">Vault</Label>
        <Select 
          value={coreData.vaultAddress || ''} 
          onValueChange={(value) => onUpdate({ vaultAddress: value })}
        >
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select vault" />
          </SelectTrigger>
          <SelectContent>
            {mockVaults.map((vault) => (
              <SelectItem key={vault.address} value={vault.address}>
                {vault.symbol} - {vault.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-sm font-medium">Amount</Label>
        <Input
          type="text"
          placeholder="Enter amount or percentage"
          value={coreData.amount || ''}
          onChange={(e) => onUpdate({ amount: e.target.value })}
          className="mt-1"
        />
      </div>
    </div>
  );

  const renderSwapProperties = () => (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium">Token In</Label>
        <Select 
          value={coreData.tokenIn || ''} 
          onValueChange={(value) => onUpdate({ tokenIn: value })}
        >
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select input token" />
          </SelectTrigger>
          <SelectContent>
            {mockTokens.map((token) => (
              <SelectItem key={token} value={token}>{token}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-sm font-medium">Token Out</Label>
        <Select 
          value={coreData.tokenOut || ''} 
          onValueChange={(value) => onUpdate({ tokenOut: value })}
        >
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select output token" />
          </SelectTrigger>
          <SelectContent>
            {mockTokens.map((token) => (
              <SelectItem key={token} value={token}>{token}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-sm font-medium">Amount</Label>
        <Input
          type="text"
          placeholder="Enter amount"
          value={coreData.amount || ''}
          onChange={(e) => onUpdate({ amount: e.target.value })}
          className="mt-1"
        />
      </div>

      <div>
        <Label className="text-sm font-medium">Slippage (%)</Label>
        <Input
          type="number"
          placeholder="0.5"
          value={coreData.slippage || ''}
          onChange={(e) => onUpdate({ slippage: parseFloat(e.target.value) })}
          className="mt-1"
        />
      </div>
    </div>
  );

  const renderPermissionsProperties = () => (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium">Controller Vault</Label>
        <Select 
          value={coreData.controller || ''} 
          onValueChange={(value) => onUpdate({ controller: value })}
        >
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select controller" />
          </SelectTrigger>
          <SelectContent>
            {mockVaults.map((vault) => (
              <SelectItem key={vault.address} value={vault.address}>
                {vault.symbol} - {vault.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-sm font-medium">Collateral Vaults</Label>
        <div className="mt-1 space-y-2">
          {mockVaults.map((vault) => (
            <div key={vault.address} className="flex items-center justify-between">
              <span className="text-sm">{vault.symbol}</span>
              <Switch />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const getIcon = () => {
    switch (coreData.action) {
      case 'swap': return <ArrowRightLeft className="w-4 h-4" />;
      case 'permissions': return <Settings className="w-4 h-4" />;
      default: return <Database className="w-4 h-4" />;
    }
  };

  const getTitle = () => {
    switch (coreData.action) {
      case 'supply': return 'Supply Configuration';
      case 'withdraw': return 'Withdraw Configuration';
      case 'borrow': return 'Borrow Configuration';
      case 'repay': return 'Repay Configuration';
      case 'swap': return 'Swap Configuration';
      case 'permissions': return 'Permissions Configuration';
      default: return 'Action Configuration';
    }
  };

  const renderProperties = () => {
    switch (coreData.action) {
      case 'supply':
      case 'withdraw':
      case 'borrow':
      case 'repay':
        return renderVaultActionProperties();
      case 'swap':
        return renderSwapProperties();
      case 'permissions':
        return renderPermissionsProperties();
      default:
        return <div>Select an action type to configure properties.</div>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            {getIcon()}
            {getTitle()}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderProperties()}
        </CardContent>
      </Card>
    </div>
  );
};