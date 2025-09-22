import { AppEstado, EstadoBadge } from '@/shared/states'
import { Tecnica } from '../interfaces/muestras.types'
import { formatDate } from '@/shared/utils/helpers'

interface TecnicaCardProps {
  tecnica: Tecnica
}

export const TecnicaCard = ({ tecnica }: TecnicaCardProps) => {
  return (
    <div className="flex items-center gap-4 border border-surface-200 rounded-lg px-4 py-1 shadow-soft bg-white hover:shadow-medium transition-all">
      <span className="text-xs text-surface-400 font-mono">
        #{formatDate(tecnica.fecha_estado)}
      </span>
      <span className="flex-1 font-medium truncate text-surface-800">
        {tecnica.tecnica_proc?.tecnica_proc || 'Sin técnica'}
      </span>
      {tecnica.worklist && (
        <span>
          📋
          <span
            className="text-xs bg-info-100 text-info-700 rounded ml-1 px-2 py-0.5 font-semibold"
            title="Worklist"
          >
            {tecnica.worklist.nombre}
          </span>
        </span>
      )}
      {tecnica.tecnico_resp && (
        <span
          className="text-xs text-surface-500 truncate max-w-[120px]"
          title={tecnica.tecnico_resp.nombre || ''}
        >
          👤 {tecnica.tecnico_resp.nombre}
        </span>
      )}
      <EstadoBadge estado={tecnica.estado as AppEstado} size="sm" />
    </div>
  )
}
