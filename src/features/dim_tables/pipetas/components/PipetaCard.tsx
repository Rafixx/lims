import { useState } from 'react'
import { Pipeta } from '@/shared/interfaces/dim_tables.types'
import { Edit, Trash2 } from 'lucide-react'
import { IconButton } from '@/shared/components/molecules/IconButton'

interface Props {
  pipeta: Pipeta
  onEdit: (pipeta: Pipeta) => void
  onDelete: (pipeta: Pipeta) => void
}

export const PipetaCard = ({ pipeta, onEdit, onDelete }: Props) => {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="bg-white rounded-lg shadow-soft border border-surface-200 overflow-hidden">
      {/* Header modernizado en una sola línea */}
      <div className="px-4 py-3 flex items-center gap-4 w-full">
        <span className="text-xs text-surface-400 font-mono min-w-[80px]">
          {pipeta.codigo || 'Sin código'}
        </span>
        <span className="flex-1 truncate text-surface-800 text-sm">
          {pipeta.modelo || 'Sin modelo'}
        </span>
        {pipeta.zona && (
          <span className="text-xs text-surface-500 max-w-[150px] truncate">
            Zona: {pipeta.zona}
          </span>
        )}
        <div className="flex items-center gap-1 ml-2">
          <IconButton
            icon={<Edit className="w-4 h-4" />}
            title="Editar pipeta"
            onClick={() => onEdit(pipeta)}
            className="text-info-600 hover:text-info-800 transition-colors"
          />
          <IconButton
            icon={<Trash2 className="w-4 h-4" />}
            title="Eliminar pipeta"
            onClick={() => onDelete(pipeta)}
            className="text-danger-600 hover:text-danger-800 transition-colors"
          />
        </div>
      </div>
    </div>
  )
}
