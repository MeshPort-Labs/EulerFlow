// src/components/nodes/CoreActions/WithdrawAssets.tsx
import React from 'react';
import { BaseNode } from '../BaseNode';
import { Badge } from '../../ui/badge';
import { Label } from '../../ui/label';
import { Database, ArrowUpRight } from 'lucide-react';
import type { NodeProps } from '@xyflow/react';
import type { CoreActionNodeData } from '../../../types/nodes';

export const WithdrawAssets: React.FC<NodeProps> = ({ data, selected }) => {
  const nodeData = data as CoreActionNodeData;
  
  const getStatus = () => {
    return nodeData.vaultAddress && nodeData.amount ? 'Ready' : 'Needs Configuration';
  };

  const getVaultSymbol = () => {
    const vaultMap: Record<string, string> = {
      '0x1234...5678': 'USDC',
      '0x2345...6789': 'WETH',
      '0x3456...7890': 'DAI',
    };
    return vaultMap[nodeData.vaultAddress || ''] || 'Unknown';
  };

  return (
    <BaseNode data={nodeData} selected={selected}>
      <div className="space-y-3">
        {/* Action Header */}
        <div className="flex items-center justify-center">
          <div className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 border-2 border-blue-200">
            <div className="flex items-center gap-2">
              <ArrowUpRight className="w-4 h-4" />
              <span className="text-xs font-medium">Withdraw Assets</span>
            </div>
          </div>
        </div>

        {/* Asset Info */}
        {nodeData.vaultAddress && (
          <div className="text-center">
            <Label className="text-xs text-muted-foreground">Asset</Label>
            <div className="font-medium text-sm">{getVaultSymbol()}</div>
          </div>
        )}

        {/* Amount Display */}
        {nodeData.amount && (
          <div className="text-center">
            <Label className="text-xs text-muted-foreground">Amount</Label>
            <div className="font-medium text-sm">{nodeData.amount}</div>
          </div>
        )}

        {/* Withdrawal Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
          <div className="text-xs text-blue-700 text-center">
            💡 Assets will be sent to your wallet
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center justify-center gap-2">
          <div className={`w-2 h-2 rounded-full ${getStatus() === 'Ready' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
          <span className="text-xs text-muted-foreground">{getStatus()}</span>
        </div>
      </div>
    </BaseNode>
  );
};