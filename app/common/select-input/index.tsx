import Select from 'react-select';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectInputProps {
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  widthClassName?: string;
}

export default function SelectInput({
  value,
  options,
  onChange,
  widthClassName = 'w-full sm:min-w-[170px] sm:w-auto',
}: SelectInputProps) {
  const selectedOption = options.find((option) => option.value === value) ?? null;

  return (
    <div className={widthClassName}>
      <Select
        options={options}
        value={selectedOption}
        onChange={(option) => onChange(option?.value ?? '')}
        isSearchable={false}
        menuPortalTarget={typeof window !== 'undefined' ? document.body : undefined}
        styles={{
          control: (base, state) => ({
            ...base,
            minHeight: 40,
            borderRadius: 10,
            borderColor: state.isFocused ? '#136dec' : '#e5e7eb',
            boxShadow: state.isFocused ? '0 0 0 2px rgba(19,109,236,0.2)' : 'none',
            '&:hover': { borderColor: state.isFocused ? '#136dec' : '#d1d5db' },
          }),
          valueContainer: (base) => ({
            ...base,
            paddingLeft: 12,
            paddingRight: 6,
          }),
          dropdownIndicator: (base) => ({
            ...base,
            padding: 8,
            color: '#64748b',
          }),
          indicatorSeparator: () => ({ display: 'none' }),
          menuPortal: (base) => ({ ...base, zIndex: 60 }),
          menu: (base) => ({ ...base, borderRadius: 10, overflow: 'hidden' }),
          option: (base, state) => ({
            ...base,
            backgroundColor: state.isFocused ? '#eff6ff' : '#ffffff',
            color: '#0f172a',
            cursor: 'pointer',
          }),
        }}
      />
    </div>
  );
}
