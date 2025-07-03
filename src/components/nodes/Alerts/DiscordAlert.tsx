import React from 'react';
import { MinimalNode } from '../MinimalNode';
import { MessageSquare } from 'lucide-react';
import type { NodeProps } from '@xyflow/react';
import type { AlertNodeData } from '../../../types/nodes';

interface DiscordAlertProps extends NodeProps {
  onDelete?: () => void;
}

export const DiscordAlert: React.FC<DiscordAlertProps> = (props) => {
  const config = {
    icon: <MessageSquare className="w-4 h-4 text-white" />,
    label: 'Discord',
    colorClass: 'bg-indigo-500',
    getStatus: (data: AlertNodeData) => {
      return data.webhookUrl && data.message ? 'ready' : 'needs-config';
    }
  };

  return <MinimalNode {...props} config={config} />;
};