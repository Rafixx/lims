// src/features/workList/components/WorklistHeader.tsx

import { Button } from '@/shared/components/molecules/Button'
import { ArrowLeft, Import, Trash2 } from 'lucide-react'
import { formatDateTime } from '@/shared/utils/helpers'

interface WorklistHeaderProps {
  nombre: string
  createDt: string
  allTecnicasHaveResults: boolean
  onBack: () => void
  onImport: () => void
  onDelete: () => void
  onStartTecnicas: () => void
}

export const WorklistHeader = ({
  nombre,
  createDt,
  allTecnicasHaveResults,
  onBack,
  onImport,
  onDelete,
  onStartTecnicas
}: WorklistHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-4">
        <Button variant="accent" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft size={20} />
          Volver
        </Button>

        <div>
          <h1 className="text-3xl font-bold text-gray-900">{nombre}</h1>
          <p className="text-gray-600 mt-1">Creado el {formatDateTime(createDt)}</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button
          variant="soft"
          onClick={onStartTecnicas}
          disabled={allTecnicasHaveResults}
          className="flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Iniciar Técnicas
        </Button>
        <Button
          variant="soft"
          onClick={onImport}
          className="flex items-center gap-2"
          disabled={allTecnicasHaveResults}
          title={
            allTecnicasHaveResults
              ? 'Todas las técnicas ya tienen resultados'
              : 'Importar resultados desde fuente de datos'
          }
        >
          <Import size={16} />
          Importar resultados
        </Button>
        <Button variant="primary" onClick={onDelete} className="flex items-center gap-2">
          <Trash2 size={16} />
          Eliminar Worklist
        </Button>
      </div>
    </div>
  )
}
