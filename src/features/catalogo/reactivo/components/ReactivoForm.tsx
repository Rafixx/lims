//src/features/catalogo/reactivo/components/ReactivoForm.tsx
import React from 'react'
import { FormBasic, FieldConfig } from '../../../../shared/components/molecules/FormBasic'
import { Reactivo } from '../interfaces/reactivo.interface'

interface ReactivoFormProps {
  initialData?: Reactivo
  onSubmit: (data: Reactivo) => void
}

export const ReactivoForm: React.FC<ReactivoFormProps> = ({ initialData, onSubmit }) => {
  // Si no hay datos iniciales, se asume que se está creando una nueva Reactivo
  const defaultValues: Reactivo = initialData || {
    id: '',
    nombre: '',
    volumen: 0,
    lote: ''
  }

  const fields: FieldConfig[] = [
    { name: 'id', label: 'Id', type: 'text', placeholder: 'Ingrese el ID' },
    { name: 'nombre', label: 'Nombre', type: 'text', placeholder: 'Ingrese el nombre' },
    { name: 'volumen', label: 'Volumen', type: 'text', placeholder: 'Ingrese el volumen' },
    { name: 'lote', label: 'Lote', type: 'text', placeholder: 'Ingrese el lote' }
  ]

  return (
    <div>
      <FormBasic<Reactivo> defaultValues={defaultValues} fields={fields} onSubmit={onSubmit} />
    </div>
  )
}
