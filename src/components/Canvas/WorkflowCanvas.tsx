import React, { useCallback, useRef, useState, useMemo, useEffect } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  useOnSelectionChange,
  type Node,
  type Edge,
  type Connection,
  type OnConnect,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { nodeTypes } from '../nodes';
import { PropertyPanel } from '../PropertyPanel';
import { StatusBar } from '../StatusBar/StatusBar';
import type { WorkflowNode, WorkflowEdge } from '../../types/workflow';
import type { NodeData } from '../../types/nodes';

// Convert our types to React Flow types
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

// Initial sample nodes for testing
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
    type: 'swapNode',
    position: { x: 500, y: 150 },
    data: { 
      label: 'USDC → WETH', 
      category: 'swap' as const,
      description: 'Swap USDC for WETH',
      tokenIn: 'USDC',
      tokenOut: 'WETH',
      amountIn: '1000'
    },
  },
  {
    id: '4',
    type: 'endNode',
    position: { x: 700, y: 100 },
    data: { label: 'End', category: 'vault' as const },
  },
];

const initialEdges: WorkflowEdge[] = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
  },
  {
    id: 'e2-3',
    source: '2',
    target: '3',
  },
  {
    id: 'e3-4',
    source: '3',
    target: '4',
  },
];

interface WorkflowCanvasProps {
  onWorkflowStateChange?: (nodes: Node[], edges: Edge[]) => void;
}

// Inner component that uses React Flow hooks
const WorkflowCanvasInner: React.FC<WorkflowCanvasProps> = ({ onWorkflowStateChange }) => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(
    initialNodes.map(convertToReactFlowNode)
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    initialEdges.map(convertToReactFlowEdge)
  );
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [executionStatus, setExecutionStatus] = useState<'idle' | 'running' | 'completed' | 'error'>('idle');

  // Notify parent of state changes
  useEffect(() => {
    onWorkflowStateChange?.(nodes, edges);
  }, [nodes, edges, onWorkflowStateChange]);

  // Use the selection change hook (now inside ReactFlow context)
  const onSelectionChange = useCallback(
    ({ nodes: selectedNodes }: { nodes: Node[]; edges: Edge[] }) => {
      if (selectedNodes.length > 0) {
        const node = selectedNodes[0];
        setSelectedNode(node);
        setIsPanelOpen(true);
      } else {
        setSelectedNode(null);
        setIsPanelOpen(false);
      }
    },
    []
  );

  useOnSelectionChange({
    onChange: onSelectionChange,
  });

  // Validate workflow
  const isWorkflowValid = useMemo(() => {
    // Check if all nodes have required configuration
    return nodes.every(node => {
      const data = node.data as NodeData;
      if (data.category === 'vault') {
        return data.vaultAddress && data.amount && data.action;
      }
      if (data.category === 'swap') {
        return data.tokenIn && data.tokenOut && data.amountIn;
      }
      return true; // Start and end nodes are always valid
    });
  }, [nodes]);

  const onConnect: OnConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges]
  );

  const handleNodeUpdate = useCallback(
    (nodeId: string, updates: Partial<NodeData>) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, ...updates } }
            : node
        )
      );
      
      // Update selected node if it's the one being updated
      if (selectedNode && selectedNode.id === nodeId) {
        setSelectedNode({ ...selectedNode, data: { ...selectedNode.data, ...updates } });
      }
    },
    [setNodes, selectedNode]
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
    <div className="flex flex-col h-full">
      <div ref={reactFlowWrapper} className="flex-1 bg-muted/30">
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

      <StatusBar
        nodeCount={nodes.length}
        edgeCount={edges.length}
        isValid={isWorkflowValid}
        executionStatus={executionStatus}
      />

      <PropertyPanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        selectedNode={selectedNode}
        onNodeUpdate={handleNodeUpdate}
      />
    </div>
  );
};

// Outer component that provides ReactFlow context
export const WorkflowCanvas: React.FC<WorkflowCanvasProps> = (props) => {
  return (
    <ReactFlowProvider>
      <WorkflowCanvasInner {...props} />
    </ReactFlowProvider>
  );
};