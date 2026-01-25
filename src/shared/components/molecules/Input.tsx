import clsx from 'clsx'
import { useState, useEffect } from 'react'

export const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => {
  const { className, type, value, onFocus, onChange, ...restProps } = props
  const [localValue, setLocalValue] = useState(value)

  // Sincronizar con el valor externo
  useEffect(() => {
    setLocalValue(value)
  }, [value])

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    // Si es un campo de fecha/hora y está vacío, auto-completar con la fecha/hora actual
    if ((type === 'date' || type === 'datetime-local') && !localValue) {
      const now = new Date()
      let defaultValue: string

      if (type === 'date') {
        // Formato: YYYY-MM-DD
        defaultValue = now.toISOString().split('T')[0]
      } else {
        // Formato: YYYY-MM-DDTHH:MM
        const year = now.getFullYear()
        const month = String(now.getMonth() + 1).padStart(2, '0')
        const day = String(now.getDate()).padStart(2, '0')
        const hours = String(now.getHours()).padStart(2, '0')
        const minutes = String(now.getMinutes()).padStart(2, '0')
        defaultValue = `${year}-${month}-${day}T${hours}:${minutes}`
      }

      setLocalValue(defaultValue)

      // Disparar el evento onChange si existe
      if (onChange) {
        const syntheticEvent = {
          ...e,
          target: { ...e.target, value: defaultValue }
        } as React.ChangeEvent<HTMLInputElement>
        onChange(syntheticEvent)
      }
    }

    // Llamar al onFocus original si existe
    if (onFocus) {
      onFocus(e)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value)
    if (onChange) {
      onChange(e)
    }
  }

  const baseInputClass =
    'w-full px-3 py-2 border border-surface-300 rounded-lg bg-white text-sm text-surface-800 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-surface-50 disabled:text-surface-500 disabled:cursor-not-allowed transition-colors duration-200'

  return (
    <input
      {...restProps}
      type={type}
      value={localValue}
      onChange={handleChange}
      onFocus={handleFocus}
      className={clsx(baseInputClass, className)}
    />
  )
}
