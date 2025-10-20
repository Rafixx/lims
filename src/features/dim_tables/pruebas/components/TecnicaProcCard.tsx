import { TecnicaProc } from '@/shared/interfaces/dim_tables.types'
// import { formatDate } from '@/shared/utils/helpers'
import { LayoutTemplate } from 'lucide-react'

interface TecnicaCardProps {
  tecnica: TecnicaProc
}

export const TecnicaProcCard = ({ tecnica }: TecnicaCardProps) => {
  return (
    <div className="flex items-center gap-4 border border-surface-200 rounded-lg px-4 py-1 shadow-soft bg-white hover:shadow-medium transition-all">
      <span className="text-xs text-surface-400 font-mono">
        {tecnica.orden}
        {/* #{formatDate(tecnica.fecha_estado)} */}
      </span>
      <span className="flex-1 font-medium truncate text-surface-800">
        {tecnica.tecnica_proc || 'Sin técnica'}
      </span>
      <span className="flex-1 text-sm font-light truncate text-surface-400">
        {tecnica.plantillaTecnica?.tecnica ? (
          <span className="flex items-center gap-1">
            <LayoutTemplate height={16} width={16} /> {tecnica.plantillaTecnica?.tecnica}
          </span>
        ) : (
          '' //'Sin plantilla técnica'
        )}
      </span>
    </div>
  )
}
