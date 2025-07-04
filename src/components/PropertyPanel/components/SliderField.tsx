// src/components/PropertyPanel/components/SliderField.tsx
import React from 'react';
import { Slider } from '../../ui/slider';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { FormField } from './FormField';
import { cn } from '../../../lib/utils';
import { RotateCcw, Minus, Plus } from 'lucide-react';

interface SliderFieldProps {
  label: string;
  value?: number;
  min: number;
  max: number;
  step?: number;
  onValueChange: (value: number) => void;
  required?: boolean;
  error?: string;
  helpText?: string;
  tooltip?: string;
  success?: string;
  warning?: string;
  className?: string;
  formatValue?: (value: number) => string;
  showValue?: boolean;
  showInput?: boolean;
  showMinMax?: boolean;
  presets?: Array<{ label: string; value: number }>;
  defaultValue?: number;
  marks?: Array<{ value: number; label: string }>;
}

export const SliderField: React.FC<SliderFieldProps> = ({
  label,
  value = 0,
  min,
  max,
  step = 0.1,
  onValueChange,
  required,
  error,
  helpText,
  tooltip,
  success,
  warning,
  className,
  formatValue = (val) => val.toString(),
  showValue = true,
  showInput = false,
  showMinMax = true,
  presets = [],
  defaultValue,
  marks = [],
}) => {
  const percentage = ((value - min) / (max - min)) * 100;
  const isValid = value >= min && value <= max;

  const handleInputChange = (inputValue: string) => {
    const numValue = parseFloat(inputValue);
    if (!isNaN(numValue)) {
      onValueChange(Math.max(min, Math.min(max, numValue)));
    }
  };

  const handlePresetClick = (presetValue: number) => {
    onValueChange(presetValue);
  };

  const handleStepAdjust = (direction: 'up' | 'down') => {
    const adjustment = direction === 'up' ? step : -step;
    const newValue = Math.max(min, Math.min(max, value + adjustment));
    onValueChange(newValue);
  };

  const handleReset = () => {
    if (defaultValue !== undefined) {
      onValueChange(defaultValue);
    }
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
      isValid={isValid}
    >
      <div className="space-y-4">
        {/* Presets */}
        {presets.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {presets.map((preset) => (
              <Button
                key={preset.value}
                type="button"
                variant={value === preset.value ? "default" : "outline"}
                size="sm"
                className="h-6 text-xs"
                onClick={() => handlePresetClick(preset.value)}
                style={{
                  backgroundColor: value === preset.value 
                    ? 'var(--property-panel-accent)' 
                    : 'transparent',
                  color: value === preset.value 
                    ? 'var(--property-panel-accent-foreground)' 
                    : 'var(--property-panel-text)',
                  borderColor: 'var(--property-panel-border)'
                }}
              >
                {preset.label}
              </Button>
            ))}
          </div>
        )}
        
        {/* Value display and controls */}
        <div className="flex items-center justify-between">
          {showMinMax && (
            <span 
              className="text-xs font-mono"
              style={{ color: 'var(--property-panel-text-muted)' }}
            >
              {formatValue(min)}
            </span>
          )}
          
          <div className="flex items-center gap-2">
            {showInput ? (
              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => handleStepAdjust('down')}
                  disabled={value <= min}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                
                <Input
                  type="number"
                  value={value}
                  onChange={(e) => handleInputChange(e.target.value)}
                  min={min}
                  max={max}
                  step={step}
                  className="w-20 h-6 text-xs text-center"
                  style={{
                    backgroundColor: 'var(--property-panel-field-bg)',
                    borderColor: 'var(--property-panel-field-border)'
                  }}
                />
                
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => handleStepAdjust('up')}
                  disabled={value >= max}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            ) : showValue && (
              <Badge 
                variant="secondary" 
                className="text-xs font-mono px-2 py-1"
                style={{
                  backgroundColor: 'var(--property-panel-accent)',
                  color: 'var(--property-panel-accent-foreground)'
                }}
              >
                {formatValue(value)}
              </Badge>
            )}
            
            {defaultValue !== undefined && value !== defaultValue && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={handleReset}
              >
                <RotateCcw className="h-3 w-3" />
              </Button>
            )}
          </div>
          
          {showMinMax && (
            <span 
              className="text-xs font-mono"
              style={{ color: 'var(--property-panel-text-muted)' }}
            >
              {formatValue(max)}
            </span>
          )}
        </div>
        
        {/* Slider */}
        <div className="relative px-3">
          <Slider
            value={[value]}
            min={min}
            max={max}
            step={step}
            onValueChange={(values) => onValueChange(values[0])}
            className={cn(
              "w-full",
              "[&_.slider-track]:bg-[var(--property-panel-field-border)]",
              "[&_.slider-range]:bg-[var(--property-panel-accent)]",
              "[&_.slider-thumb]:bg-[var(--property-panel-accent)]",
              "[&_.slider-thumb]:border-[var(--property-panel-accent)]"
            )}
          />
          
          {/* Marks */}
          {marks.length > 0 && (
            <div className="absolute top-6 left-3 right-3">
              {marks.map((mark) => {
                const markPercentage = ((mark.value - min) / (max - min)) * 100;
                return (
                  <div
                    key={mark.value}
                    className="absolute transform -translate-x-1/2"
                    style={{ left: `${markPercentage}%` }}
                  >
                    <div 
                      className="w-0.5 h-2 bg-current"
                      style={{ color: 'var(--property-panel-text-muted)' }}
                    />
                    <span 
                      className="block text-xs mt-1 whitespace-nowrap"
                      style={{ color: 'var(--property-panel-text-muted)' }}
                    >
                      {mark.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
       {/* Progress indicator */}
       <div className="flex items-center gap-2 text-xs">
         <div 
           className="flex-1 h-1 rounded-full"
           style={{ backgroundColor: 'var(--property-panel-field-border)' }}
         >
           <div
             className="h-full rounded-full transition-all duration-200"
             style={{
               width: `${percentage}%`,
               backgroundColor: 'var(--property-panel-accent)'
             }}
           />
         </div>
         <span 
           className="font-mono"
           style={{ color: 'var(--property-panel-text-muted)' }}
         >
           {Math.round(percentage)}%
         </span>
       </div>
     </div>
   </FormField>
 );
};