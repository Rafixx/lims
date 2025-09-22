import { useState } from 'react'
import { Cliente } from '@/shared/interfaces/dim_tables.types'
import { Edit, Trash2 } from 'lucide-react'
import { IconButton } from '@/shared/components/molecules/IconButton'

interface Props {
  cliente: Cliente
  onEdit: (cliente: Cliente) => void
  onDelete: (cliente: Cliente) => void
}

export const ClienteCard = ({ cliente, onEdit, onDelete }: Props) => {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="bg-white rounded-lg shadow-soft border border-surface-200 overflow-hidden">
      {/* Header modernizado en una sola línea */}
      <div className="px-4 py-3 flex items-center gap-4 w-full">
        <span className="text-xs text-surface-400 font-mono min-w-[80px]">
          {cliente.nif || 'Sin NIF'}
        </span>
        <span className="flex-1 truncate text-surface-800 text-sm">
          {cliente.nombre || 'Sin nombre'}
        </span>
        {cliente.razon_social && (
          <span className="text-xs text-surface-500 max-w-[150px] truncate">
            {cliente.razon_social}
          </span>
        )}
        {cliente.direccion && (
          <span className="text-xs text-surface-500 max-w-[200px] truncate">
            {cliente.direccion}
          </span>
        )}
        <div className="flex items-center gap-1 ml-2">
          <IconButton
            icon={<Edit className="w-4 h-4" />}
            title="Editar cliente"
            onClick={() => onEdit(cliente)}
            className="text-info-600 hover:text-info-800 transition-colors"
          />
          <IconButton
            icon={<Trash2 className="w-4 h-4" />}
            title="Eliminar cliente"
            onClick={() => onDelete(cliente)}
            className="text-danger-600 hover:text-danger-800 transition-colors"
          />
        </div>
      </div>
    </div>
  )
}
