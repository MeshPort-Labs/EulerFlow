import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card } from '../ui/card';
import { Square } from 'lucide-react';
import type { NodeProps } from '@xyflow/react';

export const EndNode: React.FC<NodeProps> = ({ selected }) => {
  return (
    <Card className={`w-32 h-32 border-2 border-dashed border-red-300 bg-red-50 flex flex-col items-center justify-center ${selected ? 'ring-2 ring-primary' : ''}`}>
      <Square className="w-8 h-8 text-red-600 mb-2" />
      <span className="text-sm font-medium text-red-700">End</span>
      
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 border-2 border-white shadow-md bg-red-500"
      />
    </Card>
  );
};