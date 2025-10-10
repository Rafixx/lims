import { Edit, Trash2 } from 'lucide-react'
import { Pipeta } from '@/shared/interfaces/dim_tables.types'
import { ListDetail, ListDetailAction } from '@/shared/components/organisms/ListDetail'
import { ReactNode } from 'react'

interface PipetaListDetailProps {
  pipeta: Pipeta
  onEdit: () => void
  onDelete: () => void
  fieldSpans: number[]
}

export const PipetaListDetail = ({
  pipeta,
  onEdit,
  onDelete,
  fieldSpans
}: PipetaListDetailProps): ReactNode => {
  const renderFields = () => [
    <span key={pipeta.id} className="font-mono text-sm text-gray-600">
      {pipeta.codigo || 'Sin código'}
    </span>,
    <span key={pipeta.id} className="text-sm text-gray-900">
      {pipeta.modelo || 'Sin modelo'}
    </span>,
    <span key={pipeta.id} className="text-xs text-gray-500">
      {pipeta.zona || '-'}
    </span>
  ]

  const actions: ListDetailAction[] = [
    {
      icon: <Edit className="w-4 h-4" />,
      title: 'Editar pipeta',
      onClick: onEdit,
      className: 'text-blue-600 hover:text-blue-800'
    },
    {
      icon: <Trash2 className="w-4 h-4" />,
      title: 'Eliminar pipeta',
      onClick: onDelete,
      className: 'text-red-600 hover:text-red-800'
    }
  ]

  return (
    <ListDetail
      item={pipeta}
      fieldSpans={fieldSpans}
      renderFields={renderFields}
      actions={actions}
    />
  )
}
