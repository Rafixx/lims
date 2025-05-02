// src/customComponents/atoms/FilterCheckbox.tsx
import React from 'react'

export interface FilterCheckboxProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  visible?: boolean
}

const FilterCheckbox: React.FC<FilterCheckboxProps> = ({
  label,
  checked,
  onChange,
  visible = true
}) => {
  if (!visible) return null
  return (
    <label className="flex items-center space-x-2 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        className="form-checkbox text-blue-500"
      />
      <span>{label}</span>
    </label>
  )
}

export default FilterCheckbox
