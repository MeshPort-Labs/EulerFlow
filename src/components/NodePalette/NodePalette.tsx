import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { 
  Database, 
  ArrowRightLeft, 
  Zap, 
  Target,
  Play,
  Square
} from 'lucide-react';

interface NodeTemplate {
  id: string;
  type: string;
  label: string;
  category: 'vault' | 'swap' | 'automation' | 'strategy' | 'control';
  description: string;
  icon: React.ReactNode;
}

const nodeTemplates: NodeTemplate[] = [
  // Control nodes
  {
    id: 'start',
    type: 'startNode',
    label: 'Start',
    category: 'control',
    description: 'Workflow starting point',
    icon: <Play className="w-4 h-4" />
  },
  {
    id: 'end',
    type: 'endNode',
    label: 'End',
    category: 'control',
    description: 'Workflow ending point',
    icon: <Square className="w-4 h-4" />
  },
  
  // Vault operations
  {
    id: 'vault-deposit',
    type: 'vaultNode',
    label: 'Vault Deposit',
    category: 'vault',
    description: 'Deposit assets to earn yield',
    icon: <Database className="w-4 h-4" />
  },
  {
    id: 'vault-withdraw',
    type: 'vaultNode',
    label: 'Vault Withdraw',
    category: 'vault',
    description: 'Withdraw assets from vault',
    icon: <Database className="w-4 h-4" />
  },
  {
    id: 'vault-borrow',
    type: 'vaultNode',
    label: 'Vault Borrow',
    category: 'vault',
    description: 'Borrow against collateral',
    icon: <Database className="w-4 h-4" />
  },
  
  // Swap operations
  {
    id: 'euler-swap',
    type: 'swapNode',
    label: 'EulerSwap',
    category: 'swap',
    description: 'Swap tokens with EulerSwap',
    icon: <ArrowRightLeft className="w-4 h-4" />
  },
  {
    id: 'dex-swap',
    type: 'swapNode',
    label: 'DEX Swap',
    category: 'swap',
    description: 'External DEX swap',
    icon: <ArrowRightLeft className="w-4 h-4" />
  },
];

const categoryIcons = {
  control: <Play className="w-4 h-4" />,
  vault: <Database className="w-4 h-4" />,
  swap: <ArrowRightLeft className="w-4 h-4" />,
  automation: <Zap className="w-4 h-4" />,
  strategy: <Target className="w-4 h-4" />,
};

const categoryColors = {
  control: 'bg-gray-100 text-gray-700 border-gray-200',
  vault: 'bg-blue-100 text-blue-700 border-blue-200',
  swap: 'bg-green-100 text-green-700 border-green-200',
  automation: 'bg-purple-100 text-purple-700 border-purple-200',
  strategy: 'bg-orange-100 text-orange-700 border-orange-200',
};

interface NodePaletteProps {
  onNodeDrag: (nodeTemplate: NodeTemplate) => void;
}

export const NodePalette: React.FC<NodePaletteProps> = () => {
  const handleDragStart = (event: React.DragEvent, nodeTemplate: NodeTemplate) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify(nodeTemplate));
    event.dataTransfer.effectAllowed = 'move';
  };

  const groupedNodes = nodeTemplates.reduce((groups, node) => {
    if (!groups[node.category]) {
      groups[node.category] = [];
    }
    groups[node.category].push(node);
    return groups;
  }, {} as Record<string, NodeTemplate[]>);

  return (
    <div className="w-80 bg-card border-r h-full overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Node Palette</h2>
        
        {Object.entries(groupedNodes).map(([category, nodes]) => (
          <Card key={category} className="mb-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                {categoryIcons[category as keyof typeof categoryIcons]}
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {nodes.map((node) => (
                <div
                  key={node.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, node)}
                  className={`p-3 border-2 border-dashed rounded-lg cursor-grab hover:shadow-md transition-all duration-200 ${categoryColors[node.category]}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {node.icon}
                    <span className="font-medium text-sm">{node.label}</span>
                  </div>
                  <p className="text-xs opacity-75">{node.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};