import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card } from '../ui/card';
import { Play } from 'lucide-react';
import type { NodeProps } from '@xyflow/react';

export const StartNode: React.FC<NodeProps> = ({ selected }) => {
  return (
    <Card className={`w-32 h-32 border-2 border-dashed border-green-300 bg-green-50 flex flex-col items-center justify-center ${selected ? 'ring-2 ring-primary' : ''}`}>
      <Play className="w-8 h-8 text-green-600 mb-2" />
      <span className="text-sm font-medium text-green-700">Start</span>
      
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 border-2 border-white shadow-md bg-green-500"
      />
    </Card>
  );
};