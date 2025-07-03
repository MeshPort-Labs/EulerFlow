import { useState, useEffect } from 'react';
import { WorkflowCanvas } from './components/Canvas/WorkflowCanvas';
import { NodePalette } from './components/NodePalette/NodePalette';
import { ExecutionDialog } from './components/ExecutionDialog/ExecutionDialog';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { Save, Play, Download, Upload, Eye, Wallet, ExternalLink } from 'lucide-react';
import { useWallet } from './hooks/useWallet';
import type { Node, Edge } from '@xyflow/react';

function App() {
  const [isExecutionDialogOpen, setIsExecutionDialogOpen] = useState(false);
  const [currentNodes, setCurrentNodes] = useState<Node[]>([]);
  const [currentEdges, setCurrentEdges] = useState<Edge[]>([]);
  const { wallet, connectWallet, disconnectWallet, switchToMainnet } = useWallet();

  const handleSaveWorkflow = () => {
    const workflowData = {
      nodes: currentNodes,
      edges: currentEdges,
      timestamp: new Date().toISOString(),
    };
    
    localStorage.setItem('euler-workflow', JSON.stringify(workflowData));
    
    // Show success feedback
    const event = new CustomEvent('workflow-saved');
    window.dispatchEvent(event);
  };

  const handleLoadWorkflow = () => {
    try {
      const saved = localStorage.getItem('euler-workflow');
      if (saved) {
        const workflowData = JSON.parse(saved);
        console.log('Loaded workflow:', workflowData);
        // TODO: Implement workflow loading in canvas
      }
    } catch (error) {
      console.error('Failed to load workflow:', error);
    }
  };

  const handleExecuteWorkflow = () => {
    if (!wallet.isConnected) {
      alert('Please connect your wallet first');
      return;
    }
    
    if (wallet.chainId !== 1) {
      const shouldSwitch = confirm('This workflow is designed for Ethereum mainnet. Switch networks?');
      if (shouldSwitch) {
        switchToMainnet();
        return;
      }
    }
    
    setIsExecutionDialogOpen(true);
  };

  const handleSimulateWorkflow = () => {
    setIsExecutionDialogOpen(true);
  };

  const handleWalletAction = () => {
    if (wallet.isConnected) {
      disconnectWallet();
    } else {
      connectWallet();
    }
  };

  const handleExportWorkflow = () => {
    const workflowData = {
      nodes: currentNodes,
      edges: currentEdges,
      metadata: {
        version: '1.0.0',
        createdAt: new Date().toISOString(),
        title: 'Euler Workflow',
        nodeCount: currentNodes.length,
        edgeCount: currentEdges.length,
      },
    };

    const blob = new Blob([JSON.stringify(workflowData, null, 2)], {
      type: 'application/json',
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `euler-workflow-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportWorkflow = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const workflowData = JSON.parse(e.target?.result as string);
            console.log('Imported workflow:', workflowData);
            // TODO: Update canvas with imported data
          } catch (error) {
            console.error('Failed to import workflow:', error);
            alert('Invalid workflow file');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleWorkflowStateChange = (nodes: Node[], edges: Edge[]) => {
    setCurrentNodes(nodes);
    setCurrentEdges(edges);
  };

  const getNetworkName = (chainId: number) => {
    switch (chainId) {
      case 1: return 'Ethereum';
      case 10: return 'Optimism';
      case 137: return 'Polygon';
      case 42161: return 'Arbitrum';
      case 8453: return 'Base';
      default: return `Chain ${chainId}`;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b bg-card shadow-sm flex-shrink-0">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Euler Workflow Builder
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                Visual workflow builder for EulerSwap and Euler V2
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Wallet Connection */}
              <div className="flex items-center gap-2">
                {wallet.isConnected && (
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {getNetworkName(wallet.chainId!)}
                    </Badge>
                    <div className="text-xs text-muted-foreground font-mono">
                      {wallet.address?.slice(0, 6)}...{wallet.address?.slice(-4)}
                    </div>
                  </div>
                )}
                <Button 
                  variant={wallet.isConnected ? "default" : "outline"} 
                  size="sm"
                  onClick={handleWalletAction}
                >
                  <Wallet className="w-4 h-4 mr-2" />
                  {wallet.isConnected ? 'Disconnect' : 'Connect Wallet'}
                </Button>
              </div>

              <div className="h-6 w-px bg-border mx-1" />

              {/* File Operations */}
              <Button variant="ghost" size="sm" onClick={handleImportWorkflow}>
                <Upload className="w-4 h-4 mr-2" />
                Import
              </Button>
              <Button variant="ghost" size="sm" onClick={handleExportWorkflow}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              
              {/* Workflow Operations */}
              <div className="h-6 w-px bg-border mx-1" />
              <Button variant="ghost" size="sm" onClick={handleSaveWorkflow}>
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" size="sm" onClick={handleSimulateWorkflow}>
                <Eye className="w-4 h-4 mr-2" />
                Simulate
              </Button>
              <Button 
                size="sm" 
                onClick={handleExecuteWorkflow}
                disabled={!wallet.isConnected}
              >
                <Play className="w-4 h-4 mr-2" />
                Execute
              </Button>
            </div>
          </div>

          {/* Wallet Error Display */}
          {wallet.error && (
            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
              {wallet.error}
            </div>
          )}
        </div>
      </header>
      
      <div className="flex flex-1 overflow-hidden">
        <NodePalette onNodeDrag={() => {}} />
        <main className="flex-1">
          <WorkflowCanvas onWorkflowStateChange={handleWorkflowStateChange} />
        </main>
      </div>

      {/* Execution Dialog */}
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