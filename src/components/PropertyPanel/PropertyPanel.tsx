import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { VaultNodeProperties } from './VaultNodeProperties';
import { SwapNodeProperties } from './SwapNodeProperties';
import { GeneralNodeProperties } from './GeneralNodeProperties';
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
      case 'vault':
        return <VaultNodeProperties data={nodeData} onUpdate={handleUpdate} />;
      case 'swap':
        return <SwapNodeProperties data={nodeData} onUpdate={handleUpdate} />;
      default:
        return <div className="text-muted-foreground text-sm">No specific properties available.</div>;
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-96 overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ 
                backgroundColor: nodeData.category === 'vault' ? '#3b82f6' : 
                                nodeData.category === 'swap' ? '#22c55e' : '#6b7280'
              }}
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