import { useState } from 'react'
import { Muestra } from '../interfaces/muestras.types'
import { IndicadorEstado } from '@/shared/components/atoms/IndicadorEstado'
import { Calendar, ChevronDown, ChevronUp, Edit, Trash2, User } from 'lucide-react'
import { formatDate } from '@/shared/utils/helpers'
import { IconButton } from '@/shared/components/molecules/IconButton'
import { useTecnicasByMuestra } from '../hooks/useMuestras'
import { TecnicaCard } from './TecnicaCard'

interface Props {
  muestra: Muestra
  onEdit: (muestra: Muestra) => void
  onDelete: (muestra: Muestra) => void
}

export const MuestraCard = ({ muestra, onEdit, onDelete }: Props) => {
  const { tecnicas } = useTecnicasByMuestra(muestra.id_muestra)
  const [expanded, setExpanded] = useState(false)
  const toggleExpanded = () => setExpanded(!expanded)

  return (
    <div className="bg-white rounded-lg shadow-soft border border-surface-200 overflow-hidden">
      {/* Header modernizado en una sola línea */}
      <div className="px-4 py-3 flex items-center gap-4 w-full">
        <span className="text-xs text-surface-400 font-mono min-w-[80px]">
          {muestra.codigo_externo || 'Sin código'}
        </span>
        <span className="flex-1 truncate text-surface-800 text-sm">
          <User className="inline w-4 h-4 mr-1 text-surface-400 align-text-bottom" />
          {muestra.solicitud?.cliente?.nombre || 'Sin cliente'}
        </span>
        <IndicadorEstado estado={muestra.estadoInfo} size="small" variant="badge" />
        <span className="text-xs text-surface-500 flex items-center gap-1 min-w-[120px]">
          <Calendar className="w-4 h-4 text-surface-300" />
          {formatDate(muestra.solicitud?.f_creacion) || 'Sin fecha'}
        </span>
        <div className="flex items-center gap-1 ml-2">
          <IconButton
            icon={<Edit className="w-4 h-4" />}
            title="Editar solicitud"
            onClick={() => onEdit(muestra)}
            className="text-info-600 hover:text-info-800 transition-colors"
          />
          <IconButton
            icon={<Trash2 className="w-4 h-4" />}
            title="Eliminar solicitud"
            onClick={() => onDelete(muestra)}
            className="text-danger-600 hover:text-danger-800 transition-colors"
          />
          <IconButton
            icon={
              expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
            }
            title={expanded ? 'Contraer' : 'Expandir'}
            onClick={toggleExpanded}
            className="text-surface-600 hover:text-surface-800 transition-colors"
          />
        </div>
      </div>

      {/* Contenido expandido */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-surface-200 bg-surface-50">
          {/* Muestras */}
          {muestra && (
            <div className="mt-2 space-y-1">
              {tecnicas && tecnicas.length > 0 ? (
                tecnicas.map((tecnica, index) => <TecnicaCard key={index} tecnica={tecnica} />)
              ) : (
                <p className="text-sm text-surface-600">
                  No hay técnicas asociadas a esta muestra.
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
