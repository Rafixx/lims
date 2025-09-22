import { useState } from 'react'
import { Ubicacion } from '@/shared/interfaces/dim_tables.types'
import { Edit, Trash2 } from 'lucide-react'
import { IconButton } from '@/shared/components/molecules/IconButton'

interface Props {
  ubicacion: Ubicacion
  onEdit: (ubicacion: Ubicacion) => void
  onDelete: (ubicacion: Ubicacion) => void
}

export const UbicacionCard = ({ ubicacion, onEdit, onDelete }: Props) => {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="bg-white rounded-lg shadow-soft border border-surface-200 overflow-hidden">
      {/* Header modernizado en una sola línea */}
      <div className="px-4 py-3 flex items-center gap-4 w-full">
        <span className="text-xs text-surface-400 font-mono min-w-[80px]">
          {ubicacion.codigo || 'Sin código'}
        </span>
        <span className="flex-1 truncate text-surface-800 text-sm">
          {ubicacion.ubicacion || 'Sin descripción'}
        </span>
        <div className="flex items-center gap-1 ml-2">
          <IconButton
            icon={<Edit className="w-4 h-4" />}
            title="Editar ubicación"
            onClick={() => onEdit(ubicacion)}
            className="text-info-600 hover:text-info-800 transition-colors"
          />
          <IconButton
            icon={<Trash2 className="w-4 h-4" />}
            title="Eliminar ubicación"
            onClick={() => onDelete(ubicacion)}
            className="text-danger-600 hover:text-danger-800 transition-colors"
          />
        </div>
      </div>
    </div>
  )
}
