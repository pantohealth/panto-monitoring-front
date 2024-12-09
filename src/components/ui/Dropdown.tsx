import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

interface DropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: string[] ;
  placeholder?: string;
  isOpen: boolean;
  onToggle: () => void;
}

export function Dropdown({
  value,
  onChange,
  options,
  placeholder = 'Select...',
  isOpen,
  onToggle,
}: DropdownProps) {
  return (
    <div className="relative md:w-56 w-20">
      <button
        onClick={onToggle}
        className="w-full px-2 py-2 text-left bg-white border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
      >
        <span className="flex items-center justify-between md:text-sm text-[11px] overflow-hidden text-ellipsis">
          <span className={cn(!value && 'text-gray-400')}>
            {value || placeholder}
          </span>
          <ChevronDown className={cn(
            "w-4 h-4 transition-transform duration-200",
            isOpen && "transform rotate-180"
          )} />
        </span>
      </button>
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg">
          <div className="max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <button
              onClick={() => {
                onChange('');
                onToggle();
              }}
              className={cn(
                'block w-full px-1 md:px-4 py-2 text-left md:text-sm text-[11px] hover:bg-gray-50 transition-colors duration-150',
                !value && 'bg-gray-50 text-blue-600'
              )}
            >
              Show All
            </button>
            {options?.map((option) => (
              <button
                key={option}
                onClick={() => {
                  onChange(option);
                  onToggle();
                }}
                className={cn(
                  'block w-full px-1 md:px-4 py-2 text-left md:text-sm text-[11px] hover:bg-gray-50 transition-colors duration-150',
                  value === option && 'bg-gray-50 text-blue-600'
                )}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}