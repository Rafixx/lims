//src/features/catalogo/pipeta/components/PipetaForm.tsx
import React from 'react'
import { FormBasic, FieldConfig } from '../../../../shared/components/molecules/FormBasic'
import { Pipeta } from '../interfaces/pipeta.interface'

interface PipetaFormProps {
  initialData?: Pipeta
  onSubmit: (data: Pipeta) => void
}

export const PipetaForm: React.FC<PipetaFormProps> = ({ initialData, onSubmit }) => {
  // Si no hay datos iniciales, se asume que se está creando una nueva pipeta
  const defaultValues: Pipeta = initialData || {
    id: '',
    zona: '',
    codigo: '',
    modelo: ''
  }

  const fields: FieldConfig[] = [
    { name: 'id', label: 'Id', type: 'text', placeholder: 'Ingrese el ID' },
    { name: 'zona', label: 'Zona', type: 'text', placeholder: 'Ingrese la zona' },
    { name: 'codigo', label: 'Código', type: 'text', placeholder: 'Ingrese el código' },
    { name: 'modelo', label: 'Modelo', type: 'text', placeholder: 'Ingrese el modelo' }
  ]

  return (
    <div>
      <FormBasic<Pipeta> defaultValues={defaultValues} fields={fields} onSubmit={onSubmit} />
    </div>
  )
}
