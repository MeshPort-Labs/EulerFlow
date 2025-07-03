import React from 'react';
import { MinimalNode } from '../MinimalNode';
import { ArrowUpRight } from 'lucide-react';
import type { NodeProps } from '@xyflow/react';
import type { CoreActionNodeData } from '../../../types/nodes';

interface WithdrawAssetsProps extends NodeProps {
  onDelete?: () => void;
}

export const WithdrawAssets: React.FC<WithdrawAssetsProps> = (props) => {
  const config = {
    icon: <ArrowUpRight className="w-4 h-4 text-white" />,
    label: 'Withdraw',
    colorClass: 'bg-blue-500',
    getStatus: (data: CoreActionNodeData) => {
      return data.vaultAddress && data.amount ? 'ready' : 'needs-config';
    }
  };

  return <MinimalNode {...props} config={config} />;
};