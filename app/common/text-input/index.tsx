import { forwardRef } from 'react';

interface TextInputProps {
  id: string;
  label: string;
  type: string;
  value?: string | number;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  // React Hook Form props
  name?: string;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  ref?: React.Ref<HTMLInputElement>;
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      id,
      label,
      type,
      value,
      onChange,
      placeholder,
      autoComplete,
      required = false,
      disabled = false,
      error,
      name,
      onBlur,
      ...rest
    },
    ref,
  ) => {
    return (
      <div>
        <label
          htmlFor={id}
          className={`block text-sm font-medium ${
            error ? 'text-red-700' : 'text-slate-900'
          }`}
        >
          {label}
        </label>
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          disabled={disabled}
          ref={ref}
          className={`mt-0.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition-colors placeholder:text-slate-400 hover:border-slate-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50 ${
            error
              ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
              : ''
          }`}
          {...rest}
        />
        {error && (
          <p className="mt-1 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  },
);

TextInput.displayName = 'TextInput';

export default TextInput;
