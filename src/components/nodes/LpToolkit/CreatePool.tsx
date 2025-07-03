import React from 'react';
import { MinimalNode } from '../MinimalNode';
import { Layers } from 'lucide-react';
import type { NodeProps } from '@xyflow/react';
import type { LpToolkitNodeData } from '../../../types/nodes';

interface CreatePoolProps extends NodeProps {
  onDelete?: () => void;
}

export const CreatePool: React.FC<CreatePoolProps> = (props) => {
  const config = {
    icon: <Layers className="w-4 h-4 text-white" />,
    label: 'Create Pool',
    colorClass: 'bg-green-500',
    getStatus: (data: LpToolkitNodeData) => {
      return data.vault0 && data.vault1 && data.fee ? 'ready' : 'needs-config';
    }
  };

  return <MinimalNode {...props} config={config} />;
};