import React from 'react';
import { MinimalNode } from './MinimalNode';
import { Square } from 'lucide-react';
import type { NodeProps } from '@xyflow/react';

interface EndNodeProps extends NodeProps {
  onDelete?: () => void;
}

export const EndNode: React.FC<EndNodeProps> = (props) => {
  const config = {
    icon: <Square className="w-4 h-4 text-white" />,
    label: 'End',
    colorClass: 'bg-red-500',
    getStatus: () => 'ready' as const
  };

  return <MinimalNode {...props} config={config} />;
};