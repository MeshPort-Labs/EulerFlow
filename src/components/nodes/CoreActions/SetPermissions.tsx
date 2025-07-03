import React from 'react';
import { MinimalNode } from '../MinimalNode';
import { Settings } from 'lucide-react';
import type { NodeProps } from '@xyflow/react';
import type { CoreActionNodeData } from '../../../types/nodes';

interface SetPermissionsProps extends NodeProps {
  onDelete?: () => void;
}

export const SetPermissions: React.FC<SetPermissionsProps> = (props) => {
  const config = {
    icon: <Settings className="w-4 h-4 text-white" />,
    label: 'Permissions',
    colorClass: 'bg-gray-500',
    getStatus: (data: CoreActionNodeData) => {
      return data.controller || (data.collaterals && data.collaterals.length > 0) ? 'ready' : 'needs-config';
    }
  };

  return <MinimalNode {...props} config={config} />;
};