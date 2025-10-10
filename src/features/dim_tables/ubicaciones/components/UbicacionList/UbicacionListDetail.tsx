import { Edit, Trash2 } from 'lucide-react'
import { Ubicacion } from '@/shared/interfaces/dim_tables.types'
import { ListDetail, ListDetailAction } from '@/shared/components/organisms/ListDetail'
import { ReactNode } from 'react'

interface UbicacionListDetailProps {
  ubicacion: Ubicacion
  onEdit: (ubicacion: Ubicacion) => void
  onDelete: (ubicacion: Ubicacion) => void
  fieldSpans: number[]
}

export const UbicacionListDetail = ({
  ubicacion,
  onEdit,
  onDelete,
  fieldSpans
}: UbicacionListDetailProps) => {
  const renderFields = (): ReactNode[] => [
    <span key={ubicacion.id} className="font-mono text-sm text-gray-600">
      {ubicacion.codigo || '-'}
    </span>,
    <span key={ubicacion.id} className="text-gray-800">
      {ubicacion.ubicacion || '-'}
    </span>
  ]

  const actions: ListDetailAction[] = [
    {
      icon: <Edit className="w-4 h-4" />,
      onClick: () => onEdit(ubicacion),
      title: 'Editar',
      className: 'p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors'
    },
    {
      icon: <Trash2 className="w-4 h-4" />,
      onClick: () => onDelete(ubicacion),
      title: 'Eliminar',
      className: 'p-1 text-red-600 hover:bg-red-50 rounded transition-colors'
    }
  ]

  return (
    <ListDetail
      item={ubicacion}
      fieldSpans={fieldSpans}
      renderFields={renderFields}
      actions={actions}
    />
  )
}
