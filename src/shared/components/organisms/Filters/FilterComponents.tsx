import { Search, ChevronDown } from 'lucide-react'

// src/shared/components/organisms/Filters/FilterComponents.tsx

// Estilos base consistentes para todos los inputs
const INPUT_BASE_CLASSES =
  'w-full px-3 py-2.5 text-sm border border-surface-300 rounded-lg ' +
  'bg-white placeholder-surface-400 ' +
  'focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none ' +
  'transition-all duration-200 ' +
  'disabled:bg-surface-50 disabled:text-surface-500 disabled:cursor-not-allowed'

const LABEL_CLASSES = 'text-xs font-medium text-surface-700 mb-1.5'

interface SelectFilterProps {
  label?: string
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
  placeholder?: string
  disabled?: boolean
  className?: string
}

export const SelectFilter = ({
  label,
  value,
  onChange,
  options,
  placeholder = 'Seleccionar...',
  disabled = false,
  className = ''
}: SelectFilterProps) => (
  <div className={`flex flex-col ${className}`}>
    {label && <label className={LABEL_CLASSES}>{label}</label>}
    <div className="relative">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        disabled={disabled}
        className={`${INPUT_BASE_CLASSES} pr-10 appearance-none cursor-pointer ${disabled ? 'cursor-not-allowed' : ''}`}
      >
        <option value="" disabled={!placeholder}>
          {placeholder}
        </option>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {/* Ícono de dropdown personalizado */}
      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-surface-400 pointer-events-none" />
    </div>
  </div>
)

interface SearchFilterProps {
  label?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  onClear?: () => void
}

export const SearchFilter = ({
  label,
  value,
  onChange,
  placeholder = 'Buscar...',
  disabled = false,
  className = '',
  onClear
}: SearchFilterProps) => (
  <div className={`flex flex-col ${className}`}>
    {label && <label className={LABEL_CLASSES}>{label}</label>}
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-surface-400 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`${INPUT_BASE_CLASSES} pl-10 ${value && onClear ? 'pr-10' : 'pr-3'}`}
      />
      {/* Botón para limpiar búsqueda */}
      {value && onClear && (
        <button
          onClick={onClear}
          type="button"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-surface-400 hover:text-surface-600 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  </div>
)

interface ToggleFilterProps {
  label: string
  active: boolean
  onChange: (active: boolean) => void
  icon?: React.ReactNode
  disabled?: boolean
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export const ToggleFilter = ({
  label,
  active,
  onChange,
  icon,
  disabled = false,
  className = '',
  size = 'md'
}: ToggleFilterProps) => {
  // Alineado con INPUT_BASE_CLASSES para consistencia de altura
  const sizeClasses = {
    sm: 'px-3 py-2 text-xs',
    md: 'px-3 py-2.5 text-sm', // Mismo py-2.5 que los inputs
    lg: 'px-4 py-2.5 text-base'
  }

  const baseClasses = `
    inline-flex items-center gap-1.5 font-normal rounded-lg
    border transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1
    disabled:opacity-50 disabled:cursor-not-allowed
    ${sizeClasses[size]}
    ${className}
  `

  // Colores más sutiles para menor presencia visual
  const variantClasses = active
    ? 'bg-primary-50 text-primary-700 border-primary-200 hover:bg-primary-100 hover:border-primary-300'
    : 'bg-surface-50 text-surface-600 border-surface-200 hover:bg-surface-100 hover:border-surface-300'

  return (
    <button
      onClick={() => !disabled && onChange(!active)}
      disabled={disabled}
      type="button"
      className={`${baseClasses} ${variantClasses}`}
    >
      {icon && <span className="flex-shrink-0 w-4 h-4">{icon}</span>}
      <span>{label}</span>
    </button>
  )
}

// Componente adicional para filtros numéricos
interface NumberFilterProps {
  label?: string
  value: number | ''
  onChange: (value: number | '') => void
  placeholder?: string
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  className?: string
  prefix?: string
  suffix?: string
}

export const NumberFilter = ({
  label,
  value,
  onChange,
  placeholder = '0',
  min,
  max,
  step = 1,
  disabled = false,
  className = '',
  prefix,
  suffix
}: NumberFilterProps) => (
  <div className={`flex flex-col ${className}`}>
    {label && <label className={LABEL_CLASSES}>{label}</label>}
    <div className="relative">
      {prefix && (
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm text-surface-500 pointer-events-none">
          {prefix}
        </span>
      )}
      <input
        type="number"
        value={value}
        onChange={e => {
          const val = e.target.value
          onChange(val === '' ? '' : Number(val))
        }}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        className={`
          ${INPUT_BASE_CLASSES}
          ${prefix ? 'pl-8' : 'pl-3'}
          ${suffix ? 'pr-8' : 'pr-3'}
        `}
      />
      {suffix && (
        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-surface-500 pointer-events-none">
          {suffix}
        </span>
      )}
    </div>
  </div>
)

// Componente para filtros de fecha
interface DateFilterProps {
  label?: string
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  className?: string
  min?: string
  max?: string
}

export const DateFilter = ({
  label,
  value,
  onChange,
  disabled = false,
  className = '',
  min,
  max
}: DateFilterProps) => (
  <div className={`flex flex-col ${className}`}>
    {label && <label className={LABEL_CLASSES}>{label}</label>}
    <input
      type="date"
      value={value}
      onChange={e => onChange(e.target.value)}
      disabled={disabled}
      min={min}
      max={max}
      className={INPUT_BASE_CLASSES}
    />
  </div>
)
