import { StartNode } from './StartNode';
import { EndNode } from './EndNode';
import { CoreActionNode } from './CoreActions';
import { LpToolkitNode } from './LpToolkit';
import { StrategyNode } from './Strategies';
import type { NodeTypes } from '@xyflow/react';
import { AlertNode } from './Alerts';

export const nodeTypes: NodeTypes = {
  // Control nodes
  startNode: StartNode,
  endNode: EndNode,
  
  // New modular nodes
  coreActionNode: CoreActionNode,
  lpToolkitNode: LpToolkitNode,
  strategyNode: StrategyNode,
  alertNode: AlertNode,
};

export { 
  StartNode, 
  EndNode, 
  CoreActionNode,
  LpToolkitNode,
  StrategyNode
};