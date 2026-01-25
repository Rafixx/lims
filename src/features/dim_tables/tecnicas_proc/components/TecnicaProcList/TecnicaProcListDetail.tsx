import { Edit, Trash2 } from 'lucide-react'
import { TecnicaProc } from '@/shared/interfaces/dim_tables.types'
import { ListDetail, ListDetailAction } from '@/shared/components/organisms/ListDetail'
import { ReactNode } from 'react'

interface TecnicaProcListDetailProps {
  tecnicaProc: TecnicaProc
  onEdit: () => void
  onDelete: () => void
  fieldSpans: number[]
}

export const TecnicaProcListDetail = ({
  tecnicaProc,
  onEdit,
  onDelete,
  fieldSpans
}: TecnicaProcListDetailProps) => {
  const renderFields = (): ReactNode[] => [
    <span key={`nombre-${tecnicaProc.id}`} className="text-sm text-gray-900">
      {tecnicaProc.tecnica_proc || 'Sin nombre'}
    </span>,
    <span key={`orden-${tecnicaProc.id}`} className="font-mono text-sm text-gray-600">
      {tecnicaProc.orden !== undefined && tecnicaProc.orden !== null
        ? tecnicaProc.orden
        : 'Sin orden'}
    </span>,
    <span key={`plantilla-${tecnicaProc.id}`} className="text-sm text-gray-600">
      {tecnicaProc.plantillaTecnica?.tecnica || 'Sin plantilla asociada'}
    </span>
  ]

  const actions: ListDetailAction[] = [
    {
      icon: <Edit className="w-4 h-4" />,
      title: 'Editar técnica',
      onClick: onEdit,
      className: 'text-blue-600 hover:text-blue-800'
    },
    {
      icon: <Trash2 className="w-4 h-4" />,
      title: 'Eliminar técnica',
      onClick: onDelete,
      className: 'text-red-600 hover:text-red-800'
    }
  ]

  return (
    <ListDetail
      item={tecnicaProc}
      fieldSpans={fieldSpans}
      renderFields={renderFields}
      actions={actions}
    />
  )
}
