// src/components/PropertyPanel/sections/StrategySection.tsx
import React from 'react';
import { FormRenderer } from '../components/FormRenderer';
import { strategyConfigs } from '../configs/formConfigs';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Separator } from '../../ui/separator';
import { 
  TrendingUp, 
  Target, 
  BarChart3, 
  Zap 
} from 'lucide-react';
import type { StrategyNodeData, NodeData } from '../../../types/nodes';

interface StrategySectionProps {
  data: NodeData;
  onUpdate: (updates: Partial<NodeData>) => void;
}

export const StrategySection: React.FC<StrategySectionProps> = ({ 
  data, 
  onUpdate 
}) => {
  const strategyData = data as StrategyNodeData;
  const config = strategyConfigs[strategyData.strategyType] || [];

  const getIcon = () => {
    switch (strategyData.strategyType) {
      case 'leverage': return <TrendingUp className="w-4 h-4" />;
      case 'borrow-against-lp': return <Target className="w-4 h-4" />;
      case 'hedged-lp': return <BarChart3 className="w-4 h-4" />;
      case 'jit-liquidity': return <Zap className="w-4 h-4" />;
      default: return <TrendingUp className="w-4 h-4" />;
    }
  };

  const getTitle = () => {
    switch (strategyData.strategyType) {
      case 'leverage': return 'Leverage Strategy';
      case 'borrow-against-lp': return 'Borrow Against LP';
      case 'hedged-lp': return 'Hedged LP Strategy';
      case 'jit-liquidity': return 'JIT Liquidity Strategy';
      default: return 'Strategy Configuration';
    }
  };

  const getDescription = () => {
    switch (strategyData.strategyType) {
      case 'leverage': return 'Create leveraged positions with borrowed assets';
      case 'borrow-against-lp': return 'Use LP tokens as collateral for borrowing';
      case 'hedged-lp': return 'Create delta-neutral LP positions';
      case 'jit-liquidity': return 'Provide just-in-time liquidity for large trades';
      default: return 'Configure strategy parameters';
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
                style={{ backgroundColor: 'var(--category-strategy)' }}
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
              className="category-badge-strategy text-xs"
            >
              {strategyData.strategyType}
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