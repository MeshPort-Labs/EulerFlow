// src/components/nodes/CoreActions/BorrowAssets.tsx
import React from 'react';
import { BaseNode } from '../BaseNode';
import { Badge } from '../../ui/badge';
import { Label } from '../../ui/label';
import { Database, AlertTriangle } from 'lucide-react';
import type { NodeProps } from '@xyflow/react';
import type { CoreActionNodeData } from '../../../types/nodes';

export const BorrowAssets: React.FC<NodeProps> = ({ data, selected }) => {
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
          <div className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 border-2 border-orange-200">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              <span className="text-xs font-medium">Borrow Assets</span>
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

        {/* Borrow Rate Info */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-2">
          <div className="flex items-center gap-2 justify-center">
            <AlertTriangle className="w-3 h-3 text-orange-600" />
            <span className="text-xs text-orange-700">
              Borrow APY: ~3.8%
            </span>
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