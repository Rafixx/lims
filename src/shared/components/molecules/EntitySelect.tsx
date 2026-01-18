// src/shared/components/molecules/EntitySelect.tsx
import { Controller, Control, FieldValues, Path } from 'react-hook-form'
import { IconButton } from './IconButton'

interface EntitySelectProps<T, F extends FieldValues> {
  name: Path<F>
  label: string
  options: T[]
  isLoading?: boolean
  getValue: (item: T) => string | number
  getLabel: (item: T) => string
  control: Control<F>
  required?: boolean
  icon?: React.ReactNode
  onIconClick?: () => void
  onChangeCapture?: (e: React.ChangeEvent<HTMLSelectElement>) => void
  className?: string
  disabled?: boolean
}

export const EntitySelect = <T, F extends FieldValues>({
  name,
  label,
  options,
  isLoading = false,
  getValue,
  getLabel,
  control,
  required = false,
  icon,
  onIconClick,
  onChangeCapture,
  className,
  disabled = false
}: EntitySelectProps<T, F>) => {
  return (
    <div className="mb-4 px-2">
      <label htmlFor={name} className="block text-sm font-medium text-surface-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className={icon && onIconClick ? 'flex items-center' : ''}>
        <Controller
          name={name}
          control={control}
          rules={{ required }}
          render={({ field }) => (
            <select
              {...field}
              id={name}
              disabled={isLoading || disabled}
              className={`
                border border-surface-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                disabled:bg-surface-50 disabled:text-surface-500 disabled:cursor-not-allowed
                ${icon && onIconClick ? 'flex-1' : 'w-full'}
                ${className}
              `}
              onChange={e => {
                field.onChange(e)
                onChangeCapture?.(e)
              }}
            >
              <option value="">{isLoading ? 'Cargando...' : 'Selecciona una opción'}</option>
              {options.map(item => (
                <option key={getValue(item)} value={getValue(item)}>
                  {getLabel(item)}
                </option>
              ))}
            </select>
          )}
        />
        {icon && onIconClick && (
          <IconButton
            title={label}
            type="button"
            onClick={e => {
              e.preventDefault()
              e.stopPropagation()
              onIconClick()
            }}
            aria-label="Acción adicional"
            className="ml-2 flex-shrink-0"
            icon={icon}
          />
        )}
      </div>
    </div>
  )
}
