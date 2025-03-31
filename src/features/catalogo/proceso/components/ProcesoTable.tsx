//src/features/catalogo/proceso/components/ProcesoTable.tsx
import React from 'react'
import { Proceso } from '../../../proceso/interfaces/proceso.interface'
import { getProcesos } from '../../../proceso/services/procesos.services'
import { ProcesoForm } from './ProcesoForm'
import { ListBasic } from '../../../../shared/components/molecules/ListBasic'
import { Column } from '../../../../shared/components/molecules/TableBasic'

const procesoColumns: Column<Proceso>[] = [
  {
    header: 'ID',
    accessor: 'id' as keyof Proceso
  },
  {
    header: 'Nombre',
    accessor: 'nombre' as keyof Proceso
  },
  {
    header: 'Producto',
    accessor: 'productoId' as keyof Proceso
  },
  {
    header: 'Aparato',
    accessor: 'aparatoId' as keyof Proceso
  },
  {
    header: 'Resultados',
    cell: (row: Proceso) => (
      <div className="flex flex-wrap gap-1">
        {row.resultados.map(resultado => (
          <span className="px-2 mx-1 border border-secondary rounded-xl" key={resultado.id}>
            {resultado.nombre}
          </span>
        ))}
      </div>
    )
  }
]

export const ProcesoTable: React.FC = () => {
  return (
    <ListBasic<Proceso>
      queryKey={['procesos']}
      queryFn={getProcesos}
      columns={procesoColumns}
      FormComponent={ProcesoForm}
      mutationFn={(data: Proceso) => Promise.resolve(data)} // Aquí integrarías tu llamada a la API real
      title="Proceso"
    />
  )
}
