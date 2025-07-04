// src/components/PropertyPanel/components/TextAreaField.tsx
import React from 'react';
import { Textarea } from '../../ui/textarea';
import { FormField } from './FormField';

interface TextAreaFieldProps {
  label: string;
  value?: string;
  placeholder?: string;
  onChange: (value: string) => void;
  required?: boolean;
  error?: string;
  helpText?: string;
  tooltip?: string;
  success?: string;
  warning?: string;
  className?: string;
  rows?: number;
  maxLength?: number;
}

export const TextAreaField: React.FC<TextAreaFieldProps> = ({
  label,
  value,
  placeholder,
  onChange,
  required,
  error,
  helpText,
  tooltip,
  success,
  warning,
  className,
  rows = 3,
  maxLength,
}) => {
  const stringValue = value || '';
  const isValid = !error && stringValue.length > 0;

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
      isValid={isValid}
    >
      <div className="relative">
        <Textarea
          value={stringValue}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          maxLength={maxLength}
          className="border-0 bg-transparent resize-none"
          style={{
            color: 'var(--property-panel-text)',
          }}
        />
        
        {/* Character count */}
        {maxLength && (
          <div 
            className="absolute -bottom-5 right-0 text-xs"
            style={{ color: 'var(--property-panel-text-muted)' }}
          >
            {stringValue.length}/{maxLength}
          </div>
        )}
      </div>
    </FormField>
  );
};