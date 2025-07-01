// Node category definitions
export type NodeCategory = 'vault' | 'swap' | 'automation' | 'strategy';

// Base node configuration
export interface BaseNodeData {
  label: string;
  category: NodeCategory;
  description?: string;
  [key: string]: unknown;
}

// Specific node data types
export interface VaultNodeData extends BaseNodeData {
  category: 'vault';
  vaultAddress?: string;
  amount?: string;
  action: 'deposit' | 'withdraw' | 'borrow' | 'repay';
}

export interface SwapNodeData extends BaseNodeData {
  category: 'swap';
  tokenIn?: string;
  tokenOut?: string;
  amountIn?: string;
  slippage?: number;
}

// Union type for all node data
export type NodeData = VaultNodeData | SwapNodeData | BaseNodeData;