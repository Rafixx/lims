// src/shared/components/atoms/Dropdown.tsx
import React from 'react'

export interface DropdownOption {
  value: string
  label: string
}

export interface DropdownProps {
  id: string
  label?: string
  className?: string
  options: DropdownOption[]
  value: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
}

export const Dropdown: React.FC<DropdownProps> = ({
  id,
  label,
  className,
  options,
  value,
  onChange
}) => {
  return (
    <div className={`flex flex-col ${className}`}>
      {label && (
        <label htmlFor={id} className="block mt-2 mb-1 text-sm font-medium text-gray-900">
          {label}
        </label>
      )}
      <select
        id={id}
        value={value}
        onChange={onChange}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-secondary focus:border-secondary block w-full p-2.5"
      >
        <option value=""></option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default Dropdown
