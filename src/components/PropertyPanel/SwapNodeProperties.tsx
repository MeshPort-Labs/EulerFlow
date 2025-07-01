import React from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Slider } from '../ui/slider';
import { Badge } from '../ui/badge';
import { ArrowRightLeft, Settings, TrendingUp } from 'lucide-react';
import type { SwapNodeData, NodeData } from '../../types/nodes';

interface SwapNodePropertiesProps {
  data: NodeData;
  onUpdate: (updates: Partial<NodeData>) => void;
}

// Mock token data
const mockTokens = [
  { symbol: 'USDC', name: 'USD Coin', price: '$1.00' },
  { symbol: 'WETH', name: 'Wrapped Ethereum', price: '$2,865' },
  { symbol: 'DAI', name: 'Dai Stablecoin', price: '$1.00' },
  { symbol: 'USDT', name: 'Tether USD', price: '$1.00' },
  { symbol: 'wstETH', name: 'Wrapped stETH', price: '$3,055' },
];

export const SwapNodeProperties: React.FC<SwapNodePropertiesProps> = ({ data, onUpdate }) => {
  const swapData = data as SwapNodeData;
  const tokenIn = mockTokens.find(t => t.symbol === swapData.tokenIn);
  const tokenOut = mockTokens.find(t => t.symbol === swapData.tokenOut);

  return (
    <div className="space-y-6">
      {/* Swap Configuration */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <ArrowRightLeft className="w-4 h-4" />
            Swap Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Token In */}
          <div>
            <Label className="text-sm font-medium">From Token</Label>
            <Select 
              value={swapData.tokenIn || ''} 
              onValueChange={(value) => onUpdate({ tokenIn: value })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select input token" />
              </SelectTrigger>
              <SelectContent>
                {mockTokens.map((token) => (
                  <SelectItem key={token.symbol} value={token.symbol}>
                    <div className="flex items-center justify-between w-full">
                      <span>{token.symbol} - {token.name}</span>
                      <Badge variant="outline" className="ml-2 text-xs">
                        {token.price}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {tokenIn && (
              <p className="text-xs text-muted-foreground mt-1">
                Current price: {tokenIn.price}
              </p>
            )}
          </div>

          {/* Token Out */}
          <div>
            <Label className="text-sm font-medium">To Token</Label>
            <Select 
              value={swapData.tokenOut || ''} 
              onValueChange={(value) => onUpdate({ tokenOut: value })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select output token" />
              </SelectTrigger>
              <SelectContent>
                {mockTokens.map((token) => (
                  <SelectItem key={token.symbol} value={token.symbol}>
                    <div className="flex items-center justify-between w-full">
                      <span>{token.symbol} - {token.name}</span>
                      <Badge variant="outline" className="ml-2 text-xs">
                        {token.price}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {tokenOut && (
              <p className="text-xs text-muted-foreground mt-1">
                Current price: {tokenOut.price}
              </p>
            )}
          </div>

          {/* Amount In */}
          <div>
            <Label className="text-sm font-medium">Amount In</Label>
            <Input
              type="text"
              placeholder="Enter amount"
              value={swapData.amountIn || ''}
              onChange={(e) => onUpdate({ amountIn: e.target.value })}
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Swap Settings */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Swap Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Slippage */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm font-medium">Slippage Tolerance</Label>
              <Badge variant="secondary" className="text-xs">
                {swapData.slippage || 0.5}%
              </Badge>
            </div>
            <Slider
              value={[swapData.slippage || 0.5]}
              onValueChange={(value) => onUpdate({ slippage: value[0] })}
              max={5}
              min={0.1}
              step={0.1}
              className="mt-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>0.1%</span>
              <span>5%</span>
            </div>
          </div>

          {/* Quick Slippage Buttons */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Quick Settings</Label>
            <div className="flex gap-2">
              {[0.1, 0.5, 1.0, 2.0].map((value) => (
                <button
                  key={value}
                  onClick={() => onUpdate({ slippage: value })}
                  className={`px-3 py-1 text-xs rounded-md border transition-colors ${
                    swapData.slippage === value
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background hover:bg-muted border-border'
                  }`}
                >
                  {value}%
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Swap Preview */}
     {swapData.tokenIn && swapData.tokenOut && swapData.amountIn && (
       <Card>
         <CardHeader className="pb-3">
           <CardTitle className="text-sm flex items-center gap-2">
             <TrendingUp className="w-4 h-4" />
             Swap Preview
           </CardTitle>
         </CardHeader>
         <CardContent>
           <div className="space-y-2 text-sm">
             <div className="flex justify-between">
               <span className="text-muted-foreground">Input:</span>
               <span>{swapData.amountIn} {swapData.tokenIn}</span>
             </div>
             <div className="flex justify-between">
               <span className="text-muted-foreground">Estimated Output:</span>
               <span>~2,865 {swapData.tokenOut}</span>
             </div>
             <div className="flex justify-between">
               <span className="text-muted-foreground">Price Impact:</span>
               <span className="text-green-600">0.01%</span>
             </div>
             <div className="flex justify-between">
               <span className="text-muted-foreground">Network Fee:</span>
               <span>~$5.23</span>
             </div>
           </div>
         </CardContent>
       </Card>
     )}
   </div>
 );
};