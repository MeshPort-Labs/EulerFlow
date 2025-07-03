// src/components/PropertyPanel/PropertyPanel.tsx
import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { GeneralNodeProperties } from './GeneralNodeProperties';
import { CoreActionNodeProperties } from './CoreActionNodeProperties';
import { LpToolkitNodeProperties } from './LpToolkitNodeProperties';
import { StrategyNodeProperties } from './StrategyNodeProperties';
import type { Node } from '@xyflow/react';
import type { NodeData } from '../../types/nodes';

interface PropertyPanelProps {
  isOpen: boolean;
  onClose: () => void;
  selectedNode: Node | null;
  onNodeUpdate: (nodeId: string, updates: Partial<NodeData>) => void;
}

export const PropertyPanel: React.FC<PropertyPanelProps> = ({
  isOpen,
  onClose,
  selectedNode,
  onNodeUpdate,
}) => {
  if (!selectedNode) {
    return null;
  }

  const nodeData = selectedNode.data as NodeData;

  const handleUpdate = (updates: Partial<NodeData>) => {
    onNodeUpdate(selectedNode.id, updates);
  };

  const renderNodeSpecificProperties = () => {
    switch (nodeData.category) {
      case 'core':
        return <CoreActionNodeProperties data={nodeData} onUpdate={handleUpdate} />;
      case 'lp-toolkit':
        return <LpToolkitNodeProperties data={nodeData} onUpdate={handleUpdate} />;
      case 'strategy':
        return <StrategyNodeProperties data={nodeData} onUpdate={handleUpdate} />;
      default:
        return <div className="text-muted-foreground text-sm">No specific properties available.</div>;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'core': return '#3b82f6';
      case 'lp-toolkit': return '#22c55e';
      case 'strategy': return '#8b5cf6';
      case 'control': return '#6b7280';
      default: return '#6b7280';
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-96 overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: getCategoryColor(nodeData.category) }}
            />
            {nodeData.label}
          </SheetTitle>
        </SheetHeader>

        <Tabs defaultValue="properties" className="mt-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="properties">Properties</TabsTrigger>
            <TabsTrigger value="general">General</TabsTrigger>
          </TabsList>

          <TabsContent value="properties" className="mt-4">
            {renderNodeSpecificProperties()}
          </TabsContent>

          <TabsContent value="general" className="mt-4">
            <GeneralNodeProperties data={nodeData} onUpdate={handleUpdate} />
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};