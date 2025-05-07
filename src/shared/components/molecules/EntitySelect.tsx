import { useEffect, useState } from 'react'
import { Controller, Control, FieldValues, Path } from 'react-hook-form'

interface EntitySelectProps<T, F extends FieldValues> {
  name: Path<F>
  label: string
  fetchFn: () => Promise<T[]>
  getValue: (item: T) => string | number
  getLabel: (item: T) => string
  control: Control<F>
  required?: boolean
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
      <Controller
        name={name}
        control={control}
        rules={{ required }}
        render={({ field }) => (
          <select
            {...field}
            id={name}
            className="w-full border p-2 rounded"
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
    </div>
  )
}
