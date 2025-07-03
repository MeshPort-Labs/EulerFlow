import React from 'react';
import { MinimalNode } from '../MinimalNode';
import { Plus } from 'lucide-react';
import type { NodeProps } from '@xyflow/react';
import type { LpToolkitNodeData } from '../../../types/nodes';

interface AddLiquidityProps extends NodeProps {
  onDelete?: () => void;
}

export const AddLiquidity: React.FC<AddLiquidityProps> = (props) => {
  const config = {
    icon: <Plus className="w-4 h-4 text-white" />,
    label: 'Add Liquidity',
    colorClass: 'bg-blue-500',
    getStatus: (data: LpToolkitNodeData) => {
      return data.amount0 && data.amount1 ? 'ready' : 'needs-config';
    }
  };

  return <MinimalNode {...props} config={config} />;
};