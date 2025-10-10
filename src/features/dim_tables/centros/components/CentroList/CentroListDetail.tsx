import { Edit, Trash2 } from 'lucide-react'
import { Centro } from '@/shared/interfaces/dim_tables.types'
import { ListDetail, ListDetailAction } from '@/shared/components/organisms/ListDetail'
import { ReactNode } from 'react'

interface CentroListDetailProps {
  centro: Centro
  onEdit: (centro: Centro) => void
  onDelete: (centro: Centro) => void
  fieldSpans: number[]
}

/**
 * Componente específico para renderizar el detalle de un Centro
 * Wrapper sobre el componente genérico ListDetail
 */
export const CentroListDetail = ({
  centro,
  onEdit,
  onDelete,
  fieldSpans
}: CentroListDetailProps) => {
  // Definir los campos a renderizar
  const renderFields = (): ReactNode[] => [
    // Código
    <span key={centro.id} className="font-mono text-sm text-gray-600">
      {centro.codigo || '-'}
    </span>,
    // Descripción
    <span key={centro.id} className="text-gray-800">
      {centro.descripcion || '-'}
    </span>
  ]

  // Definir las acciones
  const actions: ListDetailAction[] = [
    {
      icon: <Edit className="w-4 h-4" />,
      onClick: () => onEdit(centro),
      title: 'Editar',
      className: 'p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors'
    },
    {
      icon: <Trash2 className="w-4 h-4" />,
      onClick: () => onDelete(centro),
      title: 'Eliminar',
      className: 'p-1 text-red-600 hover:bg-red-50 rounded transition-colors'
    }
  ]

  return (
    <ListDetail
      item={centro}
      fieldSpans={fieldSpans}
      renderFields={renderFields}
      actions={actions}
    />
  )
}
