//src/features/catalogo/tipoResultado/components/TipoResultadosTable.tsx
import React from 'react'
import { TipoResultado } from '../../../resultado/interfaces/tipoResultado.interface'
import { getTipoResultado } from '../../../resultado/services/resultado.service'
import { TipoResultadoForm } from './TipoResultadoForm'
import { ListBasic } from '../../../../shared/components/molecules/ListBasic'
import { Column } from '../../../../shared/components/molecules/TableBasic'

const tipoResultadoColumns: Column<TipoResultado>[] = [
  {
    header: 'Nombre',
    accessor: 'nombre' as keyof TipoResultado
  },
  {
    header: 'Tipo',
    accessor: 'tipo' as keyof TipoResultado
  },
  {
    header: 'Unidad',
    accessor: 'unidad' as keyof TipoResultado
  },
  {
    header: 'Decimales',
    accessor: 'decimales' as keyof TipoResultado
  },
  {
    header: 'Mínimo',
    accessor: 'min' as keyof TipoResultado
  },
  {
    header: 'Máximo',
    accessor: 'max' as keyof TipoResultado
  }
]

export const TiposResultadoTable: React.FC = () => {
  return (
    <ListBasic<TipoResultado>
      queryKey={['tiposResultado']}
      queryFn={getTipoResultado}
      columns={tipoResultadoColumns}
      FormComponent={TipoResultadoForm}
      mutationFn={(data: TipoResultado) => Promise.resolve(data)} // Aquí integrarías tu llamada a la API real
      title="Tipo de Resultado"
    />
  )
}
