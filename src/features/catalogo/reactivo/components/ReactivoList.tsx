//src/features/catalogo/reactivo/components/ReactivoList.tsx
import React from 'react'
import { ListBasic } from '../../../../shared/components/molecules/ListBasic'
import { getReactivos } from '../services/reactivos.service'
import { ReactivoForm } from './ReactivoForm'
import { Reactivo } from '../interfaces/reactivo.interface'
import { Column } from '../../../../shared/components/molecules/TableBasic'

const ReactivoColumns: Column<Reactivo>[] = [
  { header: 'Id', accessor: 'id' as keyof Reactivo },
  { header: 'Nombre', accessor: 'nombre' as keyof Reactivo },
  { header: 'Volumen', accessor: 'volumen' as keyof Reactivo },
  { header: 'Lote', accessor: 'lote' as keyof Reactivo }
]
export const ReactivoList: React.FC = () => {
  return (
    <ListBasic<Reactivo>
      queryKey={['reactivos']}
      queryFn={getReactivos}
      columns={ReactivoColumns}
      FormComponent={ReactivoForm}
      mutationFn={(data: Reactivo) => Promise.resolve(data)} // Aquí integrarías tu llamada a la API
      title="Reactivo"
    />
  )
}
