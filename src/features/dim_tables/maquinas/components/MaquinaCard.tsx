import { useState } from 'react'
import { Maquina } from '@/shared/interfaces/dim_tables.types'
import { Edit, Trash2 } from 'lucide-react'
import { IconButton } from '@/shared/components/molecules/IconButton'

interface Props {
  maquina: Maquina
  onEdit: (maquina: Maquina) => void
  onDelete: (maquina: Maquina) => void
}

export const MaquinaCard = ({ maquina, onEdit, onDelete }: Props) => {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="bg-white rounded-lg shadow-soft border border-surface-200 overflow-hidden">
      {/* Header modernizado en una sola línea */}
      <div className="px-4 py-3 flex items-center gap-4 w-full">
        <span className="text-xs text-surface-400 font-mono min-w-[80px]">
          {maquina.codigo || 'Sin código'}
        </span>
        <span className="flex-1 truncate text-surface-800 text-sm">
          {maquina.maquina || 'Sin descripción'}
        </span>
        {maquina.perfil_termico && (
          <span className="text-xs text-surface-500 max-w-[200px] truncate">
            Perfil: {maquina.perfil_termico}
          </span>
        )}
        <div className="flex items-center gap-1 ml-2">
          <IconButton
            icon={<Edit className="w-4 h-4" />}
            title="Editar máquina"
            onClick={() => onEdit(maquina)}
            className="text-info-600 hover:text-info-800 transition-colors"
          />
          <IconButton
            icon={<Trash2 className="w-4 h-4" />}
            title="Eliminar máquina"
            onClick={() => onDelete(maquina)}
            className="text-danger-600 hover:text-danger-800 transition-colors"
          />
        </div>
      </div>
    </div>
  )
}
