import React from 'react';
import { MinimalNode } from './MinimalNode';
import { Play } from 'lucide-react';
import type { NodeProps } from '@xyflow/react';

interface StartNodeProps extends NodeProps {
  onDelete?: () => void;
}

export const StartNode: React.FC<StartNodeProps> = (props) => {
  const config = {
    icon: <Play className="w-4 h-4 text-white" />,
    label: 'Start',
    colorClass: 'bg-green-500',
    getStatus: () => 'ready' as const
  };

  return <MinimalNode {...props} config={config} />;
};