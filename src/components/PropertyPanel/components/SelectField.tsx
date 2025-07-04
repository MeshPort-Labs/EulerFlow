import React from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue,
  SelectGroup,
  SelectLabel,
  SelectSeparator
} from '../../ui/select';
import { Badge } from '../../ui/badge';
import { FormField } from './FormField';
import { cn } from '../../../lib/utils';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  badge?: string;
  description?: string;
}

interface SelectOptionGroup {
  label: string;
  options: SelectOption[];
}

interface SelectFieldProps {
  label: string;
  value?: string;
  placeholder?: string;
  options?: SelectOption[];
  optionGroups?: SelectOptionGroup[];
  onValueChange: (value: string) => void;
  required?: boolean;
  error?: string;
  helpText?: string;
  tooltip?: string;
  success?: string;
  warning?: string;
  className?: string;
  emptyMessage?: string;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  value,
  placeholder,
  options = [],
  optionGroups = [],
  onValueChange,
  required,
  error,
  helpText,
  tooltip,
  success,
  warning,
  className,
  emptyMessage = "No options available",
}) => {
  const hasOptions = options.length > 0 || optionGroups.length > 0;
  const isValid = !!value && hasOptions;

  const renderOptions = () => {
    if (optionGroups.length > 0) {
      return optionGroups.map((group, index) => (
        <React.Fragment key={group.label}>
          {index > 0 && <SelectSeparator />}
          <SelectGroup>
            <SelectLabel 
              className="text-xs font-medium"
              style={{ color: 'var(--property-panel-text-muted)' }}
            >
              {group.label}
            </SelectLabel>
            {group.options.map((option) => (
              <SelectItem 
                key={option.value} 
                value={option.value}
                disabled={option.disabled}
                className={cn(
                  "cursor-pointer",
                  option.disabled && "opacity-50 cursor-not-allowed"
                )}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex flex-col">
                    <span>{option.label}</span>
                    {option.description && (
                      <span 
                        className="text-xs"
                        style={{ color: 'var(--property-panel-text-muted)' }}
                      >
                        {option.description}
                      </span>
                    )}
                  </div>
                  {option.badge && (
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {option.badge}
                    </Badge>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        </React.Fragment>
      ));
    }

    return options.map((option) => (
      <SelectItem 
        key={option.value} 
        value={option.value}
        disabled={option.disabled}
        className={cn(
          "cursor-pointer",
          option.disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-col">
            <span>{option.label}</span>
            {option.description && (
              <span 
                className="text-xs"
                style={{ color: 'var(--property-panel-text-muted)' }}
              >
                {option.description}
              </span>
            )}
          </div>
          {option.badge && (
            <Badge variant="secondary" className="ml-2 text-xs">
              {option.badge}
            </Badge>
          )}
        </div>
      </SelectItem>
    ));
  };

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
      isValid={isValid ? true : undefined}
    >
      <Select 
        value={value} 
        onValueChange={onValueChange}
        disabled={!hasOptions}
      >
        <SelectTrigger 
          className={cn(
            "w-full transition-colors",
            error && "border-[var(--property-panel-error)] focus:border-[var(--property-panel-error)]",
            !hasOptions && "opacity-50 cursor-not-allowed"
          )}
          style={{
            backgroundColor: 'var(--property-panel-field-bg)',
            borderColor: error ? 'var(--property-panel-error)' : 'var(--property-panel-field-border)'
          }}
        >
          <SelectValue 
            placeholder={hasOptions ? placeholder : emptyMessage}
            style={{ color: 'var(--property-panel-text)' }}
          />
        </SelectTrigger>
        <SelectContent 
          className="max-w-[var(--radix-select-trigger-width)]"
          style={{ backgroundColor: 'var(--property-panel-bg)' }}
        >
          {hasOptions ? renderOptions() : (
            <div 
              className="px-2 py-1.5 text-xs text-center"
              style={{ color: 'var(--property-panel-text-muted)' }}
            >
              {emptyMessage}
            </div>
          )}
        </SelectContent>
      </Select>
    </FormField>
  );
};