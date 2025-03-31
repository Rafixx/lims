// src/features/aparato/components/AparatoForm.tsx
import React from 'react'
import { FormBasic, FieldConfig } from '../../../../shared/components/molecules/FormBasic'
import { Aparato } from '../interfaces/aparato.interface'

interface AparatoFormProps {
  initialData?: Aparato
  onSubmit: (data: Aparato) => void
}

export const AparatoForm: React.FC<AparatoFormProps> = ({ initialData, onSubmit }) => {
  // Si no hay datos iniciales, se asume que se está creando un nuevo aparato
  const defaultValues: Aparato = initialData || { id: '', nombre: '', tipo: '' }

  const fields: FieldConfig[] = [
    { name: 'id', label: 'ID', type: 'text', placeholder: 'Ingrese el ID' },
    { name: 'nombre', label: 'Nombre', type: 'text', placeholder: 'Ingrese el nombre' },
    { name: 'tipo', label: 'Tipo', type: 'text', placeholder: 'Ingrese el tipo' }
  ]

  return (
    <div>
      <FormBasic<Aparato> defaultValues={defaultValues} fields={fields} onSubmit={onSubmit} />
    </div>
  )
}
