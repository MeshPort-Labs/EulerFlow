// src/components/nodes/CoreActions/CoreActionNode.tsx
import React from 'react';
import type { NodeProps } from '@xyflow/react';
import type { CoreActionNodeData } from '../../../types/nodes';
import { SupplyAssets } from './SupplyAssets';
import { WithdrawAssets } from './WithdrawAssets';
import { BorrowAssets } from './BorrowAssets';
import { RepayDebt } from './RepayDebt';
import { SwapTokens } from './SwapTokens';
import { SetPermissions } from './SetPermissions';

export const CoreActionNode: React.FC<NodeProps> = (props) => {
  const nodeData = props.data as CoreActionNodeData;
  
  switch (nodeData.action) {
    case 'supply':
      return <SupplyAssets {...props} />;
    case 'withdraw':
      return <WithdrawAssets {...props} />;
    case 'borrow':
      return <BorrowAssets {...props} />;
    case 'repay':
      return <RepayDebt {...props} />;
    case 'swap':
      return <SwapTokens {...props} />;
    case 'permissions':
      return <SetPermissions {...props} />;
    default:
      return <SupplyAssets {...props} />;
  }
};