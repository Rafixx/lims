import { Edit, Trash2 } from 'lucide-react'
import { Cliente } from '@/shared/interfaces/dim_tables.types'
import { ListDetail, ListDetailAction } from '@/shared/components/organisms/ListDetail'
import { ReactNode } from 'react'

interface ClienteListDetailProps {
  cliente: Cliente
  onEdit: (cliente: Cliente) => void
  onDelete: (cliente: Cliente) => void
  fieldSpans: number[]
}

export const ClienteListDetail = ({
  cliente,
  onEdit,
  onDelete,
  fieldSpans
}: ClienteListDetailProps) => {
  const renderFields = (): ReactNode[] => [
    <span key={cliente.id} className="font-medium text-gray-800">
      {cliente.nombre || '-'}
    </span>,
    <span key={cliente.id} className="text-gray-700">
      {cliente.razon_social || '-'}
    </span>,
    <span key={cliente.id} className="font-mono text-sm text-gray-600">
      {cliente.nif || '-'}
    </span>,
    <span key={cliente.id} className="text-sm text-gray-600">
      {cliente.direccion || '-'}
    </span>
  ]

  const actions: ListDetailAction[] = [
    {
      icon: <Edit className="w-4 h-4" />,
      onClick: () => onEdit(cliente),
      title: 'Editar',
      className: 'p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors'
    },
    {
      icon: <Trash2 className="w-4 h-4" />,
      onClick: () => onDelete(cliente),
      title: 'Eliminar',
      className: 'p-1 text-red-600 hover:bg-red-50 rounded transition-colors'
    }
  ]

  return (
    <ListDetail
      item={cliente}
      fieldSpans={fieldSpans}
      renderFields={renderFields}
      actions={actions}
    />
  )
}
