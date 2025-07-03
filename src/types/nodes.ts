export type NodeCategory = 'core' | 'lp-toolkit' | 'strategy' | 'control';

// Action types for different categories
export type CoreActionType = 'supply' | 'withdraw' | 'borrow' | 'repay' | 'swap' | 'permissions';
export type LpToolkitActionType = 'create-pool' | 'add-liquidity' | 'remove-liquidity';
export type StrategyType = 'leverage' | 'borrow-against-lp' | 'hedged-lp' | 'jit-liquidity';
export type ControlType = 'start' | 'end';

// Base node configuration
export interface BaseNodeData {
  label: string;
  category: NodeCategory;
  description?: string;
  [key: string]: unknown;
}

// Control nodes
export interface ControlNodeData extends BaseNodeData {
  category: 'control';
  controlType: ControlType;
}

// Core action nodes
export interface CoreActionNodeData extends BaseNodeData {
  category: 'core';
  action: CoreActionType;
  vaultAddress?: string;
  amount?: string;
  tokenIn?: string;
  tokenOut?: string;
  slippage?: number;
  collaterals?: string[];
  controller?: string;
}

// LP Toolkit nodes
export interface LpToolkitNodeData extends BaseNodeData {
  category: 'lp-toolkit';
  action: LpToolkitActionType;
  vault0?: string;
  vault1?: string;
  amount0?: string;
  amount1?: string;
  fee?: string;
  poolAddress?: string;
}

// Strategy nodes
export interface StrategyNodeData extends BaseNodeData {
  category: 'strategy';
  strategyType: StrategyType;
  
  // Leverage strategy fields
  collateralAsset?: string;
  borrowAsset?: string;
  leverageFactor?: number;

  // Borrow against LP fields
  borrowAmount?: string;

  // JIT liquidity fields
  jitAsset?: string;
  jitAmount?: string;
  jitAction?: 'deploy' | 'withdraw';
}

// Union type for all node data
export type NodeData = ControlNodeData | CoreActionNodeData | LpToolkitNodeData | StrategyNodeData;