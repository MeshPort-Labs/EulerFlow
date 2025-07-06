import { useState, useMemo } from 'react';
import { WorkflowCanvas } from './components/Canvas/WorkflowCanvas';
import { NodePalette } from './components/NodePalette/NodePalette';
import { ExecutionDialog } from './components/ExecutionDialog/ExecutionDialog';
import { WalletModal } from './components/wallet/WalletModal';
import { ChainSwitcher } from './components/wallet/ChainSwitcher';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { 
  Save, 
  Play, 
  Download, 
  Upload, 
  Eye, 
  Wallet, 
  ExternalLink, 
  AlertTriangle,
  RefreshCw,
  Activity,
  TrendingUp
} from 'lucide-react';
import { useWallet } from './hooks/useWallet';
import { useEulerData } from './hooks/useEulerData';
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

  const { 
    balances, 
    userPool, 
    loading: dataLoading, 
    refetch: refetchData 
  } = useEulerData();

  // Workflow validation
  const isWorkflowValid = useMemo(() => {
    if (currentNodes.length === 0) return false;
    const hasStartNode = currentNodes.some(node => node.type === 'startNode');
    const hasEndNode = currentNodes.some(node => node.type === 'endNode');
    return hasStartNode && hasEndNode && currentNodes.length > 1;
  }, [currentNodes]);

  // Handlers
  const handleSaveWorkflow = () => {
    const workflowData = {
      nodes: currentNodes,
      edges: currentEdges,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('euler-workflow', JSON.stringify(workflowData));
  };

  const handleLoadWorkflow = () => {
    try {
      const saved = localStorage.getItem('euler-workflow');
      if (saved) {
        const workflowData = JSON.parse(saved);
        // TODO: Implement workflow loading in canvas
        console.log('📂 Loaded workflow:', workflowData);
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
    
    setIsExecutionDialogOpen(true);
  };

  const handlePreviewWorkflow = () => {
    console.log('👀 Previewing workflow:', { nodes: currentNodes, edges: currentEdges });
  };

  const handleNodeDrag = (nodeTemplate: any) => {
    console.log('Node dragged:', nodeTemplate);
  };

  const handleWorkflowStateChange = (nodes: Node[], edges: Edge[]) => {
    setCurrentNodes(nodes);
    setCurrentEdges(edges);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left - Branding & Info */}
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">EulerFlow</h1>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              Visual Strategy Builder
            </Badge>
            
            <Badge variant="outline" className="text-xs">
              Nodes: {currentNodes.length} | Edges: {currentEdges.length}
            </Badge>

            {dataLoading && (
              <Badge variant="outline" className="text-xs animate-pulse">
                <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                Loading...
              </Badge>
            )}
          </div>
          
          {/* Right - Controls */}
          <div className="flex items-center space-x-4">
            <ChainSwitcher />
            
            {/* Wallet Section */}
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
                  <Button variant="outline" size="sm" onClick={disconnectWallet}>
                    Disconnect
                  </Button>
                </div>
              ) : (
                <Button variant="outline" size="sm" onClick={connectWallet}>
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
                disabled={!isWorkflowValid}
                title={!isWorkflowValid ? 'Add nodes to create a valid workflow first' : 'Execute workflow'}
              >
                <Play className="h-4 w-4 mr-2" />
                Execute
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Network Warning Banner */}
      {wallet.isConnected && !wallet.isCorrectChain && (
        <div className="flex-shrink-0 bg-yellow-50 border-b border-yellow-200 px-6 py-3">
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

      {/* Euler Data Status */}
      {wallet.isConnected && wallet.isCorrectChain && (
        <div className="flex-shrink-0 bg-blue-50 border-b border-blue-200 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-blue-800 font-medium">Devland Status:</span>
              </div>
              
              {/* Token Balances */}
              <div className="flex items-center space-x-2">
                {Object.entries(balances).slice(0, 4).map(([symbol, balance]) => (
                  <Badge key={symbol} variant="outline" className="text-xs bg-white">
                    {symbol}: {balance?.formatted ? parseFloat(balance.formatted).toFixed(2) : '0'}
                  </Badge>
                ))}
              </div>

              <Badge 
                variant="outline" 
                className={`text-xs ${userPool ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}
              >
                Pool: {userPool ? `${userPool.slice(0, 8)}...` : 'None'}
              </Badge>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={refetchData}
              disabled={dataLoading}
            >
              {dataLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Main Content - Takes remaining height */}
      <div className="flex-1 flex overflow-hidden">
        {/* Node Palette - Fixed width */}
        <aside className="w-80 bg-white border-r border-gray-200 overflow-y-auto flex-shrink-0">
          <NodePalette onNodeDrag={handleNodeDrag} />
        </aside>

        {/* Canvas - Takes remaining width, includes StatusBar at bottom */}
        <main className="flex-1 relative overflow-hidden">
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