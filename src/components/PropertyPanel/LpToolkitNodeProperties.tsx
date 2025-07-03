// src/components/PropertyPanel/LpToolkitNodeProperties.tsx
import React from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Layers, Plus, Minus } from 'lucide-react';
import type { LpToolkitNodeData, NodeData } from '../../types/nodes';

interface LpToolkitNodePropertiesProps {
  data: NodeData;
  onUpdate: (updates: Partial<NodeData>) => void;
}

const mockVaults = [
  { address: '0x1234...5678', symbol: 'USDC', name: 'USD Coin Vault' },
  { address: '0x2345...6789', symbol: 'WETH', name: 'Wrapped Ethereum Vault' },
  { address: '0x3456...7890', symbol: 'DAI', name: 'Dai Stablecoin Vault' },
];

export const LpToolkitNodeProperties: React.FC<LpToolkitNodePropertiesProps> = ({ data, onUpdate }) => {
  const lpData = data as LpToolkitNodeData;

  const renderCreatePoolProperties = () => (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium">Vault 0</Label>
        <Select 
          value={lpData.vault0 || ''} 
          onValueChange={(value) => onUpdate({ vault0: value })}
        >
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select first vault" />
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
        <Label className="text-sm font-medium">Vault 1</Label>
        <Select 
          value={lpData.vault1 || ''} 
          onValueChange={(value) => onUpdate({ vault1: value })}
        >
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select second vault" />
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
        <Label className="text-sm font-medium">Fee (%)</Label>
        <Input
          type="text"
          placeholder="0.3"
          value={lpData.fee || ''}
          onChange={(e) => onUpdate({ fee: e.target.value })}
          className="mt-1"
        />
      </div>
    </div>
  );

  const renderLiquidityProperties = () => (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium">Amount 0</Label>
        <Input
          type="text"
          placeholder="Enter amount"
          value={lpData.amount0 || ''}
          onChange={(e) => onUpdate({ amount0: e.target.value })}
          className="mt-1"
        />
      </div>

      <div>
        <Label className="text-sm font-medium">Amount 1</Label>
        <Input
          type="text"
          placeholder="Enter amount"
          value={lpData.amount1 || ''}
          onChange={(e) => onUpdate({ amount1: e.target.value })}
          className="mt-1"
        />
      </div>

      {lpData.poolAddress && (
        <div>
          <Label className="text-sm font-medium">Pool Address</Label>
          <div className="mt-1 p-2 bg-muted rounded font-mono text-xs">
            {lpData.poolAddress}
          </div>
        </div>
      )}
    </div>
  );

  const getIcon = () => {
    switch (lpData.action) {
      case 'create-pool': return <Layers className="w-4 h-4" />;
      case 'add-liquidity': return <Plus className="w-4 h-4" />;
      case 'remove-liquidity': return <Minus className="w-4 h-4" />;
      default: return <Layers className="w-4 h-4" />;
    }
  };

  const getTitle = () => {
    switch (lpData.action) {
      case 'create-pool': return 'Pool Creation';
      case 'add-liquidity': return 'Add Liquidity';
      case 'remove-liquidity': return 'Remove Liquidity';
      default: return 'LP Configuration';
    }
  };

  const renderProperties = () => {
    switch (lpData.action) {
      case 'create-pool':
        return renderCreatePoolProperties();
      case 'add-liquidity':
      case 'remove-liquidity':
        return renderLiquidityProperties();
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