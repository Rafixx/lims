// src/shared/components/molecules/QuantityInput.tsx

import { useState, useEffect } from 'react'
import { Minus, Plus } from 'lucide-react'

export type QuantityInputProps = {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  label?: string
  className?: string
}

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n))

const stepBtnBase =
  'flex items-center justify-center px-3 h-9 text-surface-400 ' +
  'hover:text-surface-700 hover:bg-surface-50 active:bg-surface-100 ' +
  'transition-colors select-none disabled:opacity-30 disabled:cursor-not-allowed'

export const QuantityInput = ({
  value,
  onChange,
  min = 1,
  max = 9999,
  label,
  className = ''
}: QuantityInputProps) => {
  // Estado interno para permitir edición libre (incluido campo vacío)
  const [inputValue, setInputValue] = useState(String(value))

  // Sincronizar estado interno cuando el prop value cambia externamente
  useEffect(() => {
    setInputValue(String(value))
  }, [value])

  const handleDecrement = () => {
    const newValue = clamp(value - 1, min, max)
    onChange(newValue)
    setInputValue(String(newValue))
  }

  const handleIncrement = () => {
    const newValue = clamp(value + 1, min, max)
    onChange(newValue)
    setInputValue(String(newValue))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '') // Solo dígitos

    // Permitir campo vacío temporalmente
    setInputValue(raw)

    // Si hay un valor válido, actualizarlo
    if (raw !== '') {
      const numValue = parseInt(raw, 10)
      if (!isNaN(numValue)) {
        onChange(clamp(numValue, min, max))
      }
    }
  }

  const handleBlur = () => {
    // Al perder el foco, si el campo está vacío, restaurar al mínimo
    if (inputValue === '' || inputValue === '0') {
      onChange(min)
      setInputValue(String(min))
    } else {
      // Asegurar que el valor mostrado coincide con el valor real
      setInputValue(String(value))
    }
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {label ? (
        <span className="text-xs text-surface-500 font-medium uppercase tracking-wide">
          {label}
        </span>
      ) : null}
      <div className="flex items-center h-9 rounded-lg border border-surface-200 shadow-soft bg-white overflow-hidden">
        <button
          type="button"
          aria-label="Disminuir cantidad"
          onClick={handleDecrement}
          disabled={value <= min}
          className={`${stepBtnBase} border-r border-surface-200`}
        >
          <Minus className="w-3.5 h-3.5" strokeWidth={2.5} />
        </button>
        <input
          type="text"
          inputMode="numeric"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          aria-label={label ?? 'Cantidad'}
          className="w-16 h-9 text-center text-sm font-semibold text-surface-800 bg-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-400 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          maxLength={4}
        />
        <button
          type="button"
          aria-label="Aumentar cantidad"
          onClick={handleIncrement}
          disabled={value >= max}
          className={`${stepBtnBase} border-l border-surface-200`}
        >
          <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
        </button>
      </div>
    </div>
  )
}
