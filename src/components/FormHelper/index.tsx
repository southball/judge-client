import * as React from 'react';
import AceEditor, { IAceEditorProps } from 'react-ace';
import Select from 'react-select';
import './style.scss';

export interface FieldProps {
  className?: string;
  description: string;
  children?: any;
}

export const FieldRow = ({ children, ...props }: { children: any; [key: string]: any }) => (
  <div className="columns form-field-row" {...props}>
    {children}
  </div>
);

export const Field = ({ className, children, description }: FieldProps) => (
  <div className={`${className ?? ''} field form-field`}>
    <label className="label">{description}</label>
    <div className="control is-expanded">{children}</div>
  </div>
);

export type ShallowUpdateEvent<T> = { target: { value: T } };

export interface ReactSelectHelperProps<ValueType, LabelType = string> {
  onChange?: <T extends ShallowUpdateEvent<K>, K>(event: T) => any;
  disabled?: boolean;
  options: { value: ValueType; label: LabelType }[];
  value?: ValueType;

  [key: string]: any;
}

export const ReactSelectHelper = <ValueType, LabelType = string>({
  disabled,
  options,
  onChange,
  value,
  ...props
}: ReactSelectHelperProps<ValueType, LabelType>) => {
  return (
    <Select
      isDisabled={disabled ?? false}
      onChange={({ value }: { value: ValueType }) => onChange?.({ target: { value } })}
      options={options}
      value={options.find((option) => option.value === value)}
      {...props}
    />
  );
};

export interface TrueFalseSelectProps extends Partial<Exclude<ReactSelectHelperProps<boolean>, 'options'>> {
  trueLabel: string;
  falseLabel: string;
}

export const TrueFalseSelect = ({ trueLabel, falseLabel, options, ...props }: TrueFalseSelectProps) => (
  void options,
  (
    <ReactSelectHelper
      options={[
        { value: true, label: trueLabel },
        { value: false, label: falseLabel },
      ]}
      {...props}
    />
  )
);

export interface ReactAceHelperProps extends Omit<IAceEditorProps, 'onChange'> {
  onChange?: <T extends ShallowUpdateEvent<string>>(event: T) => any;
  disabled?: boolean;
}

export const defaultReactAceProps: Partial<Omit<IAceEditorProps, 'onChange'>> = {
  height: '300px',
  width: '100%',
  theme: 'eclipse',
  wrapEnabled: true,
};

export const ReactAceHelper = ({ onChange, setOptions, disabled, ...props }: ReactAceHelperProps) => (
  <AceEditor
    {...defaultReactAceProps}
    onChange={(value) => onChange?.({ target: { value } })}
    setOptions={{
      ...setOptions,
      readOnly: setOptions?.readOnly ?? disabled ?? false,
      foldStyle: (setOptions?.foldStyle ?? 'markbeginend') as any,
    }}
    {...props}
  />
);
