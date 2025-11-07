// src/features/workList/components/WorklistHeader.tsx

import { Button } from '@/shared/components/molecules/Button'
import { Badge } from '@/shared/components/molecules/Badge'
import { useLotesPendientes } from '@/features/tecnicasReactivos/hooks/useTecnicasReactivos'
import { ArrowLeft, Import, LayoutTemplate, Trash2, FlaskConical } from 'lucide-react'
import { formatDateTime } from '@/shared/utils/helpers'

interface WorklistHeaderProps {
  worklistId: number
  nombre: string
  createDt: string
  allTecnicasHaveResults: boolean
  allTecnicasHaveTecnicoLab: boolean
  onBack: () => void
  onImport: () => void
  onPlantillaTecnica: () => void
  onLotes: () => void
  onDelete: () => void
  onStartTecnicas: () => void
}

export const WorklistHeader = ({
  worklistId,
  nombre,
  createDt,
  allTecnicasHaveResults,
  allTecnicasHaveTecnicoLab,
  onBack,
  onImport,
  onPlantillaTecnica,
  onLotes,
  onDelete,
  onStartTecnicas
}: WorklistHeaderProps) => {
  // Hook para obtener lotes pendientes
  const { data: lotesData } = useLotesPendientes(worklistId)
  const lotesPendientes = lotesData?.pendientes || 0

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
          disabled={allTecnicasHaveTecnicoLab}
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
        <Button
          variant="soft"
          onClick={onPlantillaTecnica}
          className="flex items-center gap-2"
          // disabled={!allTecnicasHaveResults}
        >
          <LayoutTemplate size={16} />
          Plantilla técnica
        </Button>
        <Button variant="soft" onClick={onLotes} className="flex items-center gap-2 relative">
          <FlaskConical size={16} />
          Lotes
          {lotesPendientes > 0 && (
            <Badge variant="warning" size="sm" className="ml-1">
              {lotesPendientes}
            </Badge>
          )}
        </Button>
        <Button variant="primary" onClick={onDelete} className="flex items-center gap-2">
          <Trash2 size={16} />
          Eliminar Worklist
        </Button>
      </div>
    </div>
  )
}
