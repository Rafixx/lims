import { Label } from '@/shared/components/atoms/Label'
import { Input } from '@/shared/components/molecules/Input'
import { Select } from '@/shared/components/molecules/Select'
import clsx from 'clsx'
import React from 'react'

type FormFieldInputTypes = 'input' | 'textarea' | 'select'

interface FormFieldProps {
  id: string
  label: string
  error?: string
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>
  textareaProps?: React.TextareaHTMLAttributes<HTMLTextAreaElement>
  selectProps?: React.SelectHTMLAttributes<HTMLSelectElement>
  type?: FormFieldInputTypes
  options?: Array<{ label: string; value: string | number }> // para <select>
  className?: string // clase para el campo (input, textarea, select)
  containerClassName?: string // clase para el wrapper
  required?: boolean
}

export const FormField = ({
  id,
  label,
  error,
  type = 'input',
  inputProps,
  textareaProps,
  selectProps,
  options = [],
  className,
  containerClassName,
  required = false
}: FormFieldProps) => {
  return (
    <div className={clsx('mb-4 px-2', containerClassName)}>
      <Label htmlFor={id}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>

      {type === 'input' && (
        <Input
          id={id}
          {...inputProps}
          required={required}
          className={clsx(inputProps?.className, className)}
        />
      )}

      {type === 'textarea' && (
        <textarea
          id={id}
          {...textareaProps}
          required={required}
          className={clsx('form-textarea', textareaProps?.className, className)}
        />
      )}

      {type === 'select' && (
        <Select
          id={id}
          {...selectProps}
          required={required}
          className={clsx('form-select', selectProps?.className, className)}
        >
          <option value="">Selecciona una opción</option>
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Select>
      )}

      {error && <p className="text-xs text-danger-600 mt-1">{error}</p>}
    </div>
  )
}
