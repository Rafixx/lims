// src/features/workList/components/WorklistHeader.tsx

import { Button } from '@/shared/components/molecules/Button'
import { Badge } from '@/shared/components/molecules/Badge'
import { useLotesPendientes } from '@/features/tecnicasReactivos/hooks/useTecnicasReactivos'
import {
  WorklistWorkflowState,
  WorkflowPermissions,
  getDisabledTooltip
} from '../../hooks/useWorklistWorkflow'
import { ArrowLeft, Import, LayoutTemplate, FlaskConical, Play } from 'lucide-react'
import { formatDateTime } from '@/shared/utils/helpers'

interface WorklistHeaderProps {
  worklistId: number
  nombre: string
  createDt: string
  permissions: WorkflowPermissions
  currentState: WorklistWorkflowState
  onBack: () => void
  onImport: () => void
  onPlantillaTecnica: () => void
  onLotes: () => void
  onStartTecnicas: () => void
}

export const WorklistHeader = ({
  worklistId,
  nombre,
  createDt,
  permissions,
  currentState,
  onBack,
  onImport,
  onPlantillaTecnica,
  onLotes,
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
        {/* Botón: Iniciar Técnicas */}
        <Button
          variant="soft"
          onClick={onStartTecnicas}
          disabled={!permissions.canStartTecnicas}
          className="flex items-center gap-2"
          title={
            !permissions.canStartTecnicas
              ? getDisabledTooltip('canStartTecnicas', currentState)
              : 'Iniciar todas las técnicas del worklist'
          }
        >
          <Play size={16} />
          Iniciar Técnicas
        </Button>

        {/* Botón: Importar Resultados */}
        <Button
          variant="soft"
          onClick={onImport}
          className="flex items-center gap-2"
          disabled={!permissions.canImportResults}
          title={
            !permissions.canImportResults
              ? getDisabledTooltip('canImportResults', currentState)
              : 'Importar resultados desde fuente de datos'
          }
        >
          <Import size={16} />
          Importar resultados
        </Button>

        {/* Botón: Plantilla Técnica */}
        <Button
          variant="soft"
          onClick={onPlantillaTecnica}
          className="flex items-center gap-2"
          disabled={!permissions.canManagePlantillaTecnica}
          title={
            !permissions.canManagePlantillaTecnica
              ? getDisabledTooltip('canManagePlantillaTecnica', currentState)
              : 'Gestionar plantilla técnica'
          }
        >
          <LayoutTemplate size={16} />
          Plantilla técnica
        </Button>

        {/* Botón: Lotes */}
        <Button
          variant="soft"
          onClick={onLotes}
          className="flex items-center gap-2 relative"
          disabled={!permissions.canManageLotes}
          title={
            !permissions.canManageLotes
              ? getDisabledTooltip('canManageLotes', currentState)
              : 'Gestionar lotes de reactivos'
          }
        >
          <FlaskConical size={16} />
          Lotes
          {lotesPendientes > 0 && permissions.canManageLotes && (
            <Badge variant="warning" size="sm" className="ml-1">
              {lotesPendientes}
            </Badge>
          )}
        </Button>
      </div>
    </div>
  )
}
