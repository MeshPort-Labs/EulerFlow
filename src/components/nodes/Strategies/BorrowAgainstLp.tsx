// src/components/nodes/Strategies/BorrowAgainstLp.tsx
import React from 'react';
import { BaseNode } from '../BaseNode';
import { Badge } from '../../ui/badge';
import { Label } from '../../ui/label';
import { Target, Coins } from 'lucide-react';
import type { NodeProps } from '@xyflow/react';
import type { StrategyNodeData } from '../../../types/nodes';

export const BorrowAgainstLp: React.FC<NodeProps> = ({ data, selected }) => {
  const nodeData = data as StrategyNodeData;
  
  const getStatus = () => {
    return nodeData.borrowAsset && nodeData.borrowAmount ? 'Ready' : 'Needs Configuration';
  };

  return (
    <BaseNode data={nodeData} selected={selected}>
      <div className="space-y-3">
        {/* Action Header */}
        <div className="flex items-center justify-center">
          <div className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 border-2 border-orange-200">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              <span className="text-xs font-medium">Borrow Against LP</span>
            </div>
          </div>
        </div>

        {/* Borrow Details */}
        {nodeData.borrowAsset && (
          <div className="text-center">
            <Label className="text-xs text-muted-foreground">Borrow Asset</Label>
            <Badge variant="outline" className="text-xs mt-1">
              {nodeData.borrowAsset}
            </Badge>
          </div>
        )}

        {nodeData.borrowAmount && (
          <div className="text-center">
            <Label className="text-xs text-muted-foreground">Amount</Label>
            <div className="font-medium text-sm">{nodeData.borrowAmount}</div>
          </div>
        )}

        {/* Strategy Info */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-2">
          <div className="flex items-center gap-2 justify-center">
            <Coins className="w-3 h-3 text-orange-600" />
            <span className="text-xs text-orange-700">
              LP keeps earning fees
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