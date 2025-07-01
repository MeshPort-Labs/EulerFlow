import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { cn } from '../../lib/utils';
import type { NodeData } from '../../types/nodes';

interface BaseNodeProps {
  data: NodeData;
  selected?: boolean;
  children?: React.ReactNode;
}

const categoryColors = {
  vault: 'bg-blue-500',
  swap: 'bg-green-500',
  automation: 'bg-purple-500',
  strategy: 'bg-orange-500',
};

export const BaseNode: React.FC<BaseNodeProps> = ({ data, selected, children }) => {
  return (
    <Card className={cn(
      "min-w-[200px] transition-all duration-200",
      selected && "ring-2 ring-primary shadow-lg"
    )}>
      {/* Node Header */}
      <div className={cn(
        "px-3 py-2 rounded-t-lg text-white text-sm font-medium flex items-center justify-between",
        categoryColors[data.category]
      )}>
        <span>{data.label}</span>
        <Badge variant="secondary" className="text-xs bg-white/20 text-white border-white/30">
          {data.category}
        </Badge>
      </div>

      {/* Node Body */}
      <div className="p-3">
        {data.description && (
          <p className="text-xs text-muted-foreground mb-2">{data.description}</p>
        )}
        {children}
      </div>

      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 border-2 border-white shadow-md"
        style={{ background: categoryColors[data.category] }}
      />

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 border-2 border-white shadow-md"
        style={{ background: categoryColors[data.category] }}
      />
    </Card>
  );
};