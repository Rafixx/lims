import { useEffect, useState } from 'react'
import { Controller, Control, FieldValues, Path } from 'react-hook-form'
import { IconButton } from './IconButton'

interface EntitySelectProps<T, F extends FieldValues> {
  name: Path<F>
  label: string
  fetchFn: () => Promise<T[]>
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
  fetchFn,
  getValue,
  getLabel,
  control,
  required = false,
  icon,
  onIconClick,
  onChangeCapture
}: EntitySelectProps<T, F>) => {
  const [options, setOptions] = useState<T[]>([])

  useEffect(() => {
    fetchFn().then(setOptions).catch(console.error)
  }, [fetchFn])

  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>

      {/* Wrapper relativo para position:absolute */}
      <div className={icon && onIconClick ? 'flex items-center' : ''}>
        <Controller
          name={name}
          control={control}
          rules={{ required }}
          render={({ field }) => (
            <select
              {...field}
              id={name}
              className={`
                border p-2 rounded focus:outline-none focus:ring
                ${
                  icon && onIconClick
                    ? 'flex-1' // ocupa el espacio restante
                    : 'w-full pr-10' // caso sin botón, deja espacio para absolute
                }
              `}
              onChange={e => {
                field.onChange(e)
                onChangeCapture?.(e)
              }}
            >
              <option value="">Selecciona una opción</option>
              {options.map(item => (
                <option key={getValue(item)} value={getValue(item)}>
                  {getLabel(item)}
                </option>
              ))}
            </select>
          )}
        />

        {/* Botón con icono posicionado a la derecha */}
        {icon && onIconClick && (
          <IconButton
            title={label}
            onClick={e => {
              // evitar que el foco/selección cambie en el select
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
