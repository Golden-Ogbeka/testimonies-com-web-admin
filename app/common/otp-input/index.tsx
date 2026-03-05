import OTPInput from 'react-otp-input';

interface OtpInputProps {
  value: string;
  onChange: (otp: string) => void;
  numInputs?: number;
  label?: string;
  error?: string;
}

export default function OtpInput({
  value,
  onChange,
  numInputs = 6,
  label = 'One-time password',
  error,
}: OtpInputProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <OTPInput
        value={value}
        onChange={onChange}
        numInputs={numInputs}
        renderSeparator={<span className="mx-1"></span>}
        renderInput={(props) => (
          <input
            {...props}
            className="!w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-50 outline-none transition-all"
            style={{}}
          />
        )}
        inputType="tel"
        shouldAutoFocus
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
