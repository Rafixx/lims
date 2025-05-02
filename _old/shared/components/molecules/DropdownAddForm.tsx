import React, { useState } from 'react'
import Dropdown, { DropdownOption } from '../atoms/Dropdown'
import { Modal } from '../atoms/Modal'
import Button, { ButtonVariants } from '../atoms/Button'
import { FormBasic, FieldConfig } from './FormBasic'
import { FiPlus } from 'react-icons/fi'

// Define una interfaz con los campos que esperas recibir del formulario.
export interface FormValues {
  value: string
  label: string
}

export interface DropdownWithAddProps {
  id: string
  label?: string
  options: DropdownOption[]
  value: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  onAdd: (newOption: DropdownOption) => void
  formFields: FieldConfig[]
  formDefaultValues: FormValues
}

export const DropdownWithAdd: React.FC<DropdownWithAddProps> = ({
  id,
  label,
  options,
  value,
  onChange,
  onAdd,
  formFields,
  formDefaultValues
}) => {
  const [isModalOpen, setModalOpen] = useState(false)

  // Ahora data tiene el tipo FormValues, evitando el uso de any.
  const handleFormSubmit = (data: FormValues) => {
    const newOption: DropdownOption = { value: data.value, label: data.label }
    onAdd(newOption)
    setModalOpen(false)
  }

  return (
    <div>
      <div className="flex flex-col p-2">
        {label && (
          <label htmlFor={id} className="block mt-2 mb-1 text-sm font-medium text-gray-900">
            {label}
          </label>
        )}
        <div className="flex flex-row items-center">
          <Dropdown
            className="mr-2 w-44"
            id={id}
            options={options}
            value={value}
            onChange={onChange}
          />
          <Button onClick={() => setModalOpen(true)} variant={ButtonVariants.SECONDARY}>
            <FiPlus />
          </Button>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <FormBasic<FormValues>
          defaultValues={formDefaultValues}
          fields={formFields}
          onSubmit={handleFormSubmit}
        />
      </Modal>
    </div>
  )
}
