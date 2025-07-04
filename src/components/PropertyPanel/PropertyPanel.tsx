import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Progress } from '../ui/progress';
import { Alert, AlertDescription } from '../ui/alert';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { 
  Save, 
  X, 
  Settings, 
  Info, 
  AlertTriangle, 
  CheckCircle2,
  RotateCcw,
  Eye,
  Code2
} from 'lucide-react';

import { CoreActionSection } from './sections/CoreActionSection';
import { StrategySection } from './sections/StrategySection';
import { LpToolkitSection } from './sections/LpToolkitSection';
import { AlertSection } from './sections/AlertSection';
import { GeneralNodeProperties } from './GeneralNodeProperties';

import type { Node } from '@xyflow/react';
import type { NodeData } from '../../types/nodes';

interface PropertyPanelProps {
  isOpen: boolean;
  onClose: () => void;
  selectedNode: Node | null;
  onNodeUpdate: (nodeId: string, updates: Partial<NodeData>) => void;
  onPreview?: (node: Node) => void;
  onValidate?: (node: Node) => { isValid: boolean; errors: string[] };
}

export const PropertyPanel: React.FC<PropertyPanelProps> = ({
  isOpen,
  onClose,
  selectedNode,
  onNodeUpdate,
  onPreview,
  onValidate,
}) => {
  const [hasChanges, setHasChanges] = useState(false);
  const [validationResult, setValidationResult] = useState<{ isValid: boolean; errors: string[] }>({ isValid: true, errors: [] });
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [activeAccordion, setActiveAccordion] = useState<string>('properties');

  useEffect(() => {
    if (selectedNode && onValidate) {
      const result = onValidate(selectedNode);
      setValidationResult(result);
    }
  }, [selectedNode, onValidate]);

  if (!selectedNode) {
    return null;
  }

  const nodeData = selectedNode.data as NodeData;

  const handleUpdate = (updates: Partial<NodeData>) => {
    onNodeUpdate(selectedNode.id, updates);
    setHasChanges(true);
    
    // Re-validate after update
    if (onValidate) {
      const updatedNode = { ...selectedNode, data: { ...nodeData, ...updates } };
      const result = onValidate(updatedNode);
      setValidationResult(result);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate save operation
      await new Promise(resolve => setTimeout(resolve, 500));
      setHasChanges(false);
      setLastSaved(new Date());
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    // Reset to original state (you'd implement this based on your needs)
    setHasChanges(false);
  };

  const handlePreview = () => {
    if (onPreview) {
      onPreview(selectedNode);
    }
  };

  const getValidationProgress = () => {
    if (!onValidate) return 100;
    return validationResult.isValid ? 100 : Math.max(20, 100 - (validationResult.errors.length * 20));
  };

  const renderNodeSpecificProperties = () => {
    switch (nodeData.category) {
      case 'core':
        return <CoreActionSection data={nodeData} onUpdate={handleUpdate} />;
      case 'lp-toolkit':
        return <LpToolkitSection data={nodeData} onUpdate={handleUpdate} />;
      case 'strategy':
        return <StrategySection data={nodeData} onUpdate={handleUpdate} />;
      case 'alert':
        return <AlertSection data={nodeData} onUpdate={handleUpdate} />;
      case 'control':
        return (
          <div 
            className="text-center py-12"
            style={{ color: 'var(--property-panel-text-muted)' }}
          >
            <Settings className="w-8 h-8 mx-auto mb-3 opacity-50" />
            <h3 className="font-medium mb-2">Control Node</h3>
            <p className="text-sm">Control nodes have no configurable properties.</p>
          </div>
        );
      default:
        return (
          <div 
            className="text-center py-12"
            style={{ color: 'var(--property-panel-text-muted)' }}
          >
            <Code2 className="w-8 h-8 mx-auto mb-3 opacity-50" />
            <h3 className="font-medium mb-2">Unknown Node Type</h3>
            <p className="text-sm">No properties available for this node type.</p>
          </div>
        );
    }
  };

  const getCategoryTheme = (category: string) => {
    const themes = {
      core: 'category-badge-core',
      'lp-toolkit': 'category-badge-lp-toolkit', 
      strategy: 'category-badge-strategy',
      alert: 'category-badge-alert',
      control: 'category-badge-control',
    };
    return themes[category as keyof typeof themes] || 'category-badge-control';
  };

  const getCategoryLabel = (category: string) => {
    const labels = {
      core: 'Core Action',
      'lp-toolkit': 'LP Toolkit',
      strategy: 'Strategy',
      alert: 'Alert',
      control: 'Control',
    };
    return labels[category as keyof typeof labels] || 'Unknown';
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        className="w-96 overflow-hidden flex flex-col"
        style={{ backgroundColor: 'var(--property-panel-bg)' }}
      >
        {/* Header */}
        <SheetHeader className="flex-shrink-0 pb-4">
          <div className="flex items-center justify-between">
            <SheetTitle 
              className="flex items-center gap-3 text-base"
              style={{ color: 'var(--property-panel-text)' }}
            >
              <div className="flex flex-col">
                <span className="font-semibold">{nodeData.label}</span>
                <span 
                  className="text-xs font-normal"
                  style={{ color: 'var(--property-panel-text-muted)' }}
                >
                  Node ID: {selectedNode.id}
                </span>
              </div>
            </SheetTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Status badges and indicators */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge 
                variant="outline" 
                className={`text-xs ${getCategoryTheme(nodeData.category)}`}
              >
                {getCategoryLabel(nodeData.category)}
              </Badge>
              
              {hasChanges && (
                <Badge variant="secondary" className="text-xs animate-pulse">
                  Modified
                </Badge>
              )}
              
              {lastSaved && !hasChanges && (
                <Badge variant="outline" className="text-xs">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Saved
                </Badge>
              )}
            </div>
            
            {/* Validation status */}
            <div className="flex items-center gap-2">
              {!validationResult.isValid && (
                <Badge variant="destructive" className="text-xs">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  {validationResult.errors.length} Error{validationResult.errors.length !== 1 ? 's' : ''}
                </Badge>
              )}
              
              {validationResult.isValid && (
                <Badge 
                  className="text-xs"
                  style={{ 
                    backgroundColor: 'var(--property-panel-success)',
                    color: 'white'
                  }}
                >
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Valid
                </Badge>
              )}
            </div>
          </div>
          
          {/* Validation progress */}
          {onValidate && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span style={{ color: 'var(--property-panel-text-muted)' }}>
                  Configuration Progress
                </span>
                <span style={{ color: 'var(--property-panel-text)' }}>
                  {Math.round(getValidationProgress())}%
                </span>
              </div>
              <Progress 
                value={getValidationProgress()} 
                className="h-1"
              />
            </div>
          )}
          
          {/* Validation errors */}
          {!validationResult.isValid && validationResult.errors.length > 0 && (
            <Alert variant="destructive" className="mt-2">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                <div className="space-y-1">
                  {validationResult.errors.map((error, index) => (
                    <div key={index}>• {error}</div>
                  ))}
                </div>
              </AlertDescription>
            </Alert>
          )}
        </SheetHeader>

        <Separator style={{ borderColor: 'var(--property-panel-border)' }} />

        {/* Content with Accordion */}
        <div className="flex-1 overflow-hidden mt-4">
          <Accordion 
            type="single" 
            value={activeAccordion} 
            onValueChange={setActiveAccordion}
            className="h-full flex flex-col"
          >
            <AccordionItem value="properties" className="border-none">
              <AccordionTrigger 
                className="hover:no-underline py-2 text-sm font-medium"
                style={{ color: 'var(--property-panel-text)' }}
              >
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Properties
                  {hasChanges && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-2 pb-4 overflow-y-auto max-h-96">
                {renderNodeSpecificProperties()}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="general" className="border-none">
              <AccordionTrigger 
                className="hover:no-underline py-2 text-sm font-medium"
                style={{ color: 'var(--property-panel-text)' }}
              >
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  General
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-2 pb-4 overflow-y-auto max-h-96">
                <GeneralNodeProperties data={nodeData} onUpdate={handleUpdate} />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <Separator style={{ borderColor: 'var(--property-panel-border)' }} />

        {/* Footer with action buttons */}
        <div className="flex-shrink-0 pt-4 space-y-3">
          {/* Action buttons */}
          <div className="flex gap-2">
            {onPreview && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handlePreview}
                className="flex-1"
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
            )}
            
            {hasChanges && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleReset}
                className="flex-1"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            )}
          </div>
          
          {/* Save button */}
          {hasChanges && (
            <Button 
              onClick={handleSave}
              disabled={isSaving || !validationResult.isValid}
              className="w-full"
              size="sm"
              style={{
                backgroundColor: 'var(--property-panel-accent)',
                color: 'var(--property-panel-accent-foreground)'
              }}
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          )}
          
          {/* Last saved timestamp */}
          {lastSaved && !hasChanges && (
            <div 
              className="text-center text-xs"
              style={{ color: 'var(--property-panel-text-muted)' }}
            >
              Last saved {lastSaved.toLocaleTimeString()}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};