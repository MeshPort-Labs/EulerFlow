import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card } from '../ui/card';
import { Trash2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { NodeData } from '../../types/nodes';

interface BaseNodeProps {
  data: NodeData;
  selected?: boolean;
  children?: React.ReactNode;
  onDelete?: () => void;
}

const categoryColors = {
  vault: 'bg-blue-500',
  swap: 'bg-green-500',
  core: 'bg-blue-500',
  'lp-toolkit': 'bg-green-500',
  strategy: 'bg-purple-500',
  control: 'bg-gray-500',
  alert: 'bg-orange-500',
};

export const BaseNode: React.FC<BaseNodeProps> = ({ data, selected, children, onDelete }) => {
  return (
    <div className="relative">
      <Card className={cn(
        "w-32 transition-all duration-200 bg-white border-2",
        selected && "ring-2 ring-primary shadow-lg border-primary"
      )}>
        {/* Compact node body */}
        <div className="p-2">
          {children}
        </div>
      </Card>

      {/* Delete button when selected */}
      {selected && onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-colors z-10"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      )}

      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-4 h-4 border-2 border-white shadow-md rounded-full"
        style={{ background: categoryColors[data.category] }}
      />

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-4 h-4 border-2 border-white shadow-md rounded-full"
        style={{ background: categoryColors[data.category] }}
      />
    </div>
  );
};