import React from 'react';
import { MinimalNode } from '../MinimalNode';
import { TrendingUp } from 'lucide-react';
import type { NodeProps } from '@xyflow/react';
import type { StrategyNodeData } from '../../../types/nodes';

interface LeverageStrategyProps extends NodeProps {
  onDelete?: () => void;
}

export const LeverageStrategy: React.FC<LeverageStrategyProps> = (props) => {
  const config = {
    icon: <TrendingUp className="w-4 h-4 text-white" />,
    label: 'Leverage',
    colorClass: 'bg-purple-500',
    getStatus: (data: StrategyNodeData) => {
      return data.collateralAsset && data.borrowAsset && data.leverageFactor ? 'ready' : 'needs-config';
    }
  };

  return <MinimalNode {...props} config={config} />;
};