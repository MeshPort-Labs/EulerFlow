// src/components/nodes/Strategies/LeverageStrategy.tsx
import React from 'react';
import { BaseNode } from '../BaseNode';
import { Badge } from '../../ui/badge';
import { Label } from '../../ui/label';
import { TrendingUp, ArrowUp } from 'lucide-react';
import type { NodeProps } from '@xyflow/react';
import type { StrategyNodeData } from '../../../types/nodes';

export const LeverageStrategy: React.FC<NodeProps> = ({ data, selected }) => {
  const nodeData = data as StrategyNodeData;
  
  const getStatus = () => {
    return nodeData.collateralAsset && nodeData.borrowAsset && nodeData.leverageFactor ? 'Ready' : 'Needs Configuration';
  };

  return (
    <BaseNode data={nodeData} selected={selected}>
      <div className="space-y-3">
        {/* Action Header */}
        <div className="flex items-center justify-center">
          <div className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 border-2 border-purple-200">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs font-medium">Leverage Strategy</span>
            </div>
          </div>
        </div>

        {/* Leverage Factor */}
        {nodeData.leverageFactor && (
          <div className="text-center">
            <Label className="text-xs text-muted-foreground">Leverage</Label>
            <div className="font-bold text-lg text-purple-700">{nodeData.leverageFactor}x</div>
          </div>
        )}

        {/* Assets */}
        {nodeData.collateralAsset && nodeData.borrowAsset && (
          <div className="grid grid-cols-2 gap-2">
            <div className="text-center">
              <Label className="text-xs text-muted-foreground">Long</Label>
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
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-2">
          <div className="flex items-center gap-2 justify-center">
            <ArrowUp className="w-3 h-3 text-purple-600" />
            <span className="text-xs text-purple-700">
              Amplified exposure
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