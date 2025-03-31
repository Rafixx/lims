//src/features/catalogo/proceso/components/ProcesoForm.tsx
import React from 'react'
import { FormBasic, FieldConfig } from '../../../../shared/components/molecules/FormBasic'
import { Proceso } from '../../../proceso/interfaces/proceso.interface'
import { useTiposResultado } from '../../../resultado/hooks/useTiposResultado'

interface ProcesoFormProps {
  initialData?: Proceso
  onSubmit: (data: Proceso) => void
}

export const ProcesoForm: React.FC<ProcesoFormProps> = ({ initialData, onSubmit }) => {
  // Si no hay datos iniciales, se asume que se está creando un nuevo proceso
  const defaultValues: Proceso = initialData || {
    procesoId: '',
    nombre: '',
    estado: '',
    resultados: []
  }

  const { data: tiposResultado } = useTiposResultado()

  const fields: FieldConfig[] = [
    { name: 'procesoId', label: 'ID', type: 'text', placeholder: 'Ingrese el ID' },
    { name: 'nombre', label: 'Nombre', type: 'text', placeholder: 'Ingrese el nombre' },
    {
      name: 'estado',
      label: 'Estado',
      type: 'text',
      placeholder: 'Estado del proceso'
    },
    {
      name: 'resultados',
      label: 'Tipos de resultados',
      type: 'sortable',
      options:
        tiposResultado?.map(resultado => ({
          label: resultado.nombre,
          value: resultado.id,
          allowDuplicates: true
        })) || []
    }
  ]

  return (
    <div>
      <FormBasic<Proceso> defaultValues={defaultValues} fields={fields} onSubmit={onSubmit} />
    </div>
  )
}
