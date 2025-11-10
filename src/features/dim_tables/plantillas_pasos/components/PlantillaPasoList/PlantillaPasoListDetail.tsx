import { Edit, Trash2 } from 'lucide-react'
import { PlantillaPasos } from '@/shared/interfaces/dim_tables.types'
import { ListDetail, ListDetailAction } from '@/shared/components/organisms/ListDetail'
import { ReactNode } from 'react'

interface PlantillaPasoListDetailProps {
  paso: PlantillaPasos
  onEdit: () => void
  onDelete: () => void
  fieldSpans: number[]
}

export const PlantillaPasoListDetail = ({
  paso,
  onEdit,
  onDelete,
  fieldSpans
}: PlantillaPasoListDetailProps): ReactNode => {
  const renderFields = () => [
    <span key={`orden-${paso.id}`} className="font-semibold text-sm text-gray-900">
      {paso.orden ?? '-'}
    </span>,
    <span key={`codigo-${paso.id}`} className="font-mono text-sm text-gray-600">
      {paso.codigo || 'Sin código'}
    </span>,
    <span key={`descripcion-${paso.id}`} className="text-sm text-gray-900">
      {paso.descripcion || 'Sin descripción'}
    </span>
  ]

  const actions: ListDetailAction[] = [
    {
      icon: <Edit className="w-4 h-4" />,
      title: 'Editar paso',
      onClick: onEdit,
      className: 'text-blue-600 hover:text-blue-800'
    },
    {
      icon: <Trash2 className="w-4 h-4" />,
      title: 'Eliminar paso',
      onClick: onDelete,
      className: 'text-red-600 hover:text-red-800'
    }
  ]

  return (
    <ListDetail item={paso} fieldSpans={fieldSpans} renderFields={renderFields} actions={actions} />
  )
}
