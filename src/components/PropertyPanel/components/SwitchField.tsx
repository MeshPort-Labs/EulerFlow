// src/components/PropertyPanel/components/SwitchField.tsx
import React from 'react';
import { Switch } from '../../ui/switch';
import { FormField } from './FormField';

interface SwitchFieldProps {
  label: string;
  checked?: boolean;
  onCheckedChange: (checked: boolean) => void;
  required?: boolean;
  error?: string;
  helpText?: string;
  tooltip?: string;
  success?: string;
  warning?: string;
  className?: string;
  description?: string;
}

export const SwitchField: React.FC<SwitchFieldProps> = ({
  label,
  checked = false,
  onCheckedChange,
  required,
  error,
  helpText,
  tooltip,
  success,
  warning,
  className,
  description,
}) => {
  return (
    <FormField
      label={label}
      required={required}
      error={error}
      helpText={helpText}
      tooltip={tooltip}
      success={success}
      warning={warning}
      className={className}
      isValid={checked}
    >
      <div className="flex items-center justify-between py-2">
        <div className="flex flex-col">
          {description && (
            <span 
              className="text-sm"
              style={{ color: 'var(--property-panel-text-muted)' }}
            >
              {description}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            checked={checked}
            onCheckedChange={onCheckedChange}
          />
          <span 
            className="text-sm"
            style={{ color: 'var(--property-panel-text-muted)' }}
          >
            {checked ? 'Enabled' : 'Disabled'}
          </span>
        </div>
      </div>
    </FormField>
  );
};