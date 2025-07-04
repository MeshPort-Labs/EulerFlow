import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { NodeData } from '../../types/nodes';
import { Button } from '../ui/button';

interface BaseNodeProps {
  data: NodeData;
  selected?: boolean;
  children?: React.ReactNode;
  onDelete?: () => void;
}

const categoryColors = {
  vault: '#3b82f6',
  swap: '#10b981', 
  core: '#3b82f6',
  'lp-toolkit': '#10b981',
  strategy: '#8b5cf6',
  control: '#6b7280',
  alert: '#f59e0b',
};

export const BaseNode: React.FC<BaseNodeProps> = ({ data, selected, children, onDelete }) => {
  const deleteHandler = onDelete || (data as any).onDelete;
  return (
    <div className="relative group">
      {/* Main node container */}
      <div
        className={cn(
          "relative overflow-hidden transition-all duration-200",
          "bg-white border border-gray-200 shadow-sm hover:shadow-md",
          "min-w-[160px] min-h-[60px] rounded-lg",
          selected && "ring-2 ring-blue-500 shadow-lg border-blue-300"
        )}
      >
        {/* Node content */}
        <div className="px-4 py-3">
          {children}
        </div>
      </div>
      <>{ console.log('selected:', selected) }</>
      <>{ console.log('onDelete:', onDelete) }</>

      {/* Delete button - appears on hover or selection */}
      {(selected) && deleteHandler && (
        <Button
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            deleteHandler();
          }}
          className={cn(
            "absolute -top-2 -right-2 w-5 h-5 rounded-full",
            "bg-red-500 hover:bg-red-600 text-white",
            "flex items-center justify-center shadow-md",
            "transition-all duration-200 hover:scale-110",
            "border border-white z-30 opacity-100"
          )}
          style={{ display: 'flex', zIndex: 1000 }} 
        >
          <X className="w-3 h-3" />
        </Button>
      )}

      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 border-2 border-white rounded-full shadow-sm hover:scale-110 transition-transform"
        style={{ 
          background: categoryColors[data.category] || categoryColors.core,
          top: '-6px'
        }}
      />

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 border-2 border-white rounded-full shadow-sm hover:scale-110 transition-transform"
        style={{ 
          background: categoryColors[data.category] || categoryColors.core,
          bottom: '-6px'
        }}
      />
    </div>
  );
};