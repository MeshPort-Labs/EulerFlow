// src/components/nodes/CoreActions/SwapTokens.tsx
import React from 'react';
import { BaseNode } from '../BaseNode';
import { Badge } from '../../ui/badge';
import { Label } from '../../ui/label';
import { ArrowRightLeft, Zap } from 'lucide-react';
import type { NodeProps } from '@xyflow/react';
import type { CoreActionNodeData } from '../../../types/nodes';

export const SwapTokens: React.FC<NodeProps> = ({ data, selected }) => {
  const nodeData = data as CoreActionNodeData;
  
  const getStatus = () => {
    return nodeData.tokenIn && nodeData.tokenOut ? 'Ready' : 'Needs Configuration';
  };

  return (
    <BaseNode data={nodeData} selected={selected}>
      <div className="space-y-3">
        {/* Action Header */}
        <div className="flex items-center justify-center">
          <div className="px-3 py-1 rounded-full bg-cyan-100 text-cyan-700 border-2 border-cyan-200">
            <div className="flex items-center gap-2">
              <ArrowRightLeft className="w-4 h-4" />
              <span className="text-xs font-medium">Swap Tokens</span>
            </div>
          </div>
        </div>

        {/* Swap Direction */}
        <div className="flex items-center justify-center gap-2">
          <Badge variant="outline" className="text-xs">
            {nodeData.tokenIn || 'From'}
          </Badge>
          <ArrowRightLeft className="w-3 h-3 text-muted-foreground" />
          <Badge variant="outline" className="text-xs">
            {nodeData.tokenOut || 'To'}
          </Badge>
        </div>

        {/* Amount */}
        {nodeData.amount && (
          <div className="text-center">
            <Label className="text-xs text-muted-foreground">Amount</Label>
            <div className="font-medium text-sm">{nodeData.amount}</div>
          </div>
        )}

        {/* Slippage */}
        <div className="text-center">
          <Label className="text-xs text-muted-foreground">Slippage</Label>
          <div className="font-medium text-sm">{nodeData.slippage || 0.5}%</div>
        </div>

        {/* EulerSwap Info */}
        <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-2">
          <div className="flex items-center gap-2 justify-center">
            <Zap className="w-3 h-3 text-cyan-600" />
            <span className="text-xs text-cyan-700">
              Powered by EulerSwap
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