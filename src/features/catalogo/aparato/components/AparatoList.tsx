import React from 'react'
import { Aparato } from '../interfaces/aparato.interface'
import { getAparatos } from '../services/aparatos.service'
import { AparatoForm } from './AparatoForm'
import { ListBasic } from '../../../../shared/components/molecules/ListBasic'
import { Column } from '../../../../shared/components/molecules/TableBasic'

const aparatoColumns: Column<Aparato>[] = [
  { header: 'ID', accessor: 'id' as keyof Aparato },
  { header: 'Nombre', accessor: 'nombre' as keyof Aparato },
  { header: 'Tipo', accessor: 'tipo' as keyof Aparato }
]

export const AparatoList: React.FC = () => {
  return (
    <ListBasic<Aparato>
      queryKey={['aparatos']}
      queryFn={getAparatos}
      columns={aparatoColumns}
      FormComponent={AparatoForm}
      mutationFn={(data: Aparato) => Promise.resolve(data)} // Aquí integrarías tu llamada a la API
      title="Aparato"
    />
  )
}
