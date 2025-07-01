import { VaultNode } from './VaultNode';
import { SwapNode } from './SwapNode';
import { StartNode } from './StartNode';
import { EndNode } from './EndNode';
import type { NodeTypes } from '@xyflow/react';

export const nodeTypes: NodeTypes = {
  vaultNode: VaultNode,
  swapNode: SwapNode,
  startNode: StartNode,
  endNode: EndNode,
};

export { VaultNode, SwapNode, StartNode, EndNode };