import { WorkflowCanvas } from './components/Canvas/WorkflowCanvas';
import { NodePalette } from './components/NodePalette/NodePalette';
import { Button } from './components/ui/button';
import { Save, Play } from 'lucide-react';

function App() {
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
            <div className="flex gap-3">
              <Button variant="outline" size="sm">
                <Save className="w-4 h-4 mr-2" />
                Save Workflow
              </Button>
              <Button size="sm">
                <Play className="w-4 h-4 mr-2" />
                Execute Workflow
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