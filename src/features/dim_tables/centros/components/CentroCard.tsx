import { useState } from 'react'
import { Centro } from '@/shared/interfaces/dim_tables.types'
// import { EstadoBadge } from '@/shared/states'
import { ChevronDown, ChevronUp, Edit, Trash2 } from 'lucide-react'
// import { formatDate } from '@/shared/utils/helpers'
import { IconButton } from '@/shared/components/molecules/IconButton'
// import { useCentros } from '@/shared/hooks/useDim_tables'

interface Props {
  centro: Centro
  onEdit: (centro: Centro) => void
  onDelete: (centro: Centro) => void
}

export const CentroCard = ({ centro, onEdit, onDelete }: Props) => {
  const [expanded, setExpanded] = useState(false)
  const toggleExpanded = () => setExpanded(!expanded)

  return (
    <div className="bg-white rounded-lg shadow-soft border border-surface-200 overflow-hidden">
      {/* Header modernizado en una sola línea */}
      <div className="px-4 py-3 flex items-center gap-4 w-full">
        <span className="text-xs text-surface-400 font-mono min-w-[80px]">
          {centro.codigo || 'Sin código'}
        </span>
        <span className="flex-1 truncate text-surface-800 text-sm">
          {/* <User className="inline w-4 h-4 mr-1 text-surface-400 align-text-bottom" /> */}
          {centro.descripcion || 'Sin descripción'}
        </span>
        {/* <span className="text-xs text-surface-500 flex items-center gap-1 min-w-[120px]">
          <Calendar className="w-4 h-4 text-surface-300" />
          {formatDate(muestra.solicitud?.f_creacion) || 'Sin fecha'}
        </span> */}
        <div className="flex items-center gap-1 ml-2">
          <IconButton
            icon={<Edit className="w-4 h-4" />}
            title="Editar solicitud"
            onClick={() => onEdit(centro)}
            className="text-info-600 hover:text-info-800 transition-colors"
          />
          <IconButton
            icon={<Trash2 className="w-4 h-4" />}
            title="Eliminar solicitud"
            onClick={() => onDelete(centro)}
            className="text-danger-600 hover:text-danger-800 transition-colors"
          />
          {/* <IconButton
            icon={
              expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
            }
            title={expanded ? 'Contraer' : 'Expandir'}
            onClick={toggleExpanded}
            className="text-surface-600 hover:text-surface-800 transition-colors"
          /> */}
        </div>
      </div>

      {/* Contenido expandido */}
      {/* {expanded && (
        <div className="px-4 pb-4 border-t border-surface-200 bg-surface-50">
          {prueba && (
            <div className="mt-2 space-y-1">
              {tecnicas && tecnicas.length > 0 ? (
                tecnicas.map((tecnica, index) => <TecnicaProcCard key={index} tecnica={tecnica} />)
              ) : (
                <p className="text-sm text-surface-600">
                  No hay técnicas asociadas a esta muestra.
                </p>
              )}
            </div>
          )}
        </div>
      )} */}
    </div>
  )
}
