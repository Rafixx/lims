//src/features/catalogo/estudio/components/EstudioForm.tsx
import React from 'react'
import { Estudio } from '../../../estudio/interfaces/estudio.interface'
import { getEstudios } from '../../../estudio/services/estudios.service'
import { EstudioForm } from './EstudioForm'
import { ListBasic } from '../../../../shared/components/molecules/ListBasic'
import { Column } from '../../../../shared/components/molecules/TableBasic'

const estudioColumns: Column<Estudio>[] = [
  {
    header: 'Id',
    accessor: 'estudioId' as keyof Estudio
  },
  {
    header: 'Nombre',
    accessor: 'nombre' as keyof Estudio
  },
  {
    header: 'Estado',
    accessor: 'estado' as keyof Estudio
  },
  {
    header: 'Procesos',
    // Usamos "cell" para renderizar el array de procesos
    cell: (row: Estudio) => (
      <div className="flex flex-wrap gap-1">
        {row.procesos.map(proceso => (
          // <Tag key={proceso.id}>{proceso.nombre}</Tag>
          <span className="px-2 border border-secondary rounded-xl" key={proceso.procesoId}>
            {proceso.nombre}
          </span>
        ))}
      </div>
    )
  }
]

export const EstudioTable: React.FC = () => {
  return (
    <ListBasic<Estudio>
      queryKey={['estudios']}
      queryFn={getEstudios}
      columns={estudioColumns}
      FormComponent={EstudioForm}
      mutationFn={(data: Estudio) => Promise.resolve(data)} // Aquí integrarías tu llamada a la API
      title="Estudio"
    />
  )
}
