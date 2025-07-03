// src/components/NodePalette/NodePalette.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { 
  Database, 
  ArrowRightLeft, 
  Zap, 
  Target,
  Play,
  Square,
  Settings,
  ArrowUpRight,
  CheckCircle,
  Layers,
  Coins,
  TrendingUp,
  BarChart3
} from 'lucide-react';

interface NodeTemplate {
  id: string;
  type: string;
  label: string;
  category: 'core' | 'lp-toolkit' | 'strategy' | 'control' | 'vault' | 'swap'; // Updated categories + legacy support
  description: string;
  icon: React.ReactNode;
  defaultData?: Record<string, any>; // New field for default node data
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
  
  // Core Actions (each with specific action type)
  {
    id: 'supply-assets',
    type: 'coreActionNode',
    label: 'Supply Assets',
    category: 'core',
    description: 'Deposit assets to vault to earn yield',
    icon: <Database className="w-4 h-4" />,
    defaultData: { action: 'supply' }
  },
  {
    id: 'withdraw-assets',
    type: 'coreActionNode',
    label: 'Withdraw Assets',
    category: 'core',
    description: 'Withdraw assets from vault to wallet',
    icon: <ArrowUpRight className="w-4 h-4" />,
    defaultData: { action: 'withdraw' }
  },
  {
    id: 'borrow-assets',
    type: 'coreActionNode',
    label: 'Borrow Assets',
    category: 'core',
    description: 'Borrow assets against collateral',
    icon: <Database className="w-4 h-4" />,
    defaultData: { action: 'borrow' }
  },
  {
    id: 'repay-debt',
    type: 'coreActionNode',
    label: 'Repay Debt',
    category: 'core',
    description: 'Repay borrowed assets',
    icon: <CheckCircle className="w-4 h-4" />,
    defaultData: { action: 'repay' }
  },
  {
    id: 'swap-tokens',
    type: 'coreActionNode',
    label: 'Swap Tokens',
    category: 'core',
    description: 'Swap tokens via EulerSwap',
    icon: <ArrowRightLeft className="w-4 h-4" />,
    defaultData: { action: 'swap' }
  },
  {
    id: 'set-permissions',
    type: 'coreActionNode',
    label: 'Set Permissions',
    category: 'core',
    description: 'Enable collaterals and controllers',
    icon: <Settings className="w-4 h-4" />,
    defaultData: { action: 'permissions' }
  },

  // LP Toolkit
  {
    id: 'create-pool',
    type: 'lpToolkitNode',
    label: 'Create Pool',
    category: 'lp-toolkit',
    description: 'Deploy new EulerSwap pool',
    icon: <Layers className="w-4 h-4" />,
    defaultData: { action: 'create-pool' }
  },
  {
    id: 'add-liquidity',
    type: 'lpToolkitNode',
    label: 'Add Liquidity',
    category: 'lp-toolkit',
    description: 'Add liquidity to pool',
    icon: <Coins className="w-4 h-4" />,
    defaultData: { action: 'add-liquidity' }
  },
  {
    id: 'remove-liquidity',
    type: 'lpToolkitNode',
    label: 'Remove Liquidity',
    category: 'lp-toolkit',
    description: 'Remove liquidity from pool',
    icon: <Coins className="w-4 h-4" />,
    defaultData: { action: 'remove-liquidity' }
  },

  // Structured Strategies (The Magic Buttons)
  {
    id: 'leveraged-position',
    type: 'strategyNode',
    label: 'Build Leveraged Position',
    category: 'strategy',
    description: 'Create leveraged long position',
    icon: <TrendingUp className="w-4 h-4" />,
    defaultData: { strategyType: 'leverage' }
  },
  {
    id: 'borrow-against-lp',
    type: 'strategyNode',
    label: 'Borrow Against LP',
    category: 'strategy',
    description: 'Use LP position as collateral',
    icon: <Target className="w-4 h-4" />,
    defaultData: { strategyType: 'borrow-against-lp' }
  },
  {
    id: 'hedged-lp',
    type: 'strategyNode',
    label: 'Hedged LP',
    category: 'strategy',
    description: 'Create delta-neutral LP position',
    icon: <BarChart3 className="w-4 h-4" />,
    defaultData: { strategyType: 'hedged-lp' }
  },
  {
    id: 'jit-liquidity',
    type: 'strategyNode',
    label: 'JIT Liquidity',
    category: 'strategy',
    description: 'Just-in-time liquidity provision',
    icon: <Zap className="w-4 h-4" />,
    defaultData: { strategyType: 'jit-liquidity' }
  },
];

const categoryIcons = {
  control: <Play className="w-4 h-4" />,
  core: <Database className="w-4 h-4" />,
  'lp-toolkit': <Layers className="w-4 h-4" />,
  strategy: <Target className="w-4 h-4" />,
};

const categoryColors = {
  control: 'bg-gray-100 text-gray-700 border-gray-200',
  core: 'bg-blue-100 text-blue-700 border-blue-200',
  'lp-toolkit': 'bg-green-100 text-green-700 border-green-200',
  strategy: 'bg-purple-100 text-purple-700 border-purple-200',
};

const categoryLabels = {
  control: 'Control',
  core: 'Core Actions',
  'lp-toolkit': 'LP Toolkit',
  strategy: 'Strategies',
};

interface NodePaletteProps {
  onNodeDrag: (nodeTemplate: NodeTemplate) => void;
}

export const NodePalette: React.FC<NodePaletteProps> = () => {
  const handleDragStart = (event: React.DragEvent, nodeTemplate: NodeTemplate) => {
    // Include the defaultData when dragging
    const nodeTemplateWithDefaults = {
      ...nodeTemplate,
      data: {
        label: nodeTemplate.label,
        category: nodeTemplate.category,
        description: nodeTemplate.description,
        ...nodeTemplate.defaultData, // Merge in the default data
      }
    };
    
    event.dataTransfer.setData('application/reactflow', JSON.stringify(nodeTemplateWithDefaults));
    event.dataTransfer.effectAllowed = 'move';
  };

  const groupedNodes = nodeTemplates.reduce((groups, node) => {
    if (!groups[node.category]) {
      groups[node.category] = [];
    }
    groups[node.category].push(node);
    return groups;
  }, {} as Record<string, NodeTemplate[]>);

  // Order categories to show new ones first
  const categoryOrder = ['control', 'core', 'lp-toolkit', 'strategy'];
  const orderedCategories = categoryOrder.filter(cat => groupedNodes[cat]);

  return (
    <div className="w-80 bg-card border-r h-full overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Node Palette</h2>
        
        {orderedCategories.map((category) => (
          <Card key={category} className="mb-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                {categoryIcons[category as keyof typeof categoryIcons]}
                {categoryLabels[category as keyof typeof categoryLabels]}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {groupedNodes[category].map((node) => (
                <div
                  key={node.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, node)}
                  className={`p-3 border-2 border-dashed rounded-lg cursor-grab hover:shadow-md transition-all duration-200 ${categoryColors[node.category as keyof typeof categoryColors]}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {node.icon}
                    <span className="font-medium text-sm">{node.label}</span>
                  </div>
                  <p className="text-xs opacity-75">{node.description}</p>
                  
                  {/* Show default action/strategy type for new nodes */}
                  {node.defaultData && (
                    <div className="mt-2">
                      <span className="text-xs bg-white/50 px-2 py-1 rounded text-gray-600">
                        {node.defaultData.action || node.defaultData.strategyType || 'Configured'}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};