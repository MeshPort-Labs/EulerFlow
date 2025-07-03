import React from 'react';
import { MinimalNode } from '../MinimalNode';
import { Zap } from 'lucide-react';
import type { NodeProps } from '@xyflow/react';
import type { StrategyNodeData } from '../../../types/nodes';

interface JitLiquidityProps extends NodeProps {
  onDelete?: () => void;
}

export const JitLiquidity: React.FC<JitLiquidityProps> = (props) => {
  const config = {
    icon: <Zap className="w-4 h-4 text-white" />,
    label: 'JIT Liquidity',
    colorClass: 'bg-yellow-500',
    getStatus: (data: StrategyNodeData) => {
      return data.jitAsset && data.jitAmount && data.jitAction ? 'ready' : 'needs-config';
    }
  };

  return <MinimalNode {...props} config={config} />;
};