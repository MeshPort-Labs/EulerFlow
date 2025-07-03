import React from 'react';
import type { NodeProps } from '@xyflow/react';
import type { StrategyNodeData } from '../../../types/nodes';
import { LeverageStrategy } from './LeverageStrategy';
import { BorrowAgainstLp } from './BorrowAgainstLp';
import { HedgedLp } from './HedgedLp';
import { JitLiquidity } from './JitLiquidity';

export const StrategyNode: React.FC<NodeProps> = (props) => {
  const nodeData = props.data as StrategyNodeData;
  
  // Route to the appropriate component based on strategy type
  switch (nodeData.strategyType) {
    case 'leverage':
      return <LeverageStrategy {...props} />;
    case 'borrow-against-lp':
      return <BorrowAgainstLp {...props} />;
    case 'hedged-lp':
      return <HedgedLp {...props} />;
    case 'jit-liquidity':
      return <JitLiquidity {...props} />;
    default:
      // Fallback for unconfigured nodes
      return <LeverageStrategy {...props} />;
  }
};