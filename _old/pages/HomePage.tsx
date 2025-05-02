// src/pages/HomePage.tsx
import { useState } from 'react'
import { DropdownWithAdd } from '../shared/components/molecules/DropdownAddForm'
import { FieldConfig } from '../shared/components/molecules/FormBasic'
import { DropdownOption } from '../shared/components/atoms/Dropdown'

const HomePage: React.FC = () => {
  const [selectedValue, setSelectedValue] = useState<string>('')
  const [options, setOptions] = useState<DropdownOption[]>([
    { value: 'op1', label: 'Opción 1' },
    { value: 'op2', label: 'Opción 2' }
  ])

  const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedValue(e.target.value)
  }

  const handleAddOption = (newOption: DropdownOption) => {
    setOptions(prevOptions => [...prevOptions, newOption])
  }

  const formFields: FieldConfig[] = [
    {
      name: 'value',
      label: 'Valor',
      type: 'text',
      placeholder: 'Ingresa el valor'
    },
    {
      name: 'label',
      label: 'Etiqueta',
      type: 'text',
      placeholder: 'Ingresa la etiqueta'
    }
  ]

  const formDefaultValues = {
    value: '',
    label: ''
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Bienvenido a LIMS</h1>
      <p className="mb-6 text-gray-700">
        Este es el sistema de gestión de información de laboratorio. Aquí podrás gestionar muestras,
        consultar resultados y más.
      </p>
      <div className="max-w-lg mx-auto p-4">
        <h1>Ejemplo de uso de DropdownWithAdd</h1>
        <DropdownWithAdd
          id="example-dropdown"
          label="Selecciona una opción"
          options={options}
          value={selectedValue}
          onChange={handleDropdownChange}
          onAdd={handleAddOption}
          formFields={formFields}
          formDefaultValues={formDefaultValues}
        />
      </div>
    </div>
  )
}

export default HomePage
