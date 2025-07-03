import React from 'react';
import type { NodeProps } from '@xyflow/react';
import type { AlertNodeData } from '../../../types/nodes';
import { TelegramAlert } from './TelegramAlert';
import { DiscordAlert } from './DiscordAlert';

export const AlertNode: React.FC<NodeProps> = (props) => {
  const nodeData = props.data as AlertNodeData;
  
  switch (nodeData.alertType) {
    case 'telegram':
      return <TelegramAlert {...props} />;
    case 'discord':
      return <DiscordAlert {...props} />;
    default:
      return <TelegramAlert {...props} />;
  }
};