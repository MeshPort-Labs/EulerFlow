import type { Node } from '@xyflow/react';

export type NodeCategory = 'vault' | 'swap' | 'automation' | 'strategy';

export interface BaseNodeData {
  label: string;
  category: NodeCategory;
  description?: string;
  [key: string]: unknown;
}

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
export type NodeData = VaultNodeData | SwapNodeData;

// Node type definitions for React Flow
export type VaultNode = Node<VaultNodeData>;
export type SwapNode = Node<SwapNodeData>;
export type StartNode = Node<BaseNodeData>;
export type EndNode = Node<BaseNodeData>;

export type CustomNode = VaultNode | SwapNode | StartNode | EndNode;