// src/features/workList/pages/WorklistDetailPage.tsx

import { useParams } from 'react-router-dom'
import { useWorklist } from '../hooks/useWorklists'
import { useTecnicosLaboratorio } from '@/shared/hooks/useDim_tables'
import { Card } from '@/shared/components/molecules/Card'
import { Button } from '@/shared/components/molecules/Button'
import { AlertTriangle } from 'lucide-react'
import { WorklistHeader } from '../components/WorkListDetail/WorklistHeader'
import { WorkListDetailStats } from '../components/WorkListDetail/WorkListDetailStats'
import { WorklistTecnicasGrid } from '../components/WorkListDetail/WorklistTecnicasGrid'
import { useWorklistActions } from '../hooks/useWorklistActions'
import { useWorklistStats } from '../hooks/useWorklistStats'
import { useWorklistWorkflow } from '../hooks/useWorklistWorkflow'
import { ImportResultsModal } from '../components/WorkListResults/ImportResultsModal'
import { MapResultsModal } from '../components/WorkListResults/MapResultsModal'

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
    showImportModal,
    showMappingModal,
    mappableRows,
    instrumentType,
    tecnicas,
    openImportModal,
    closeImportModal,
    closeMappingModal,
    handleTecnicoChange,
    handleImportDataResults,
    handleConfirmMapping,
    handleStartTecnicas,
    handleDeleteWorklist,
    handleBack,
    handlePlantillaTecnica,
    handleLotes
  } = useWorklistActions({
    worklistId,
    worklistName: worklist?.nombre || '',
    tecnicas: worklist?.tecnicas || [],
    refetchWorkList
  })

  // Calcular estadísticas usando estadoInfo
  const stats = useWorklistStats(worklist?.tecnicas || [])

  // Hook de workflow para controlar permisos
  const { permissions, currentState } = useWorklistWorkflow(worklist?.tecnicas || [])

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
          worklistId={worklistId}
          nombre={worklist.nombre}
          createDt={worklist.create_dt}
          permissions={permissions}
          currentState={currentState}
          onBack={handleBack}
          onImport={openImportModal}
          onPlantillaTecnica={handlePlantillaTecnica}
          onLotes={handleLotes}
          onStartTecnicas={handleStartTecnicas}
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
            canAssignTecnico={permissions.canAssignTecnico}
            onTecnicoChange={handleTecnicoChange}
          />
        </div>
      )}

      {/* Modal de importación */}
      <ImportResultsModal
        isOpen={showImportModal}
        onClose={closeImportModal}
        onImport={handleImportDataResults}
        worklistName={worklist.nombre}
      />

      {/* Modal de mapeo de resultados */}
      <MapResultsModal
        isOpen={showMappingModal}
        onClose={closeMappingModal}
        onConfirm={handleConfirmMapping}
        tecnicas={tecnicas}
        mappableRows={mappableRows}
      />
    </div>
  )
}
