import { Edit, Trash2 } from 'lucide-react'
import { Paciente } from '@/shared/interfaces/dim_tables.types'
import { ListDetail, ListDetailAction } from '@/shared/components/organisms/ListDetail'
import { ReactNode } from 'react'

interface PacienteListDetailProps {
  paciente: Paciente
  onEdit: () => void
  onDelete: () => void
  fieldSpans: number[]
}

export const PacienteListDetail = ({
  paciente,
  onEdit,
  onDelete,
  fieldSpans
}: PacienteListDetailProps) => {
  const renderFields = (): ReactNode[] => [
    <span key={paciente.id} className="font-medium text-gray-800">
      {paciente.nombre || '-'}
    </span>,
    <span key={paciente.id} className="font-mono text-sm text-gray-600">
      {paciente.sip || '-'}
    </span>,
    <span key={paciente.id} className="text-sm text-gray-700">
      {paciente.direccion || '-'}
    </span>
  ]

  const actions: ListDetailAction[] = [
    {
      icon: <Edit className="w-4 h-4" />,
      onClick: onEdit,
      title: 'Editar',
      className: 'p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors'
    },
    {
      icon: <Trash2 className="w-4 h-4" />,
      onClick: onDelete,
      title: 'Eliminar',
      className: 'p-1 text-red-600 hover:bg-red-50 rounded transition-colors'
    }
  ]

  return (
    <ListDetail
      item={paciente}
      fieldSpans={fieldSpans}
      renderFields={renderFields}
      actions={actions}
    />
  )
}
