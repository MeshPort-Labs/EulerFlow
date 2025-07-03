import React from 'react';
import { BaseNode } from './BaseNode';
import type { NodeProps } from '@xyflow/react';
import type { NodeData } from '../../types/nodes';

interface MinimalNodeConfig {
  icon: React.ReactNode;
  label: string;
  getStatus: (data: any) => 'ready' | 'needs-config' | 'error';
  colorClass: string;
}

interface MinimalNodeProps extends NodeProps {
  config: MinimalNodeConfig;
  onDelete?: () => void;
}

export const MinimalNode: React.FC<MinimalNodeProps> = ({ 
  data, 
  selected, 
  config,
  onDelete 
}) => {
  const nodeData = data as NodeData;
  const status = config.getStatus(nodeData);

  return (
    <BaseNode data={nodeData} selected={selected} onDelete={onDelete}>
      <div className="flex flex-col items-center justify-center h-16">
        <div className={`w-8 h-8 rounded-full ${config.colorClass} flex items-center justify-center mb-1`}>
          {config.icon}
        </div>
        <span className="text-xs font-medium text-gray-700">{config.label}</span>
        <div className={`w-2 h-2 rounded-full mt-1 ${
          status === 'ready' ? 'bg-green-500' : 
          status === 'error' ? 'bg-red-500' : 'bg-yellow-500'
        }`} />
      </div>
    </BaseNode>
  );
};