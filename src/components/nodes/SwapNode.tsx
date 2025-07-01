import React from 'react';
import { BaseNode } from './BaseNode';
import { Badge } from '../ui/badge';
import { Label } from '../ui/label';
import { ArrowRight } from 'lucide-react';
import type { NodeProps } from '@xyflow/react';
import type { SwapNodeData } from '../../types/nodes';

export const SwapNode: React.FC<NodeProps> = ({ data, selected }) => {
  const nodeData = data as SwapNodeData;
  
  return (
    <BaseNode data={nodeData} selected={selected}>
      <div className="space-y-3">
        {/* Token Swap Display */}
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <Label className="text-xs text-muted-foreground">From</Label>
            <Badge variant="outline" className="w-full justify-center text-xs">
              {nodeData.tokenIn || 'Select token'}
            </Badge>
          </div>
          
          <ArrowRight className="w-4 h-4 text-muted-foreground" />
          
          <div className="flex-1">
            <Label className="text-xs text-muted-foreground">To</Label>
            <Badge variant="outline" className="w-full justify-center text-xs">
              {nodeData.tokenOut || 'Select token'}
            </Badge>
          </div>
        </div>

        {/* Amount */}
        {nodeData.amountIn && (
          <div>
            <Label className="text-xs text-muted-foreground">Amount In</Label>
            <div className="text-sm font-medium">{nodeData.amountIn}</div>
          </div>
        )}

        {/* Slippage */}
        <div className="flex justify-between items-center">
          <Label className="text-xs text-muted-foreground">Slippage</Label>
          <Badge variant="secondary" className="text-xs">
            {nodeData.slippage ? `${nodeData.slippage}%` : '0.5%'}
          </Badge>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
          <span className="text-xs text-muted-foreground">Needs configuration</span>
        </div>
      </div>
    </BaseNode>
  );
};