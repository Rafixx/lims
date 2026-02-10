// src/shared/components/molecules/ToggleButton.tsx

export type ToggleOption<T extends string | number | boolean = string> = {
  value: T
  label: string
}

export type ToggleButtonProps<T extends string | number | boolean = string> = {
  options: [ToggleOption<T>, ToggleOption<T>, ...ToggleOption<T>[]]
  value: T
  onChange: (value: T) => void
  label?: string
  className?: string
}

export const ToggleButton = <T extends string | number | boolean = string>({
  options,
  value,
  onChange,
  label,
  className = ''
}: ToggleButtonProps<T>) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {label ? (
        <span className="text-xs text-surface-500 font-medium uppercase tracking-wide">
          {label}
        </span>
      ) : null}
      <div
        role="group"
        aria-label={label}
        className="flex rounded-lg border border-surface-200 overflow-hidden shadow-soft bg-white"
      >
        {options.map((option, index) => (
          <button
            key={String(option.value)}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={option.value === value}
            className={[
              'px-4 py-2 text-sm font-medium transition-colors',
              index > 0 ? 'border-l border-surface-200' : '',
              option.value === value
                ? 'bg-primary-600 text-white'
                : 'text-surface-600 hover:bg-surface-50'
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}
