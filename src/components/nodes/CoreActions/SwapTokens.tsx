import React from 'react';
import { MinimalNode } from '../MinimalNode';
import { ArrowRightLeft } from 'lucide-react';
import type { NodeProps } from '@xyflow/react';
import type { CoreActionNodeData } from '../../../types/nodes';

interface SwapTokensProps extends NodeProps {
  onDelete?: () => void;
}

export const SwapTokens: React.FC<SwapTokensProps> = (props) => {
  const config = {
    icon: <ArrowRightLeft className="w-4 h-4 text-white" />,
    label: 'Swap',
    colorClass: 'bg-cyan-500',
    getStatus: (data: CoreActionNodeData) => {
      return data.tokenIn && data.tokenOut && data.amount ? 'ready' : 'needs-config';
    }
  };

  return <MinimalNode {...props} config={config} />;
};