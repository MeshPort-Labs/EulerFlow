import { useState } from 'react';
import { WorkflowCanvas } from './components/Canvas/WorkflowCanvas';
import { NodePalette } from './components/NodePalette/NodePalette';
import { ExecutionDialog } from './components/ExecutionDialog/ExecutionDialog';
import { WalletModal } from './components/wallet/WalletModal';
import { ChainSwitcher } from './components/wallet/ChainSwitcher';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { Save, Play, Download, Upload, Eye, Wallet, ExternalLink, AlertTriangle } from 'lucide-react';
import { useWallet } from './hooks/useWallet';
import type { Node, Edge } from '@xyflow/react';

function App() {
  const [isExecutionDialogOpen, setIsExecutionDialogOpen] = useState(false);
  const [currentNodes, setCurrentNodes] = useState<Node[]>([]);
  const [currentEdges, setCurrentEdges] = useState<Edge[]>([]);
  
  const { 
    wallet, 
    connectWallet, 
    disconnectWallet, 
    switchToDevland,
    isWalletModalOpen, 
    setIsWalletModalOpen 
  } = useWallet();

  const handleSaveWorkflow = () => {
    const workflowData = {
      nodes: currentNodes,
      edges: currentEdges,
      timestamp: new Date().toISOString(),
    };
    
    localStorage.setItem('euler-workflow', JSON.stringify(workflowData));
    console.log('💾 Workflow saved to localStorage');
  };

  const debugCurrentNodes = () => {
    console.log('=== DEBUGGING CURRENT NODES ===');
    currentNodes.forEach((node, index) => {
      console.log(`Node ${index}:`, {
        id: node.id,
        type: node.type,
        data: node.data,
      });
    });
    console.log('=== END DEBUG ===');
  };
  

  const handleLoadWorkflow = () => {
    try {
      const saved = localStorage.getItem('euler-workflow');
      if (saved) {
        const workflowData = JSON.parse(saved);
        console.log('📂 Loaded workflow:', workflowData);
        // TODO: Implement workflow loading in canvas
      }
    } catch (error) {
      console.error('Failed to load workflow:', error);
    }
  };

  const handleExecuteWorkflow = () => {
    if (!wallet.isConnected) {
      connectWallet();
      return;
    }
    
    if (!wallet.isCorrectChain) {
      const shouldSwitch = confirm(
        'This workflow is designed for Devland. Switch networks?'
      );
      if (shouldSwitch) {
        switchToDevland();
      }
      return;
    }
    
    console.log('🚀 Opening execution dialog...');
    console.log('Current nodes:', currentNodes);
    console.log('Current edges:', currentEdges);
    setIsExecutionDialogOpen(true);
  };

  const handlePreviewWorkflow = () => {
    console.log('👀 Previewing workflow:', { nodes: currentNodes, edges: currentEdges });
  };

  // Handle node drag from palette - updated to match NodePalette interface
  const handleNodeDrag = (nodeTemplate: any) => {
    console.log('Node dragged:', nodeTemplate);
    // This will be handled by the WorkflowCanvas when the node is dropped
  };

  // Handle nodes change from canvas - removed since WorkflowCanvas manages its own state
  const handleNodesChange = (nodes: Node[]) => {
    console.log('Nodes updated:', nodes.length);
    setCurrentNodes(nodes);
  };

  // Handle edges change from canvas - removed since WorkflowCanvas manages its own state
  const handleEdgesChange = (edges: Edge[]) => {
    console.log('Edges updated:', edges.length);
    setCurrentEdges(edges);
  };

  // Handle workflow state change from canvas
  const handleWorkflowStateChange = (nodes: Node[], edges: Edge[]) => {
    console.log('Workflow state changed:', { nodes: nodes.length, edges: edges.length });
    setCurrentNodes(nodes);
    setCurrentEdges(edges);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-900">EulerFlow</h1>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Visual Strategy Builder
          </Badge>
          {/* Debug Info */}
          <Badge variant="outline" className="text-xs">
            Nodes: {currentNodes.length} | Edges: {currentEdges.length}
          </Badge>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Chain Switcher */}
          <ChainSwitcher />
          
          {/* Wallet Connection */}
          <div className="flex items-center space-x-2">
            <Wallet className="h-4 w-4 text-gray-500" />
            {wallet.isConnected ? (
              <div className="flex items-center space-x-2">
                <Badge variant="default" className="bg-green-100 text-green-800">
                  Connected
                </Badge>
                <span className="text-sm text-gray-600 font-mono">
                  {wallet.address?.slice(0, 6)}...{wallet.address?.slice(-4)}
                </span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={disconnectWallet}
                >
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => connectWallet()}
              >
                Connect Wallet
              </Button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 border-l border-gray-200 pl-4">
            <Button variant="outline" size="sm" onClick={handleSaveWorkflow}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            
            <Button variant="outline" size="sm" onClick={handleLoadWorkflow}>
              <Upload className="h-4 w-4 mr-2" />
              Load
            </Button>
            
            <Button variant="outline" size="sm" onClick={handlePreviewWorkflow}>
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleExecuteWorkflow}
              disabled={currentNodes.length === 0}
              title={currentNodes.length === 0 ? 'Add nodes to your workflow first' : 'Execute workflow'}
            >
              <Play className="h-4 w-4 mr-2" />
              Execute Workflow
              {currentNodes.length === 0 && (
                <span className="ml-2 text-xs opacity-75">(No nodes)</span>
              )}
            </Button>

            <Button variant="outline" size="sm" onClick={debugCurrentNodes}>
  Debug Nodes
</Button>
          </div>
        </div>
      </header>

      {/* Network Warning Banner */}
      {wallet.isConnected && !wallet.isCorrectChain && (
        <div className="bg-yellow-50 border-b border-yellow-200 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <span className="text-sm text-yellow-800">
                You're connected to the wrong network. Please switch to Devland to execute workflows.
              </span>
            </div>
            <Button size="sm" onClick={switchToDevland}>
              Switch to Devland
            </Button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Node Palette */}
        <aside className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
          <NodePalette onNodeDrag={handleNodeDrag} />
        </aside>

        {/* Canvas */}
        <main className="flex-1 relative">
          <WorkflowCanvas 
            onWorkflowStateChange={handleWorkflowStateChange}
          />
        </main>
      </div>

      {/* Modals */}
      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
      />
      
      <ExecutionDialog
        isOpen={isExecutionDialogOpen}
        onClose={() => setIsExecutionDialogOpen(false)}
        nodes={currentNodes}
        edges={currentEdges}
      />
    </div>
  );
}

export default App;