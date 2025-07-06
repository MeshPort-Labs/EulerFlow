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
import type { NodeData, CoreActionNodeData, StrategyNodeData, LpToolkitNodeData } from '../../types/nodes';

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
    data: {
      label: 'Start',
      category: 'control' as const,
      controlType: 'start' as const
    },
  },
  {
    id: '2',
    type: 'coreActionNode',
    position: { x: 300, y: 100 },
    data: {
      label: 'Borrow 100 USDC', // Start with smaller amount
      category: 'core' as const,
      action: 'borrow' as const,
      description: 'Borrow USDC against WETH collateral',
      amount: '100',        // Smaller amount
      vaultAddress: 'USDC'  
    },
  },
  {
    id: '3',
    type: 'endNode',
    position: { x: 500, y: 100 },
    data: {
      label: 'End',
      category: 'control' as const,
      controlType: 'end' as const
    },
  },
];

const initialEdges: WorkflowEdge[] = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e2-3', source: '2', target: '3' },
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

  // Updated validation for new node structure
  const isWorkflowValid = useMemo(() => {
    return nodes.every(node => {
      const data = node.data as NodeData;
      
      switch (data.category) {
        case 'core':
          const coreData = data as CoreActionNodeData;
          switch (coreData.action) {
            case 'supply':
            case 'withdraw':
            case 'borrow':
            case 'repay':
              return coreData.vaultAddress && coreData.amount;
            case 'swap':
              return coreData.tokenIn && coreData.tokenOut && coreData.amount;
            case 'permissions':
              return coreData.collaterals?.length || coreData.controller;
            default:
              return false;
          }
        
        case 'strategy':
          const strategyData = data as StrategyNodeData;
          switch (strategyData.strategyType) {
            case 'leverage':
              return strategyData.collateralAsset && strategyData.borrowAsset && strategyData.leverageFactor;
            case 'borrow-against-lp':
              return strategyData.borrowAsset && strategyData.borrowAmount;
            case 'hedged-lp':
              return strategyData.collateralAsset && strategyData.borrowAsset;
            case 'jit-liquidity':
              return strategyData.jitAsset && strategyData.jitAmount && strategyData.jitAction;
            default:
              return false;
          }
        
        case 'lp-toolkit':
          const lpData = data as LpToolkitNodeData;
          switch (lpData.action) {
            case 'create-pool':
              return lpData.vault0 && lpData.vault1;
            case 'add-liquidity':
            case 'remove-liquidity':
              return lpData.amount0 && lpData.amount1;
            default:
              return false;
          }
        
        case 'control':
          return true; // Control nodes are always valid
        
        
        default:
          return true;
      }
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
          ...nodeTemplate.data,
        },
      };

      setNodes((nds) => nds.concat(convertToReactFlowNode(newNode)));
    },
    [setNodes]
  );

  // Handle node deletion
  const handleDeleteNode = useCallback((nodeId: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter((edge) => 
      edge.source !== nodeId && edge.target !== nodeId
    ));
    setSelectedNode(null);
    setIsPanelOpen(false);
  }, [setNodes, setEdges]);

  // Handle edge deletion
  const handleDeleteEdge = useCallback((edgeId: string) => {
    setEdges((eds) => eds.filter((edge) => edge.id !== edgeId));
  }, [setEdges]);

  // Keyboard event handler
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Delete' || event.key === 'Backspace') {
      if (selectedNode) {
        handleDeleteNode(selectedNode.id);
      }
      // Handle edge deletion if edge is selected (you'll need to add edge selection state)
    }
  }, [selectedNode, handleDeleteNode]);

  // Add keyboard event listener
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="flex flex-col h-full">
      <div ref={reactFlowWrapper} className="flex-1 bg-muted/30">
        <ReactFlow
          nodes={nodes.map(node => ({
            ...node,
            data: {
              ...node.data,
              onDelete: () => handleDeleteNode(node.id)
            }
          }))}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          nodeTypes={nodeTypes}
          // fitView
          className="bg-background"
          deleteKeyCode={null}
          selectNodesOnDrag={false} 
          multiSelectionKeyCode={null} 
        >
          <Background className="opacity-25" />
          <Controls className="bg-card shadow-lg border" />
          <MiniMap 
            className="bg-card shadow-lg border" 
            nodeColor={(node) => {
              switch (node.type) {
                case 'coreActionNode': return '#3b82f6';     // Blue
                case 'strategyNode': return '#8b5cf6';       // Purple
                case 'lpToolkitNode': return '#22c55e';      // Green 
                case 'startNode': return '#10b981';          // Emerald
                case 'endNode': return '#ef4444';            // Red
                
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

export const WorkflowCanvas: React.FC<WorkflowCanvasProps> = (props) => {
  return (
    <ReactFlowProvider>
      <WorkflowCanvasInner {...props} />
    </ReactFlowProvider>
  );
};