// src/components/nodes/LpToolkit/LpToolkitNode.tsx
import React from 'react';
import type { NodeProps } from '@xyflow/react';
import type { LpToolkitNodeData } from '../../../types/nodes';
import { CreatePool } from './CreatePool';
import { AddLiquidity } from './AddLiquidity';
import { RemoveLiquidity } from './RemoveLiquidity';

export const LpToolkitNode: React.FC<NodeProps> = (props) => {
  const nodeData = props.data as LpToolkitNodeData;
  
  // Route to the appropriate component based on action type
  switch (nodeData.action) {
    case 'create-pool':
      return <CreatePool {...props} />;
    case 'add-liquidity':
      return <AddLiquidity {...props} />;
    case 'remove-liquidity':
      return <RemoveLiquidity {...props} />;
    default:
      // Fallback for unconfigured nodes
      return <CreatePool {...props} />;
  }
};