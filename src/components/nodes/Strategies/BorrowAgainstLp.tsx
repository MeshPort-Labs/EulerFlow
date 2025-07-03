import React from 'react';
import { MinimalNode } from '../MinimalNode';
import { Target } from 'lucide-react';
import type { NodeProps } from '@xyflow/react';
import type { StrategyNodeData } from '../../../types/nodes';

interface BorrowAgainstLpProps extends NodeProps {
  onDelete?: () => void;
}

export const BorrowAgainstLp: React.FC<BorrowAgainstLpProps> = (props) => {
  const config = {
    icon: <Target className="w-4 h-4 text-white" />,
    label: 'Borrow vs LP',
    colorClass: 'bg-orange-500',
    getStatus: (data: StrategyNodeData) => {
      return data.borrowAsset && data.borrowAmount ? 'ready' : 'needs-config';
    }
  };

  return <MinimalNode {...props} config={config} />;
};