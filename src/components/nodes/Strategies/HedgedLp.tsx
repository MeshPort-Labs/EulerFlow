import React from 'react';
import { MinimalNode } from '../MinimalNode';
import { BarChart3 } from 'lucide-react';
import type { NodeProps } from '@xyflow/react';
import type { StrategyNodeData } from '../../../types/nodes';

interface HedgedLpProps extends NodeProps {
  onDelete?: () => void;
}

export const HedgedLp: React.FC<HedgedLpProps> = (props) => {
  const config = {
    icon: <BarChart3 className="w-4 h-4 text-white" />,
    label: 'Hedged LP',
    colorClass: 'bg-indigo-500',
    getStatus: (data: StrategyNodeData) => {
      return data.collateralAsset && data.borrowAsset ? 'ready' : 'needs-config';
    }
  };

  return <MinimalNode {...props} config={config} />;
};