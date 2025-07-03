// src/components/nodes/LpToolkit/AddLiquidity.tsx
import React from 'react';
import { BaseNode } from '../BaseNode';
import { Badge } from '../../ui/badge';
import { Label } from '../../ui/label';
import { Plus, Droplets } from 'lucide-react';
import type { NodeProps } from '@xyflow/react';
import type { LpToolkitNodeData } from '../../../types/nodes';

export const AddLiquidity: React.FC<NodeProps> = ({ data, selected }) => {
  const nodeData = data as LpToolkitNodeData;
  
  const getStatus = () => {
    return nodeData.amount0 && nodeData.amount1 ? 'Ready' : 'Needs Configuration';
  };

  return (
    <BaseNode data={nodeData} selected={selected}>
      <div className="space-y-3">
        {/* Action Header */}
        <div className="flex items-center justify-center">
          <div className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 border-2 border-blue-200">
            <div className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              <span className="text-xs font-medium">Add Liquidity</span>
            </div>
          </div>
        </div>

        {/* Amounts */}
        <div className="grid grid-cols-2 gap-2">
          <div className="text-center">
            <Label className="text-xs text-muted-foreground">Amount 0</Label>
            <div className="font-medium text-sm">{nodeData.amount0 || 'TBD'}</div>
          </div>
          <div className="text-center">
            <Label className="text-xs text-muted-foreground">Amount 1</Label>
            <div className="font-medium text-sm">{nodeData.amount1 || 'TBD'}</div>
          </div>
        </div>

        {/* Liquidity Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
          <div className="flex items-center gap-2 justify-center">
            <Droplets className="w-3 h-3 text-blue-600" />
            <span className="text-xs text-blue-700">
              Boosts pool depth
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