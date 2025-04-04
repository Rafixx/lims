import React from 'react'
import { ListBasic } from '../../../../shared/components/molecules/ListBasic'
import { getPipetas } from '../services/pipetas.service'
import { PipetaForm } from './PipetaForm'
import { Pipeta } from '../interfaces/pipeta.interface'
import { Column } from '../../../../shared/components/molecules/TableBasic'

const PipetaColumns: Column<Pipeta>[] = [
  { header: 'Id', accessor: 'id' as keyof Pipeta },
  { header: 'Zona', accessor: 'zona' as keyof Pipeta },
  { header: 'Código', accessor: 'codigo' as keyof Pipeta },
  { header: 'Modelo', accessor: 'modelo' as keyof Pipeta }
]
export const PipetaList: React.FC = () => {
  return (
    <ListBasic<Pipeta>
      queryKey={['pipetas']}
      queryFn={getPipetas}
      columns={PipetaColumns}
      FormComponent={PipetaForm}
      mutationFn={(data: Pipeta) => Promise.resolve(data)} // Aquí integrarías tu llamada a la API
      title="Pipeta"
    />
  )
}
// export interface Reactivo {
//   id: string
//   nombre: string
//   volumen: number
//   lote: string
// }
