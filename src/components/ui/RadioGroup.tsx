import { cn } from '../../lib/utils';

interface RadioOption {
  label: string;
  value: string;
}

interface RadioGroupProps {
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
}

export function RadioGroup({ options, value, onChange }: RadioGroupProps) {
  return (
    <div className="flex items-center space-x-4">
      {options.map((option) => (
        <label
          key={option.value}
          className={cn(
            'inline-flex items-center cursor-pointer',
            'text-sm font-medium',
            value === option.value ? 'text-blue-600' : 'text-gray-500'
          )}
        >
          <input
            type="radio"
            className="sr-only"
            value={option.value}
            checked={value === option.value}
            onChange={(e) => onChange(e.target.value)}
          />
          <span
            className={cn(
              'w-4 h-4 mr-2 rounded-full border',
              'flex items-center justify-center',
              value === option.value
                ? 'border-blue-600 bg-blue-600'
                : 'border-gray-300'
            )}
          >
            {value === option.value && (
              <span className="w-2 h-2 rounded-full bg-white" />
            )}
          </span>
          {option.label}
        </label>
      ))}
    </div>
  );
}