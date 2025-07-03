// src/components/nodes/LpToolkit/CreatePool.tsx
import React from 'react';
import { BaseNode } from '../BaseNode';
import { Badge } from '../../ui/badge';
import { Label } from '../../ui/label';
import { Layers, Settings } from 'lucide-react';
import type { NodeProps } from '@xyflow/react';
import type { LpToolkitNodeData } from '../../../types/nodes';

export const CreatePool: React.FC<NodeProps> = ({ data, selected }) => {
  const nodeData = data as LpToolkitNodeData;
  
  const getStatus = () => {
    return nodeData.vault0 && nodeData.vault1 && nodeData.fee ? 'Ready' : 'Needs Configuration';
  };

  const getVaultSymbol = (vaultAddress: string) => {
    const vaultMap: Record<string, string> = {
      '0x1234...5678': 'USDC',
      '0x2345...6789': 'WETH',
      '0x3456...7890': 'DAI',
    };
    return vaultMap[vaultAddress] || 'Unknown';
  };

  return (
    <BaseNode data={nodeData} selected={selected}>
      <div className="space-y-3">
        {/* Action Header */}
        <div className="flex items-center justify-center">
          <div className="px-3 py-1 rounded-full bg-green-100 text-green-700 border-2 border-green-200">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4" />
              <span className="text-xs font-medium">Create Pool</span>
            </div>
          </div>
        </div>

        {/* Pool Pair */}
        {nodeData.vault0 && nodeData.vault1 && (
          <div className="flex items-center justify-center gap-2">
            <Badge variant="outline" className="text-xs">
              {getVaultSymbol(nodeData.vault0)}
            </Badge>
            <span className="text-xs text-muted-foreground">/</span>
            <Badge variant="outline" className="text-xs">
              {getVaultSymbol(nodeData.vault1)}
            </Badge>
          </div>
        )}

        {/* Fee Display */}
        {nodeData.fee && (
          <div className="text-center">
            <Label className="text-xs text-muted-foreground">Fee</Label>
            <div className="font-medium text-sm">{nodeData.fee}%</div>
          </div>
        )}

        {/* Pool Info */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-2">
          <div className="flex items-center gap-2 justify-center">
            <Settings className="w-3 h-3 text-green-600" />
            <span className="text-xs text-green-700">
              Personal AMM Pool
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