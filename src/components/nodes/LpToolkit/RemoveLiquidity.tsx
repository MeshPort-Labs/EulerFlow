import React from 'react';
import { MinimalNode } from '../MinimalNode';
import { Minus } from 'lucide-react';
import type { NodeProps } from '@xyflow/react';
import type { LpToolkitNodeData } from '../../../types/nodes';

interface RemoveLiquidityProps extends NodeProps {
  onDelete?: () => void;
}

export const RemoveLiquidity: React.FC<RemoveLiquidityProps> = (props) => {
  const config = {
    icon: <Minus className="w-4 h-4 text-white" />,
    label: 'Remove Liquidity',
    colorClass: 'bg-red-500',
    getStatus: (data: LpToolkitNodeData) => {
      return data.amount0 && data.amount1 ? 'ready' : 'needs-config';
    }
  };

  return <MinimalNode {...props} config={config} />;
};