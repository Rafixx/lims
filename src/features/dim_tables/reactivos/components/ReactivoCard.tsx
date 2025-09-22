import { useState } from 'react'
import { Reactivo } from '@/shared/interfaces/dim_tables.types'
import { Edit, Trash2 } from 'lucide-react'
import { IconButton } from '@/shared/components/molecules/IconButton'

interface Props {
  reactivo: Reactivo
  onEdit: (reactivo: Reactivo) => void
  onDelete: (reactivo: Reactivo) => void
}

export const ReactivoCard = ({ reactivo, onEdit, onDelete }: Props) => {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="bg-white rounded-lg shadow-soft border border-surface-200 overflow-hidden">
      {/* Header modernizado en una sola línea */}
      <div className="px-4 py-3 flex items-center gap-4 w-full">
        <span className="text-xs text-surface-400 font-mono min-w-[80px]">
          {reactivo.num_referencia || 'Sin ref.'}
        </span>
        <span className="flex-1 truncate text-surface-800 text-sm">
          {reactivo.reactivo || 'Sin descripción'}
        </span>
        {reactivo.lote && (
          <span className="text-xs text-surface-500 max-w-[100px] truncate">
            Lote: {reactivo.lote}
          </span>
        )}
        {reactivo.volumen_formula && (
          <span className="text-xs text-surface-500 max-w-[150px] truncate">
            Vol: {reactivo.volumen_formula}
          </span>
        )}
        <div className="flex items-center gap-1 ml-2">
          <IconButton
            icon={<Edit className="w-4 h-4" />}
            title="Editar reactivo"
            onClick={() => onEdit(reactivo)}
            className="text-info-600 hover:text-info-800 transition-colors"
          />
          <IconButton
            icon={<Trash2 className="w-4 h-4" />}
            title="Eliminar reactivo"
            onClick={() => onDelete(reactivo)}
            className="text-danger-600 hover:text-danger-800 transition-colors"
          />
        </div>
      </div>
    </div>
  )
}
