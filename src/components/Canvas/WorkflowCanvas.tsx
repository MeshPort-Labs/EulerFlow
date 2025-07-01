import React, { useCallback, useRef } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';
import type { Node, Edge, Connection, OnConnect } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { nodeTypes } from '../nodes';
import type { WorkflowNode, WorkflowEdge } from '../../types/workflow';

const convertToReactFlowNode = (node: WorkflowNode): Node => ({
  id: node.id,
  type: node.type,
  position: node.position,
  data: node.data,
});

const convertToReactFlowEdge = (edge: WorkflowEdge): Edge => ({
  id: edge.id,
  source: edge.source,
  target: edge.target,
  sourceHandle: edge.sourceHandle,
  targetHandle: edge.targetHandle,
});

const initialNodes: WorkflowNode[] = [
  {
    id: '1',
    type: 'startNode',
    position: { x: 100, y: 100 },
    data: { label: 'Start', category: 'vault' as const },
  },
  {
    id: '2',
    type: 'vaultNode',
    position: { x: 300, y: 150 },
    data: { 
      label: 'USDC Deposit', 
      category: 'vault' as const,
      action: 'deposit' as const,
      description: 'Deposit USDC to vault',
      amount: '1000 USDC'
    },
  },
  {
    id: '3',
    type: 'endNode',
    position: { x: 600, y: 100 },
    data: { label: 'End', category: 'vault' as const },
  },
];

const initialEdges: WorkflowEdge[] = [];

export const WorkflowCanvas: React.FC = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(
    initialNodes.map(convertToReactFlowNode)
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    initialEdges.map(convertToReactFlowEdge)
  );

  const onConnect: OnConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const nodeTemplate = JSON.parse(
        event.dataTransfer.getData('application/reactflow')
      );

      if (!nodeTemplate || !reactFlowWrapper.current) {
        return;
      }

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = {
        x: event.clientX - reactFlowBounds.left - 100,
        y: event.clientY - reactFlowBounds.top - 50,
      };

      const newNode: WorkflowNode = {
        id: `${nodeTemplate.id}-${Date.now()}`,
        type: nodeTemplate.type,
        position,
        data: {
          label: nodeTemplate.label,
          category: nodeTemplate.category,
          description: nodeTemplate.description,
          ...(nodeTemplate.category === 'vault' && { action: 'deposit' }),
        },
      };

      setNodes((nds) => nds.concat(convertToReactFlowNode(newNode)));
    },
    [setNodes]
  );

  return (
    <div ref={reactFlowWrapper} className="w-full h-full bg-muted/30">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        fitView
        className="bg-background"
      >
        <Background className="opacity-25" />
        <Controls className="bg-card shadow-lg border" />
        <MiniMap 
          className="bg-card shadow-lg border" 
          nodeColor={(node) => {
            switch (node.type) {
              case 'vaultNode': return '#3b82f6';
              case 'swapNode': return '#22c55e';
              case 'startNode': return '#10b981';
              case 'endNode': return '#ef4444';
              default: return '#6b7280';
            }
          }}
          maskColor="rgb(240, 242, 247, 0.7)"
        />
      </ReactFlow>
    </div>
  );
};