import React from 'react';
import { BaseNode } from './BaseNode';
import { Badge } from '../ui/badge';
import { Label } from '../ui/label';
import type { NodeProps } from '@xyflow/react';
import type { VaultNodeData } from '../../types/nodes';

export const VaultNode: React.FC<NodeProps<VaultNodeData>> = ({ data, selected }) => {
  return (
    <BaseNode data={data} selected={selected}>
      <div className="space-y-3">
        {/* Action Type */}
        <div>
          <Label className="text-xs text-muted-foreground">Action</Label>
          <Badge variant="outline" className="ml-2 text-xs">
            {data.action || 'Not set'}
          </Badge>
        </div>

        {/* Vault Address */}
        {data.vaultAddress && (
          <div>
            <Label className="text-xs text-muted-foreground">Vault</Label>
            <div className="text-xs font-mono bg-muted p-1 rounded text-muted-foreground">
              {data.vaultAddress.slice(0, 10)}...{data.vaultAddress.slice(-8)}
            </div>
          </div>
        )}

        {/* Amount */}
        {data.amount && (
          <div>
            <Label className="text-xs text-muted-foreground">Amount</Label>
            <div className="text-sm font-medium">{data.amount}</div>
          </div>
        )}

        {/* Status Indicator */}
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-xs text-muted-foreground">Ready</span>
        </div>
      </div>
    </BaseNode>
  );
};