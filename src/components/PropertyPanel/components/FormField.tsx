// src/components/PropertyPanel/components/FormField.tsx
import React from 'react';
import { Label } from '../../ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../ui/tooltip';
import { Alert, AlertDescription } from '../../ui/alert';
import { Badge } from '../../ui/badge';
import { cn } from '../../../lib/utils';
import { HelpCircle, AlertCircle, CheckCircle2 } from 'lucide-react';

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  helpText?: string;
  tooltip?: string;
  success?: string;
  warning?: string;
  className?: string;
  children: React.ReactNode;
  isValid?: boolean;
  showValidation?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  required = false,
  error,
  helpText,
  tooltip,
  success,
  warning,
  className,
  children,
  isValid,
  showValidation = true,
}) => {
  const getValidationIcon = () => {
    if (!showValidation) return null;
    
    if (error) {
      return <AlertCircle className="w-3 h-3 text-[var(--property-panel-error)]" />;
    }
    
    if (isValid) {
      return <CheckCircle2 className="w-3 h-3 text-[var(--property-panel-success)]" />;
    }
    
    return null;
  };

  return (
    <div className={cn('space-y-2', className)} style={{ marginBottom: 'var(--form-field-spacing)' }}>
      {/* Label with tooltip */}
      <div className="flex items-center gap-2">
        <Label 
          className="text-sm flex items-center gap-1"
          style={{ 
            color: 'var(--property-panel-text)',
            fontWeight: 'var(--form-label-weight)'
          }}
        >
          {label}
          {required && <span className="text-[var(--property-panel-error)]">*</span>}
          {getValidationIcon()}
        </Label>
        
        {tooltip && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button type="button" className="outline-none">
                  <HelpCircle className="w-3 h-3 text-[var(--property-panel-text-muted)] hover:text-[var(--property-panel-text)]" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="max-w-xs">
                <p className="text-xs">{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      
      {/* Input field */}
      <div className="property-panel-field">
        {children}
      </div>
      
      {/* Messages */}
      <div className="space-y-1">
        {error && (
          <Alert variant="destructive" className="py-2">
            <AlertCircle className="h-3 w-3" />
            <AlertDescription 
              className="text-xs"
              style={{ fontSize: 'var(--form-error-text-size)' }}
            >
              {error}
            </AlertDescription>
          </Alert>
        )}
        
        {warning && !error && (
          <Alert className="py-2 border-[var(--property-panel-warning)] bg-[color-mix(in_srgb,var(--property-panel-warning)_10%,transparent)]">
            <AlertCircle className="h-3 w-3 text-[var(--property-panel-warning)]" />
            <AlertDescription 
              className="text-xs text-[var(--property-panel-warning)]"
              style={{ fontSize: 'var(--form-help-text-size)' }}
            >
              {warning}
            </AlertDescription>
          </Alert>
        )}
        
        {success && !error && !warning && (
          <Alert className="py-2 border-[var(--property-panel-success)] bg-[color-mix(in_srgb,var(--property-panel-success)_10%,transparent)]">
            <CheckCircle2 className="h-3 w-3 text-[var(--property-panel-success)]" />
            <AlertDescription 
              className="text-xs text-[var(--property-panel-success)]"
              style={{ fontSize: 'var(--form-help-text-size)' }}
            >
              {success}
            </AlertDescription>
          </Alert>
        )}
        
        {helpText && !error && !warning && !success && (
          <p 
            className="text-xs"
            style={{ 
              color: 'var(--property-panel-text-muted)',
              fontSize: 'var(--form-help-text-size)'
            }}
          >
            {helpText}
          </p>
        )}
      </div>
    </div>
  );
};