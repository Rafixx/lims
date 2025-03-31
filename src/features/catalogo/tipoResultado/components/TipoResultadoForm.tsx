//src/features/catalogo/tipoResultado/components/TipoResultadoForm.tsx
import React from 'react'
import { FormBasic, FieldConfig } from '../../../../shared/components/molecules/FormBasic'
import {
  TipoResultado,
  TipoResultadoEnum
} from '../../../resultado/interfaces/tipoResultado.interface'

interface ResultadoFormProps {
  initialData?: TipoResultado
  onSubmit: (data: TipoResultado) => void
}

export const TipoResultadoForm: React.FC<ResultadoFormProps> = ({ initialData, onSubmit }) => {
  // Si no hay datos iniciales, se asume que se está creando un nuevo aparato
  const defaultValues: TipoResultado = initialData || {
    id: '',
    nombre: '',
    tipo: TipoResultadoEnum.NUMERO,
    unidad: '',
    decimales: 0,
    min: 0,
    max: 0
  }

  const fields: FieldConfig[] = [
    { name: 'id', label: 'ID', type: 'text', placeholder: 'Ingrese el ID' },
    { name: 'nombre', label: 'Nombre', type: 'text', placeholder: 'Ingrese el nombre' },
    { name: 'tipo', label: 'Tipo', type: 'text', placeholder: 'Ingrese el tipo' },
    { name: 'unidad', label: 'Unidad', type: 'text', placeholder: 'Ingrese la unidad' },
    { name: 'decimales', label: 'Decimales', type: 'number', placeholder: 'Ingrese los decimales' },
    { name: 'min', label: 'Mínimo', type: 'number', placeholder: 'Ingrese el mínimo' },
    { name: 'max', label: 'Máximo', type: 'number', placeholder: 'Ingrese el máximo' }
  ]

  return (
    <div>
      <FormBasic<TipoResultado> defaultValues={defaultValues} fields={fields} onSubmit={onSubmit} />
    </div>
  )
}
