// src/components/PropertyPanel/sections/CoreActionSection.tsx
import React from 'react';
import { FormRenderer } from '../components/FormRenderer';
import { coreActionConfigs } from '../configs/formConfigs';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Separator } from '../../ui/separator';
import { 
  Database, 
  ArrowRightLeft, 
  Settings, 
  ArrowUpRight,
  CheckCircle,
  Download
} from 'lucide-react';
import type { CoreActionNodeData, NodeData } from '../../../types/nodes';

interface CoreActionSectionProps {
  data: NodeData;
  onUpdate: (updates: Partial<NodeData>) => void;
}

export const CoreActionSection: React.FC<CoreActionSectionProps> = ({ 
  data, 
  onUpdate 
}) => {
  const coreData = data as CoreActionNodeData;
  const config = coreActionConfigs[coreData.action] || [];

  const getIcon = () => {
    switch (coreData.action) {
      case 'supply': return <Database className="w-4 h-4" />;
      case 'withdraw': return <ArrowUpRight className="w-4 h-4" />;
      case 'borrow': return <Download className="w-4 h-4" />;
      case 'repay': return <CheckCircle className="w-4 h-4" />;
      case 'swap': return <ArrowRightLeft className="w-4 h-4" />;
      case 'permissions': return <Settings className="w-4 h-4" />;
      default: return <Database className="w-4 h-4" />;
    }
  };

  const getTitle = () => {
    switch (coreData.action) {
      case 'supply': return 'Supply Configuration';
      case 'withdraw': return 'Withdraw Configuration';
      case 'borrow': return 'Borrow Configuration';
      case 'repay': return 'Repay Configuration';
      case 'swap': return 'Swap Configuration';
      case 'permissions': return 'Permissions Configuration';
      default: return 'Action Configuration';
    }
  };

  const getDescription = () => {
    switch (coreData.action) {
      case 'supply': return 'Deposit assets to earn yield';
      case 'withdraw': return 'Withdraw assets from vault';
      case 'borrow': return 'Borrow assets against collateral';
      case 'repay': return 'Repay borrowed assets';
      case 'swap': return 'Exchange tokens via EulerSwap';
      case 'permissions': return 'Enable collaterals and controllers';
      default: return 'Configure action parameters';
    }
  };

  return (
    <div className="space-y-4">
      <Card className="property-panel-section">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <div 
                className="p-1.5 rounded-md"
                style={{ backgroundColor: 'var(--category-core)' }}
              >
                {React.cloneElement(getIcon(), { className: "w-4 h-4 text-white" })}
              </div>
              <div className="flex flex-col">
                <span>{getTitle()}</span>
                <span 
                  className="text-xs font-normal"
                  style={{ color: 'var(--property-panel-text-muted)' }}
                >
                  {getDescription()}
                </span>
              </div>
            </CardTitle>
            <Badge 
              variant="outline" 
              className="category-badge-core text-xs"
            >
              {coreData.action}
            </Badge>
          </div>
        </CardHeader>
        
        <Separator style={{ borderColor: 'var(--property-panel-border)' }} />
        
        <CardContent className="pt-4">
          <FormRenderer 
            fields={config} 
            data={data} 
            onUpdate={onUpdate}
          />
        </CardContent>
      </Card>
    </div>
  );
};