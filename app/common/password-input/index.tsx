import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { forwardRef, useState } from 'react';

interface PasswordInputProps {
  id: string;
  label: string;
  value?: string;
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

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      id,
      label,
      value,
      onChange,
      placeholder = '••••••••',
      autoComplete = 'current-password',
      required = false,
      disabled = false,
      error,
      name,
      onBlur,
      ...rest
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
      setShowPassword((prev) => !prev);
    };

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
        <div className="relative mt-0.5">
          <input
            id={id}
            name={name}
            type={showPassword ? 'text' : 'password'}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            autoComplete={autoComplete}
            required={required}
            disabled={disabled}
            ref={ref}
            className={`w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition-colors placeholder:text-slate-400 hover:border-slate-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50 ${
              error
                ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
                : ''
            }`}
            {...rest}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-white rounded"
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeSlashIcon className="h-4 w-4" aria-hidden />
            ) : (
              <EyeIcon className="h-4 w-4" aria-hidden />
            )}
          </button>
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  },
);

PasswordInput.displayName = 'PasswordInput';

export default PasswordInput;
