import { Edit, Trash2 } from 'lucide-react'
import { TipoMuestra } from '@/shared/interfaces/dim_tables.types'
import { ListDetail, ListDetailAction } from '@/shared/components/organisms/ListDetail'
import { ReactNode } from 'react'

interface TipoMuestraListDetailProps {
  tipoMuestra: TipoMuestra
  onEdit: () => void
  onDelete: () => void
  fieldSpans: number[]
}

export const TipoMuestraListDetail = ({
  tipoMuestra,
  onEdit,
  onDelete,
  fieldSpans
}: TipoMuestraListDetailProps) => {
  const renderFields = (): ReactNode[] => [
    <span key={tipoMuestra.id} className="font-mono text-sm text-gray-600">
      {tipoMuestra.cod_tipo_muestra || 'Sin código'}
    </span>,
    <span key={tipoMuestra.id} className="text-sm text-gray-900">
      {tipoMuestra.tipo_muestra || 'Sin descripción'}
    </span>
  ]

  const actions: ListDetailAction[] = [
    {
      icon: <Edit className="w-4 h-4" />,
      title: 'Editar tipo de muestra',
      onClick: onEdit,
      className: 'text-blue-600 hover:text-blue-800'
    },
    {
      icon: <Trash2 className="w-4 h-4" />,
      title: 'Eliminar tipo de muestra',
      onClick: onDelete,
      className: 'text-red-600 hover:text-red-800'
    }
  ]

  return (
    <ListDetail
      item={tipoMuestra}
      fieldSpans={fieldSpans}
      renderFields={renderFields}
      actions={actions}
    />
  )
}
