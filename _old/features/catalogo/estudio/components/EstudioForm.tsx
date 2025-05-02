// src/features/catalogo/estudio/components/EstudioForm.tsx
import React from 'react'
import { FormBasic, FieldConfig } from '../../../../shared/components/molecules/FormBasic'
import { Estudio } from '../../../estudio/interfaces/estudio.interface'
import { useProcesos } from '../../../proceso/hooks/useProcesos'

// Si deseas integrar el campo dropdownWithAdd, debes extender el tipo Estudio.
// En este ejemplo agregamos la propiedad "dropdownField".
interface ExtendedEstudio extends Estudio {
  dropdownField: string
}

interface EstudioFormProps {
  initialData?: ExtendedEstudio
  onSubmit: (data: ExtendedEstudio) => void
}

export const EstudioForm: React.FC<EstudioFormProps> = ({ initialData, onSubmit }) => {
  // Si no hay datos iniciales, se asume que se está creando un nuevo estudio,
  // agregando también la propiedad dropdownField.
  const defaultValues: ExtendedEstudio = initialData || {
    id: '',
    nombre: '',
    estado: '', // Valor inicial para el select
    procesos: [], // Aquí se guardará el array de items ordenados
    dropdownField: ''
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
    },
    // Nuevo campo que utiliza DropdownWithAdd
    {
      name: 'dropdownField',
      label: 'Selecciona o agrega un item',
      type: 'dropdownWithAdd',
      dropdownOptions: [
        { label: 'Opción 1', value: 'op1' },
        { label: 'Opción 2', value: 'op2' }
      ],
      onDropdownAdd: newOption => {
        console.warn('Nueva opción agregada:', newOption)
        // Aquí podrías actualizar un estado o enviar la nueva opción a un API
      },
      dropdownFormFields: [
        { name: 'value', label: 'Valor', type: 'text', placeholder: 'Ingresa el valor' },
        { name: 'label', label: 'Etiqueta', type: 'text', placeholder: 'Ingresa la etiqueta' }
      ],
      dropdownFormDefaultValues: { value: '', label: '' }
    }
  ]

  return (
    <div>
      <FormBasic<ExtendedEstudio>
        defaultValues={defaultValues}
        fields={fields}
        onSubmit={onSubmit}
      />
    </div>
  )
}
