// src/features/catalogo/estudio/components/EstudioForm.tsx
import React from 'react'
import { FormBasic, FieldConfig } from '../../../../shared/components/molecules/FormBasic'
import { Estudio } from '../../../estudio/interfaces/estudio.interface'
import { useProcesos } from '../../../proceso/hooks/useProcesos'

// const elementosDisponibles = [
//   { label: 'Elemento 1', value: 'elemento1' },
//   { label: 'Elemento 2', value: 'elemento2' },
//   { label: 'Elemento 3', value: 'elemento3' },
//   { label: 'Elemento 4', value: 'elemento4' }
// ]

interface EstudioFormProps {
  initialData?: Estudio
  onSubmit: (data: Estudio) => void
}

export const EstudioForm: React.FC<EstudioFormProps> = ({ initialData, onSubmit }) => {
  // Si no hay datos iniciales, se asume que se está creando un nuevo estudio
  const defaultValues: Estudio = initialData || {
    id: '',
    nombre: '',
    estado: '', // Valor inicial para el select
    procesos: [] // Aquí se guardará el array de items ordenados
  }
  const { data: procesos } = useProcesos()

  const fields: FieldConfig[] = [
    { name: 'id', label: 'ID', type: 'text', placeholder: 'Ingrese el ID' },
    { name: 'nombre', label: 'Nombre', type: 'text', placeholder: 'Ingrese el nombre' },
    {
      name: 'estado',
      label: 'Estado',
      type: 'select',
      options: [
        { label: 'Pendiente', value: 'pendiente' },
        { label: 'En Proceso', value: 'en_proceso' },
        { label: 'Finalizado', value: 'finalizado' }
      ]
    },
    {
      name: 'procesos',
      label: 'Procesos',
      type: 'sortable',
      options:
        procesos?.map(proceso => ({
          label: proceso.nombre,
          value: proceso.procesoId
        })) || []
    }
  ]

  return (
    <div>
      <FormBasic<Estudio> defaultValues={defaultValues} fields={fields} onSubmit={onSubmit} />
    </div>
  )
}
