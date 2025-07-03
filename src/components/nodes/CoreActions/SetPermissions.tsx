// src/components/nodes/CoreActions/SetPermissions.tsx
import React from 'react';
import { BaseNode } from '../BaseNode';
import { Badge } from '../../ui/badge';
import { Label } from '../../ui/label';
import { Settings, Shield } from 'lucide-react';
import type { NodeProps } from '@xyflow/react';
import type { CoreActionNodeData } from '../../../types/nodes';

export const SetPermissions: React.FC<NodeProps> = ({ data, selected }) => {
  const nodeData = data as CoreActionNodeData;
  
  const getStatus = () => {
    return nodeData.collaterals?.length || nodeData.controller ? 'Ready' : 'Needs Configuration';
  };

  return (
    <BaseNode data={nodeData} selected={selected}>
      <div className="space-y-3">
        {/* Action Header */}
        <div className="flex items-center justify-center">
          <div className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 border-2 border-gray-200">
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              <span className="text-xs font-medium">Set Permissions</span>
            </div>
          </div>
        </div>

        {/* Collaterals */}
        {nodeData.collaterals && nodeData.collaterals.length > 0 && (
          <div className="text-center">
            <Label className="text-xs text-muted-foreground">Collaterals</Label>
            <div className="flex flex-wrap justify-center gap-1 mt-1">
              {nodeData.collaterals.map((collateral, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {collateral}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Controller */}
        {nodeData.controller && (
          <div className="text-center">
            <Label className="text-xs text-muted-foreground">Controller</Label>
            <div className="font-medium text-sm">{nodeData.controller}</div>
          </div>
        )}

        {/* Permission Info */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-2">
          <div className="flex items-center gap-2 justify-center">
            <Shield className="w-3 h-3 text-gray-600" />
            <span className="text-xs text-gray-700">
              Enables vault interactions
            </span>
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center justify-center gap-2">
          <div className={`w-2 h-2 rounded-full ${getStatus() === 'Ready' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
          <span className="text-xs text-muted-foreground">{getStatus()}</span>
        </div>
      </div>
    </BaseNode>
  );
};