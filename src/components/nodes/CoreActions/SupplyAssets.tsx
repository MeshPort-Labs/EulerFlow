import React from 'react';
import { MinimalNode } from '../MinimalNode';
import { Database } from 'lucide-react';
import type { NodeProps } from '@xyflow/react';
import type { CoreActionNodeData } from '../../../types/nodes';

interface SupplyAssetsProps extends NodeProps {
  onDelete?: () => void;
}

export const SupplyAssets: React.FC<SupplyAssetsProps> = (props) => {
  const config = {
    icon: <Database className="w-4 h-4 text-white" />,
    label: 'Supply',
    colorClass: 'bg-blue-500',
    getStatus: (data: CoreActionNodeData) => {
      return data.vaultAddress && data.amount ? 'ready' : 'needs-config';
    }
  };

  return <MinimalNode {...props} config={config} />;
};