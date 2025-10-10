import { Edit, Trash2 } from 'lucide-react'
import { CriterioValidacion } from '@/shared/interfaces/dim_tables.types'
import { ListDetail, ListDetailAction } from '@/shared/components/organisms/ListDetail'
import { ReactNode } from 'react'

interface CriterioValidacionListDetailProps {
  criterio: CriterioValidacion
  onEdit: () => void
  onDelete: () => void
  fieldSpans: number[]
}

export const CriterioValidacionListDetail = ({
  criterio,
  onEdit,
  onDelete,
  fieldSpans
}: CriterioValidacionListDetailProps) => {
  const renderFields = (): ReactNode[] => [
    <span key={criterio.id} className="font-mono text-sm text-gray-600">
      {criterio.codigo || 'Sin código'}
    </span>,
    <span key={criterio.id} className="text-sm text-gray-900">
      {criterio.descripcion || 'Sin descripción'}
    </span>
  ]

  const actions: ListDetailAction[] = [
    {
      icon: <Edit className="w-4 h-4" />,
      title: 'Editar criterio',
      onClick: onEdit,
      className: 'text-blue-600 hover:text-blue-800'
    },
    {
      icon: <Trash2 className="w-4 h-4" />,
      title: 'Eliminar criterio',
      onClick: onDelete,
      className: 'text-red-600 hover:text-red-800'
    }
  ]

  return (
    <ListDetail
      item={criterio}
      fieldSpans={fieldSpans}
      renderFields={renderFields}
      actions={actions}
    />
  )
}
