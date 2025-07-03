// src/components/PropertyPanel/StrategyNodeProperties.tsx
import React from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Slider } from '../ui/slider';
import { TrendingUp, Target, BarChart3, Zap } from 'lucide-react';
import type { StrategyNodeData, NodeData } from '../../types/nodes';

interface StrategyNodePropertiesProps {
  data: NodeData;
  onUpdate: (updates: Partial<NodeData>) => void;
}

const mockTokens = ['USDC', 'WETH', 'DAI', 'USDT', 'wstETH'];

export const StrategyNodeProperties: React.FC<StrategyNodePropertiesProps> = ({ data, onUpdate }) => {
  const strategyData = data as StrategyNodeData;

  const renderLeverageProperties = () => (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium">Collateral Asset (Long)</Label>
        <Select 
          value={strategyData.collateralAsset || ''} 
          onValueChange={(value) => onUpdate({ collateralAsset: value })}
        >
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select asset to long" />
          </SelectTrigger>
          <SelectContent>
            {mockTokens.map((token) => (
              <SelectItem key={token} value={token}>{token}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-sm font-medium">Borrow Asset</Label>
        <Select 
          value={strategyData.borrowAsset || ''} 
          onValueChange={(value) => onUpdate({ borrowAsset: value })}
        >
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select asset to borrow" />
          </SelectTrigger>
          <SelectContent>
            {mockTokens.map((token) => (
              <SelectItem key={token} value={token}>{token}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <Label className="text-sm font-medium">Leverage Factor</Label>
          <span className="text-sm font-bold text-purple-600">
            {strategyData.leverageFactor || 2}x
          </span>
        </div>
        <Slider
          value={[strategyData.leverageFactor || 2]}
          onValueChange={(value) => onUpdate({ leverageFactor: value[0] })}
          max={10}
          min={1.1}
          step={0.1}
          className="mt-2"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>1.1x</span>
          <span>10x</span>
        </div>
      </div>
    </div>
  );

  const renderBorrowAgainstLpProperties = () => (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium">Borrow Asset</Label>
        <Select 
          value={strategyData.borrowAsset || ''} 
          onValueChange={(value) => onUpdate({ borrowAsset: value })}
        >
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select asset to borrow" />
          </SelectTrigger>
          <SelectContent>
            {mockTokens.map((token) => (
              <SelectItem key={token} value={token}>{token}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-sm font-medium">Borrow Amount</Label>
        <Input
          type="text"
          placeholder="Enter amount"
          value={strategyData.borrowAmount || ''}
          onChange={(e) => onUpdate({ borrowAmount: e.target.value })}
          className="mt-1"
        />
      </div>
    </div>
  );

  const renderHedgedLpProperties = () => (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium">Supply Asset</Label>
        <Select 
          value={strategyData.collateralAsset || ''} 
          onValueChange={(value) => onUpdate({ collateralAsset: value })}
        >
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select asset to supply" />
          </SelectTrigger>
          <SelectContent>
            {mockTokens.map((token) => (
              <SelectItem key={token} value={token}>{token}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-sm font-medium">Borrow Asset</Label>
        <Select 
          value={strategyData.borrowAsset || ''} 
          onValueChange={(value) => onUpdate({ borrowAsset: value })}
        >
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select asset to borrow" />
          </SelectTrigger>
          <SelectContent>
            {mockTokens.map((token) => (
              <SelectItem key={token} value={token}>{token}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const renderJitLiquidityProperties = () => (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium">JIT Asset</Label>
        <Select 
          value={strategyData.jitAsset || ''} 
          onValueChange={(value) => onUpdate({ jitAsset: value })}
        >
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select asset for JIT" />
          </SelectTrigger>
          <SelectContent>
            {mockTokens.map((token) => (
              <SelectItem key={token} value={token}>{token}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-sm font-medium">JIT Amount</Label>
        <Input
          type="text"
          placeholder="Enter amount"
          value={strategyData.jitAmount || ''}
          onChange={(e) => onUpdate({ jitAmount: e.target.value })}
          className="mt-1"
        />
      </div>

      <div>
        <Label className="text-sm font-medium">JIT Action</Label>
        <Select 
          value={strategyData.jitAction || ''} 
          onValueChange={(value: 'deploy' | 'withdraw') => onUpdate({ jitAction: value })}
        >
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select JIT action" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="deploy">Deploy JIT</SelectItem>
            <SelectItem value="withdraw">Withdraw JIT</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

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

  const renderProperties = () => {
    switch (strategyData.strategyType) {
      case 'leverage':
        return renderLeverageProperties();
      case 'borrow-against-lp':
        return renderBorrowAgainstLpProperties();
      case 'hedged-lp':
        return renderHedgedLpProperties();
      case 'jit-liquidity':
        return renderJitLiquidityProperties();
      default:
        return <div>Select a strategy type to configure properties.</div>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            {getIcon()}
            {getTitle()}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderProperties()}
        </CardContent>
      </Card>
    </div>
  );
};