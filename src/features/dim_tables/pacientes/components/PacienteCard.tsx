import { useState } from 'react'
import { Paciente } from '@/shared/interfaces/dim_tables.types'
// import { EstadoBadge } from '@/shared/states'
import { ChevronDown, ChevronUp, Edit, Trash2 } from 'lucide-react'
// import { formatDate } from '@/shared/utils/helpers'
import { IconButton } from '@/shared/components/molecules/IconButton'
// import { usePacientes } from '@/shared/hooks/useDim_tables'

interface Props {
  paciente: Paciente
  onEdit: (paciente: Paciente) => void
  onDelete: (paciente: Paciente) => void
}

export const PacienteCard = ({ paciente, onEdit, onDelete }: Props) => {
  const [expanded, setExpanded] = useState(false)
  const toggleExpanded = () => setExpanded(!expanded)

  return (
    <div className="bg-white rounded-lg shadow-soft border border-surface-200 overflow-hidden">
      {/* Header modernizado en una sola línea */}
      <div className="px-4 py-3 flex items-center gap-4 w-full">
        <span className="text-xs text-surface-400 font-mono min-w-[80px]">
          {paciente.sip ? `🪪 ${paciente.sip}` : 'Sin SIP'}
        </span>
        <span className="flex-1 truncate text-surface-800 text-sm">
          {/* <User className="inline w-4 h-4 mr-1 text-surface-400 align-text-bottom" /> */}
          {paciente.nombre || 'Sin nombre'}
        </span>
        {paciente.direccion && (
          <span className="flex-1 text-xs text-surface-500 max-w-[200px] truncate">
            {`📍 ${paciente.direccion}`}
          </span>
        )}
        <div className="flex items-center gap-1 ml-2">
          <IconButton
            icon={<Edit className="w-4 h-4" />}
            title="Editar paciente"
            onClick={() => onEdit(paciente)}
            className="text-info-600 hover:text-info-800 transition-colors"
          />
          <IconButton
            icon={<Trash2 className="w-4 h-4" />}
            title="Eliminar paciente"
            onClick={() => onDelete(paciente)}
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
          <div className="mt-2 space-y-1">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-surface-700">SIP:</span>
                <span className="text-surface-600 ml-2">{paciente.sip || 'No asignado'}</span>
              </div>
              <div>
                <span className="font-medium text-surface-700">Dirección:</span>
                <span className="text-surface-600 ml-2">{paciente.direccion || 'No especificada'}</span>
              </div>
            </div>
          </div>
        </div>
      )} */}
    </div>
  )
}
