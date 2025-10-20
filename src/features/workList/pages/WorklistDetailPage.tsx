// src/features/workList/pages/WorklistDetailPage.tsx

import { useParams } from 'react-router-dom'
import { useWorklist } from '../hooks/useWorklists'
import { useTecnicosLaboratorio } from '@/shared/hooks/useDim_tables'
import { Card } from '@/shared/components/molecules/Card'
import { Button } from '@/shared/components/molecules/Button'
import { AlertTriangle } from 'lucide-react'
import { WorklistHeader } from '../components/WorklistHeader'
import { WorkListDetailStats } from '../components/WorkListDetailStats'
import { WorklistTecnicasGrid } from '../components/WorklistTecnicasGrid'
import { useWorklistActions } from '../hooks/useWorklistActions'
import { useWorklistStats } from '../hooks/useWorklistStats'

export const WorklistDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const worklistId = parseInt(id || '0')

  // Queries
  const { worklist, isLoading: loadingWorklist, refetch: refetchWorkList } = useWorklist(worklistId)
  const { data: tecnicos = [] } = useTecnicosLaboratorio()

  // Custom hooks para lógica de negocio
  const {
    selectedTecnicoId,
    isAssigningTecnico,
    handleTecnicoChange,
    handleImportDataResults,
    handleDeleteWorklist,
    handleBack
  } = useWorklistActions({
    worklistId,
    worklistName: worklist?.nombre || '',
    refetchWorkList
  })

  // Calcular estadísticas usando estadoInfo
  const stats = useWorklistStats(worklist?.tecnicas || [])

  // Loading state
  if (loadingWorklist) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando worklist...</p>
        </div>
      </div>
    )
  }

  // Not found state
  if (!worklist) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Worklist no encontrado</h3>
          <Button className="mt-4" onClick={handleBack}>
            Volver a Worklists
          </Button>
        </div>
      </div>
    )
  }

  // Empty state
  const hasNoTecnicas = !worklist.tecnicas || worklist.tecnicas.length === 0

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <WorklistHeader
          nombre={worklist.nombre}
          createDt={worklist.create_dt}
          allTecnicasHaveResults={stats.allTecnicasHaveResults}
          onBack={handleBack}
          onImport={handleImportDataResults}
          onDelete={handleDeleteWorklist}
        />

        {/* Estadísticas */}
        <WorkListDetailStats
          totalTecnicas={stats.totalTecnicas}
          tecnicasEnProgreso={stats.tecnicasEnProgreso}
          tecnicasCompletadas={stats.tecnicasCompletadas}
          porcentajeProgreso={stats.porcentajeProgreso}
        />
      </div>

      {/* Técnicas Grid */}
      {hasNoTecnicas ? (
        <Card className="p-8 text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-yellow-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No hay técnicas en este worklist
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Las técnicas aparecerán aquí cuando sean asignadas al worklist.
          </p>
        </Card>
      ) : (
        <div className="space-y-6">
          <WorklistTecnicasGrid
            tecnicaProc={worklist.tecnica_proc || 'Técnicas'}
            tecnicas={worklist.tecnicas}
            tecnicos={tecnicos}
            selectedTecnicoId={selectedTecnicoId}
            isAssigningTecnico={isAssigningTecnico}
            onTecnicoChange={handleTecnicoChange}
          />
        </div>
      )}
    </div>
  )
}
