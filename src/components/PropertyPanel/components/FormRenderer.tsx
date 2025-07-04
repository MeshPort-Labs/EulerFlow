import React from 'react';
import { InputField } from './InputField';
import { SelectField } from './SelectField';
import { TextAreaField } from './TextAreaField';
import { SliderField } from './SliderField';
import { SwitchField } from './SwitchField';
import type { FormFieldConfig } from '../configs/formConfigs';
import type { NodeData } from '../../../types/nodes';

interface FormRendererProps {
  fields: FormFieldConfig[];
  data: NodeData;
  onUpdate: (updates: Partial<NodeData>) => void;
  errors?: Record<string, string>;
}

export const FormRenderer: React.FC<FormRendererProps> = ({
  fields,
  data,
  onUpdate,
  errors = {},
}) => {
  const renderField = (field: FormFieldConfig) => {
    // Check if field should be shown
    if (field.showIf && !field.showIf(data)) {
      return null;
    }

    const value = (data as any)[field.key];
    const error = errors[field.key];

    const handleChange = (newValue: any) => {
      onUpdate({ [field.key]: newValue });
    };

    switch (field.type) {
      case 'input':
        return (
          <InputField
          key={field.key}
          label={field.label}
          type={field.inputType}
          value={value}
          placeholder={field.placeholder}
          onChange={handleChange}
          required={field.required}
          error={error}
          helpText={field.helpText}
          tooltip={field.tooltip}
          min={field.min}
          max={field.max}
          step={field.step}
          maxLength={field.maxLength}
          copyable={field.copyable}
          externalLink={field.externalLink}
          validation={field.validation}
        />
      );

    case 'select':
      return (
        <SelectField
          key={field.key}
          label={field.label}
          value={value}
          placeholder={field.placeholder}
          options={field.options || []}
          optionGroups={field.optionGroups}
          onValueChange={handleChange}
          required={field.required}
          error={error}
          helpText={field.helpText}
          tooltip={field.tooltip}
          emptyMessage={field.emptyMessage}
        />
      );

    case 'textarea':
      return (
        <TextAreaField
          key={field.key}
          label={field.label}
          value={value}
          placeholder={field.placeholder}
          onChange={handleChange}
          required={field.required}
          error={error}
          helpText={field.helpText}
          tooltip={field.tooltip}
          rows={field.rows}
          maxLength={field.maxLength}
        />
      );

    case 'slider':
      return (
        <SliderField
          key={field.key}
          label={field.label}
          value={value || field.min || 0}
          min={field.min || 0}
          max={field.max || 100}
          step={field.step}
          onValueChange={handleChange}
          required={field.required}
          error={error}
          helpText={field.helpText}
          tooltip={field.tooltip}
          formatValue={field.formatValue}
          showInput={field.showInput}
          presets={field.presets}
          defaultValue={field.defaultValue}
          marks={field.marks}
        />
      );

    case 'switch':
      return (
        <SwitchField
          key={field.key}
          label={field.label}
          checked={value || false}
          onCheckedChange={handleChange}
          required={field.required}
          error={error}
          helpText={field.helpText}
          tooltip={field.tooltip}
          description={field.description}
        />
      );

    default:
      return null;
  }
};

return (
  <div className="space-y-4">
    {fields.map(renderField)}
  </div>
);
};