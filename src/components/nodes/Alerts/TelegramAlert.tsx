import React from 'react';
import { MinimalNode } from '../MinimalNode';
import { MessageCircle } from 'lucide-react';
import type { NodeProps } from '@xyflow/react';
import type { AlertNodeData } from '../../../types/nodes';

interface TelegramAlertProps extends NodeProps {
  onDelete?: () => void;
}

export const TelegramAlert: React.FC<TelegramAlertProps> = (props) => {
  const config = {
    icon: <MessageCircle className="w-4 h-4 text-white" />,
    label: 'Telegram',
    colorClass: 'bg-blue-500',
    getStatus: (data: AlertNodeData) => {
      return data.botToken && data.chatId && data.message ? 'ready' : 'needs-config';
    }
  };

  return <MinimalNode {...props} config={config} />;
};