import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ScrollArea } from '../ui/scroll-area';
import { 
  Play, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Eye,
  Zap,
  TrendingUp,
  ExternalLink
} from 'lucide-react';
import type { Node, Edge } from '@xyflow/react';
import { useWorkflowExecution } from '../../hooks/useWorkflowExecution';

interface ExecutionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  nodes: Node[];
  edges: Edge[];
}

export const ExecutionDialog: React.FC<ExecutionDialogProps> = ({
  isOpen,
  onClose,
  nodes,
  edges,
}) => {
  const {
    isExecuting,
    executionSteps,
    currentStep,
    executeWorkflow,
    simulateWorkflow,
    validateWorkflow,
  } = useWorkflowExecution();

  const [simulationResult, setSimulationResult] = useState<any>(null);
  const [executionResult, setExecutionResult] = useState<any>(null);

  const handleSimulate = async () => {
    const result = await simulateWorkflow(nodes, edges);
    setSimulationResult(result);
  };

  const handleExecute = async () => {
    const result = await executeWorkflow(nodes, edges);
    setExecutionResult(result);
  };

  const validation = validateWorkflow(nodes, edges);

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'executing':
        return <Clock className="w-4 h-4 text-yellow-600 animate-spin" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <div className="w-4 h-4 rounded-full border-2 border-gray-300" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Workflow Execution
          </DialogTitle>
          <DialogDescription>
            Review, simulate, and execute your EulerSwap workflow
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="flex-1 overflow-hidden">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="simulation">Simulation</TabsTrigger>
            <TabsTrigger value="execution">Execution</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4">
            <div className="space-y-4">
              {/* Validation Status */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    {validation.valid ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-600" />
                    )}
                    Workflow Validation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {validation.valid ? (
                    <p className="text-sm text-green-700">
                      ✅ Workflow is valid and ready for execution
                    </p>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-sm text-red-700 font-medium">
                        Validation errors found:
                      </p>
                      <ul className="text-sm text-red-600 space-y-1">
                        {validation.errors.map((error, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span>•</span>
                            <span>{error}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Workflow Summary */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Workflow Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Total Nodes:</span>
                      <span className="ml-2 font-medium">{nodes.length}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Connections:</span>
                      <span className="ml-2 font-medium">{edges.length}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Vault Operations:</span>
                      <span className="ml-2 font-medium">
                        {nodes.filter(n => n.data.category === 'vault').length}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Swap Operations:</span>
                      <span className="ml-2 font-medium">
                        {nodes.filter(n => n.data.category === 'swap').length}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="simulation" className="mt-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Transaction Simulation</h3>
                <Button 
                  onClick={handleSimulate}
                  disabled={!validation.valid}
                  variant="outline"
                  size="sm"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Simulate
                </Button>
              </div>

              {simulationResult && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Simulation Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {simulationResult.success ? (
                      <>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Operations:</span>
                            <span className="ml-2 font-medium">{simulationResult.operations?.length || 0}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Estimated Gas:</span>
                            <span className="ml-2 font-medium">{simulationResult.estimatedGas?.toString() || 'N/A'}</span>
                          </div>
                        </div>
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-sm text-green-700">
                            ✅ Simulation successful - workflow ready for execution
                          </p>
                        </div>
                      </>
                    ) : (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-700">
                          ❌ Simulation failed: {simulationResult.errors?.join(', ')}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="execution" className="mt-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Execute Workflow</h3>
                <Button 
                  onClick={handleExecute}
                  disabled={!validation.valid || isExecuting}
                  size="sm"
                >
                  <Play className="w-4 h-4 mr-2" />
                  {isExecuting ? 'Executing...' : 'Execute'}
                </Button>
              </div>

              {/* Execution Steps */}
              {executionSteps.length > 0 && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Execution Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-48">
                      <div className="space-y-3">
                        <>{console.log("executionSteps", executionSteps)}</>
                        {executionSteps.map((step, index) => {
                          const node = nodes.find(n => n.id === step.nodeId);
                          return (
                            <div 
                              key={step.nodeId}
                              className={`flex items-center gap-3 p-3 rounded-lg border ${
                                currentStep === index ? 'bg-blue-50 border-blue-200' : 'bg-background'
                              }`}
                            >
                              {getStepIcon(step.status)}
                              <div className="flex-1">
                                <div className="font-medium text-sm">
                                  {node?.data.label || 'Unknown Node'}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                {step.operation?.target 
            ? `${step.operation.target.slice(0, 10)}...${step.operation.target.slice(-8)}`
            : 'No target address'
          }
                                </div>
                              </div>
                              <Badge 
                                variant={
                                  step.status === 'completed' ? 'default' :
                                  step.status === 'executing' ? 'secondary' :
                                  step.status === 'failed' ? 'destructive' : 'outline'
                                }
                                className="text-xs"
                              >
                                {step.status}
                              </Badge>
                            </div>
                          );
                        })}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              )}

              {/* Execution Result */}
              {executionResult && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Execution Result</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {executionResult.success ? (
                      <div className="space-y-3">
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-sm text-green-700 font-medium">
                            ✅ Workflow executed successfully!
                          </p>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Transaction Hash:</span>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs">{executionResult.transactionHash?.slice(0, 10)}...{executionResult.transactionHash?.slice(-8)}</span>
                              <ExternalLink className="w-3 h-3" />
                            </div>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Gas Used:</span>
                            <span className="font-medium">{executionResult.gasUsed?.toString()}</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-700">
                          ❌ Execution failed: {executionResult.error}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};