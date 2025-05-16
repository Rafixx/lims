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
  onChangeCapture
}: EntitySelectProps<T, F>) => {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
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
              disabled={isLoading}
              className={`
                border p-2 rounded focus:outline-none focus:ring
                ${icon && onIconClick ? 'flex-1' : 'w-full'}
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
