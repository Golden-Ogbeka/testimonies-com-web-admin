import type React from 'react';

interface FilterBarProps {
  searchPlaceholder?: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  children?: React.ReactNode;
}

const FilterBar: React.FC<FilterBarProps> = ({
  searchPlaceholder = 'Search…',
  searchValue,
  onSearchChange,
  children,
}) => {
  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2 w-full sm:max-w-xs">
        <input
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={searchPlaceholder}
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
};

export default FilterBar;
