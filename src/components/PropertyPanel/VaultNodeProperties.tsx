import React from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Switch } from '../ui/switch';
import { Badge } from '../ui/badge';
import { Database, AlertCircle, CheckCircle } from 'lucide-react';
import type { VaultNodeData, NodeData } from '../../types/nodes';

interface VaultNodePropertiesProps {
  data: NodeData;
  onUpdate: (updates: Partial<NodeData>) => void;
}

// Mock vault data - in real app this would come from API
const mockVaults = [
  { address: '0x1234...5678', symbol: 'USDC', name: 'USD Coin Vault', apy: '5.2%' },
  { address: '0x2345...6789', symbol: 'WETH', name: 'Wrapped Ethereum Vault', apy: '3.8%' },
  { address: '0x3456...7890', symbol: 'DAI', name: 'Dai Stablecoin Vault', apy: '4.9%' },
];

export const VaultNodeProperties: React.FC<VaultNodePropertiesProps> = ({ data, onUpdate }) => {
  const vaultData = data as VaultNodeData;
  const selectedVault = mockVaults.find(v => v.address === vaultData.vaultAddress);

  return (
    <div className="space-y-6">
      {/* Action Configuration */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Database className="w-4 h-4" />
            Vault Action
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Action Type</Label>
            <Select 
              value={vaultData.action} 
              onValueChange={(value: 'deposit' | 'withdraw' | 'borrow' | 'repay') => 
                onUpdate({ action: value })
              }
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="deposit">Deposit</SelectItem>
                <SelectItem value="withdraw">Withdraw</SelectItem>
                <SelectItem value="borrow">Borrow</SelectItem>
                <SelectItem value="repay">Repay</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Amount Input */}
          <div>
            <Label className="text-sm font-medium">Amount</Label>
            <Input
              type="text"
              placeholder="Enter amount (e.g., 1000 or 50%)"
              value={vaultData.amount || ''}
              onChange={(e) => onUpdate({ amount: e.target.value })}
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Use numbers for exact amounts or percentages (e.g., 50%)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Vault Selection */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Vault Selection</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Select Vault</Label>
            <Select 
              value={vaultData.vaultAddress || ''} 
              onValueChange={(value) => onUpdate({ vaultAddress: value })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Choose a vault" />
              </SelectTrigger>
              <SelectContent>
                {mockVaults.map((vault) => (
                  <SelectItem key={vault.address} value={vault.address}>
                    <div className="flex items-center justify-between w-full">
                      <span>{vault.symbol} - {vault.name}</span>
                      <Badge variant="secondary" className="ml-2 text-xs">
                        {vault.apy} APY
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Selected Vault Info */}
          {selectedVault && (
            <div className="p-3 bg-muted rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-sm">{selectedVault.name}</span>
                <Badge variant="outline">{selectedVault.apy} APY</Badge>
              </div>
              <p className="text-xs text-muted-foreground font-mono">
                {selectedVault.address}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Risk Settings */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Risk Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Enable as Collateral</Label>
              <p className="text-xs text-muted-foreground">
                Allow this vault to be used as collateral for borrowing
              </p>
            </div>
            <Switch />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Auto-rebalance</Label>
              <p className="text-xs text-muted-foreground">
                Automatically maintain optimal collateral ratio
              </p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      {/* Status */}
      <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
        <CheckCircle className="w-4 h-4 text-green-600" />
        <span className="text-sm text-green-700">Configuration valid</span>
      </div>
    </div>
  );
};