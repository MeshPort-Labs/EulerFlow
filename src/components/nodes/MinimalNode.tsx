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
  console.log("nodeData", nodeData);
  const status = config.getStatus(nodeData);

  return (
    <BaseNode data={nodeData} selected={selected} onDelete={onDelete}>
      <div className="flex items-center gap-3">
        {/* Icon container - circular like in your reference */}
        <div 
          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${config.colorClass}`}
        >
          {config.icon}
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm text-gray-900 truncate">
            {config.label}
          </div>
          
          {/* Status dot */}
          <div className="flex items-center gap-1 mt-1">
            <div 
              className={`w-2 h-2 rounded-full ${
                status === 'ready' ? 'bg-green-500' : 
                status === 'error' ? 'bg-red-500' : 'bg-yellow-500'
              }`} 
            />
            <span className="text-xs text-gray-500">
              {status === 'ready' ? 'Ready' : 
               status === 'error' ? 'Error' : 'Configure'}
            </span>
          </div>
        </div>
      </div>
    </BaseNode>
  );
};