import React from 'react';
import { MinimalNode } from '../MinimalNode';
import { CheckCircle } from 'lucide-react';
import type { NodeProps } from '@xyflow/react';
import type { CoreActionNodeData } from '../../../types/nodes';

interface RepayDebtProps extends NodeProps {
  onDelete?: () => void;
}

export const RepayDebt: React.FC<RepayDebtProps> = (props) => {
  const config = {
    icon: <CheckCircle className="w-4 h-4 text-white" />,
    label: 'Repay',
    colorClass: 'bg-purple-500',
    getStatus: (data: CoreActionNodeData) => {
      return data.vaultAddress && data.amount ? 'ready' : 'needs-config';
    }
  };

  return <MinimalNode {...props} config={config} />;
};