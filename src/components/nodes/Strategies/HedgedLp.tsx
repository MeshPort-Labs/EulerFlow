// src/components/nodes/Strategies/HedgedLp.tsx
import React from 'react';
import { BaseNode } from '../BaseNode';
import { Badge } from '../../ui/badge';
import { Label } from '../../ui/label';
import { BarChart3, Shield } from 'lucide-react';
import type { NodeProps } from '@xyflow/react';
import type { StrategyNodeData } from '../../../types/nodes';

export const HedgedLp: React.FC<NodeProps> = ({ data, selected }) => {
  const nodeData = data as StrategyNodeData;
  
  const getStatus = () => {
    return nodeData.collateralAsset && nodeData.borrowAsset ? 'Ready' : 'Needs Configuration';
  };

  return (
    <BaseNode data={nodeData} selected={selected}>
      <div className="space-y-3">
        {/* Action Header */}
        <div className="flex items-center justify-center">
          <div className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 border-2 border-indigo-200">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="text-xs font-medium">Hedged LP</span>
            </div>
          </div>
        </div>

        {/* Assets */}
        {nodeData.collateralAsset && nodeData.borrowAsset && (
          <div className="grid grid-cols-2 gap-2">
            <div className="text-center">
              <Label className="text-xs text-muted-foreground">Supply</Label>
              <Badge variant="outline" className="text-xs">
                {nodeData.collateralAsset}
              </Badge>
            </div>
            <div className="text-center">
              <Label className="text-xs text-muted-foreground">Borrow</Label>
              <Badge variant="outline" className="text-xs">
                {nodeData.borrowAsset}
              </Badge>
            </div>
          </div>
        )}

        {/* Strategy Info */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-2">
          <div className="flex items-center gap-2 justify-center">
            <Shield className="w-3 h-3 text-indigo-600" />
            <span className="text-xs text-indigo-700">
              Delta-neutral position
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