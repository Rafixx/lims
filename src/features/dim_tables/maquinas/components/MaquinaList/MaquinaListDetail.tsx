import { Edit, Trash2 } from 'lucide-react'
import { Maquina } from '@/shared/interfaces/dim_tables.types'
import { ListDetail, ListDetailAction } from '@/shared/components/organisms/ListDetail'
import { ReactNode } from 'react'

interface MaquinaListDetailProps {
  maquina: Maquina
  onEdit: () => void
  onDelete: () => void
  fieldSpans: number[]
}

export const MaquinaListDetail = ({
  maquina,
  onEdit,
  onDelete,
  fieldSpans
}: MaquinaListDetailProps) => {
  const renderFields = (): ReactNode[] => [
    <span key={maquina.id} className="font-mono text-sm text-gray-600">
      {maquina.codigo || 'Sin código'}
    </span>,
    <span key={maquina.id} className="text-sm text-gray-900">
      {maquina.maquina || 'Sin descripción'}
    </span>,
    <span key={maquina.id} className="text-xs text-gray-500">
      {maquina.perfil_termico || '-'}
    </span>
  ]

  const actions: ListDetailAction[] = [
    {
      icon: <Edit className="w-4 h-4" />,
      title: 'Editar máquina',
      onClick: onEdit,
      className: 'text-blue-600 hover:text-blue-800'
    },
    {
      icon: <Trash2 className="w-4 h-4" />,
      title: 'Eliminar máquina',
      onClick: onDelete,
      className: 'text-red-600 hover:text-red-800'
    }
  ]

  return (
    <ListDetail
      item={maquina}
      fieldSpans={fieldSpans}
      renderFields={renderFields}
      actions={actions}
    />
  )
}
