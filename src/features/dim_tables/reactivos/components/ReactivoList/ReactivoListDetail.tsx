import { Edit, Trash2 } from 'lucide-react'
import { Reactivo } from '@/shared/interfaces/dim_tables.types'
import { ListDetail, ListDetailAction } from '@/shared/components/organisms/ListDetail'
import { ReactNode } from 'react'

interface ReactivoListDetailProps {
  reactivo: Reactivo
  onEdit: () => void
  onDelete: () => void
  fieldSpans: number[]
}

export const ReactivoListDetail = ({
  reactivo,
  onEdit,
  onDelete,
  fieldSpans
}: ReactivoListDetailProps) => {
  const renderFields = (): ReactNode[] => [
    <span key={reactivo.id} className="font-mono text-sm text-gray-600">
      {reactivo.num_referencia || 'Sin ref.'}
    </span>,
    <span key={reactivo.id} className="text-sm text-gray-900">
      {reactivo.reactivo || 'Sin descripción'}
    </span>,
    <span key={reactivo.id} className="text-xs text-gray-500">
      {reactivo.lote || '-'}
    </span>,
    <span key={reactivo.id} className="text-xs text-gray-500">
      {reactivo.volumen_formula || '-'}
    </span>
  ]

  const actions: ListDetailAction[] = [
    {
      icon: <Edit className="w-4 h-4" />,
      title: 'Editar reactivo',
      onClick: onEdit,
      className: 'text-blue-600 hover:text-blue-800'
    },
    {
      icon: <Trash2 className="w-4 h-4" />,
      title: 'Eliminar reactivo',
      onClick: onDelete,
      className: 'text-red-600 hover:text-red-800'
    }
  ]

  return (
    <ListDetail
      item={reactivo}
      fieldSpans={fieldSpans}
      renderFields={renderFields}
      actions={actions}
    />
  )
}
