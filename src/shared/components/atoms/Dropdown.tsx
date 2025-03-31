// src/shared/components/atoms/Dropdown.tsx
import React from 'react'

export interface DropdownOption {
  value: string
  label: string
}

export interface DropdownProps {
  id: string
  label: string
  options: DropdownOption[]
  value: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
}

export const Dropdown: React.FC<DropdownProps> = ({ id, label, options, value, onChange }) => {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={onChange}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
