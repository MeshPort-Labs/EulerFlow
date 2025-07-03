// src/components/nodes/Strategies/JitLiquidity.tsx
import React from 'react';
import { BaseNode } from '../BaseNode';
import { Badge } from '../../ui/badge';
import { Label } from '../../ui/label';
import { Button } from '../../ui/button';
import { Zap, Clock } from 'lucide-react';
import type { NodeProps } from '@xyflow/react';
import type { StrategyNodeData } from '../../../types/nodes';

export const JitLiquidity: React.FC<NodeProps> = ({ data, selected }) => {
  const nodeData = data as StrategyNodeData;
  
  const getStatus = () => {
    return nodeData.jitAsset && nodeData.jitAmount && nodeData.jitAction ? 'Ready' : 'Needs Configuration';
  };

  return (
    <BaseNode data={nodeData} selected={selected}>
      <div className="space-y-3">
        {/* Action Header */}
        <div className="flex items-center justify-center">
          <div className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 border-2 border-yellow-200">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span className="text-xs font-medium">JIT Liquidity</span>
            </div>
          </div>
        </div>

        {/* JIT Action */}
        {nodeData.jitAction && (
          <div className="text-center">
            <Label className="text-xs text-muted-foreground">Action</Label>
            <Badge variant="outline" className="text-xs mt-1 capitalize">
              {nodeData.jitAction} JIT
            </Badge>
          </div>
        )}

        {/* Asset & Amount */}
        <div className="grid grid-cols-2 gap-2">
          <div className="text-center">
            <Label className="text-xs text-muted-foreground">Asset</Label>
            <div className="font-medium text-sm">{nodeData.jitAsset || 'TBD'}</div>
          </div>
          <div className="text-center">
            <Label className="text-xs text-muted-foreground">Amount</Label>
            <div className="font-medium text-sm">{nodeData.jitAmount || 'TBD'}</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-1">
          <Button 
            size="sm" 
            variant="outline"
            className="text-xs h-6"
            disabled
          >
            Deploy
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            className="text-xs h-6"
            disabled
          >
            Withdraw
          </Button>
        </div>

        {/* Strategy Info */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2">
          <div className="flex items-center gap-2 justify-center">
            <Clock className="w-3 h-3 text-yellow-600" />
            <span className="text-xs text-yellow-700">
              Temporary liquidity boost
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