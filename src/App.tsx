import { WorkflowCanvas } from './components/Canvas/WorkflowCanvas';
import { NodePalette } from './components/NodePalette/NodePalette';
import { Button } from './components/ui/button';
import { Save, Play, Download, Upload, Trash2, Copy } from 'lucide-react';

function App() {
  const handleSaveWorkflow = () => {
    // TODO: Implement save functionality
    console.log('Save workflow');
  };

  const handleExecuteWorkflow = () => {
    // TODO: Implement execute functionality
    console.log('Execute workflow');
  };

  const handleExportWorkflow = () => {
    // TODO: Implement export functionality
    console.log('Export workflow');
  };

  const handleImportWorkflow = () => {
    // TODO: Implement import functionality
    console.log('Import workflow');
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
            
            <div className="flex gap-2">
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
              <Button variant="outline" size="sm" onClick={handleSaveWorkflow}>
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button size="sm" onClick={handleExecuteWorkflow}>
                <Play className="w-4 h-4 mr-2"/>
                Execute
             </Button>
           </div>
         </div>
       </div>
     </header>
     
     <div className="flex flex-1 overflow-hidden">
       <NodePalette onNodeDrag={() => {}} />
       <main className="flex-1">
         <WorkflowCanvas />
       </main>
     </div>
   </div>
 );
}

export default App;