import { TipoMuestra } from '@/shared/interfaces/dim_tables.types'
import { Edit, Trash2 } from 'lucide-react'
import { IconButton } from '@/shared/components/molecules/IconButton'

interface Props {
  tipoMuestra: TipoMuestra
  onEdit: (tipoMuestra: TipoMuestra) => void
  onDelete: (tipoMuestra: TipoMuestra) => void
}

export const TipoMuestraCard = ({ tipoMuestra, onEdit, onDelete }: Props) => {
  return (
    <div className="bg-white rounded-lg shadow-soft border border-surface-200 overflow-hidden">
      {/* Header modernizado en una sola línea */}
      <div className="px-4 py-3 flex items-center gap-4 w-full">
        <span className="text-xs text-surface-400 font-mono min-w-[80px]">
          {tipoMuestra.cod_tipo_muestra || 'Sin código'}
        </span>
        <span className="flex-1 truncate text-surface-800 text-sm">
          {tipoMuestra.tipo_muestra || 'Sin descripción'}
        </span>
        <div className="flex items-center gap-1 ml-2">
          <IconButton
            icon={<Edit className="w-4 h-4" />}
            title="Editar tipo de muestra"
            onClick={() => onEdit(tipoMuestra)}
            className="text-info-600 hover:text-info-800 transition-colors"
          />
          <IconButton
            icon={<Trash2 className="w-4 h-4" />}
            title="Eliminar tipo de muestra"
            onClick={() => onDelete(tipoMuestra)}
            className="text-danger-600 hover:text-danger-800 transition-colors"
          />
        </div>
      </div>
    </div>
  )
}
