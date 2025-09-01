// src/features/workList/pages/WorkListPage.tsx

import { useState } from 'react'
import { useNotification } from '@/shared/components/Notification/NotificationContext'
import {
  useTecnicasAgrupadasPorProceso,
  useTecnicasPorProceso,
  useWorklistStats,
  useAsignarTecnico,
  useIniciarTecnica,
  useCompletarTecnica
} from '../hooks/useWorklist'
import { useTecnicosLab } from '../hooks/useTecnicosLab'
import { TecnicaCard } from '../components/TecnicaCard'
import { MuestraDetailCard } from '../components/MuestraDetailCard'
import { WorklistStats } from '../components/WorklistStats'
import { Card } from '@/shared/components/molecules/Card'
import { RefreshCw } from 'lucide-react'
import { Button } from '@/shared/components/molecules/Button'

export const WorkListPage = () => {
  const [selectedProcesoId, setSelectedProcesoId] = useState<number | null>(null)
  const { notify } = useNotification()

  // Queries
  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useWorklistStats()
  const {
    data: tecnicasAgrupadasData,
    isLoading: loadingTecnicas,
    refetch: refetchTecnicas,
    error: errorTecnicas
  } = useTecnicasAgrupadasPorProceso()
  const {
    data: tecnicasDetalleData,
    isLoading: loadingDetalle,
    refetch: refetchDetalle,
    error: errorDetalle
  } = useTecnicasPorProceso(selectedProcesoId)
  const { data: tecnicos = [] } = useTecnicosLab()

  // Ensure arrays are always arrays to prevent map errors
  const tecnicasAgrupadas = Array.isArray(tecnicasAgrupadasData) ? tecnicasAgrupadasData : []
  const tecnicasDetalle = Array.isArray(tecnicasDetalleData) ? tecnicasDetalleData : []

  // Mutations
  const asignarTecnicoMutation = useAsignarTecnico()
  const iniciarTecnicaMutation = useIniciarTecnica()
  const completarTecnicaMutation = useCompletarTecnica()

  const handleSelectProceso = (idTecnicaProc: number) => {
    setSelectedProcesoId(idTecnicaProc === selectedProcesoId ? null : idTecnicaProc)
  }

  const handleAsignarTecnico = async (idTecnica: number, idTecnico: number) => {
    try {
      await asignarTecnicoMutation.mutateAsync({
        id_tecnica: idTecnica,
        id_tecnico_resp: idTecnico
      })
      notify('Técnico asignado correctamente', 'success')
    } catch (error) {
      notify('Error al asignar técnico', 'error')
      console.error(error)
    }
  }

  const handleIniciarTecnica = async (idTecnica: number) => {
    try {
      await iniciarTecnicaMutation.mutateAsync(idTecnica)
      notify('Técnica iniciada correctamente', 'success')
    } catch (error) {
      notify('Error al iniciar técnica', 'error')
      console.error(error)
    }
  }

  const handleCompletarTecnica = async (idTecnica: number) => {
    try {
      await completarTecnicaMutation.mutateAsync({ idTecnica, comentarios: undefined })
      notify('Técnica completada correctamente', 'success')
    } catch (error) {
      notify('Error al completar técnica', 'error')
      console.error(error)
    }
  }

  const handleRefresh = () => {
    refetchStats()
    refetchTecnicas()
    if (selectedProcesoId) {
      refetchDetalle()
    }
  }

  const isProcessing =
    asignarTecnicoMutation.isPending ||
    iniciarTecnicaMutation.isPending ||
    completarTecnicaMutation.isPending

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Lista de Trabajo</h1>
        <Button variant="ghost" onClick={handleRefresh} disabled={isProcessing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isProcessing ? 'animate-spin' : ''}`} />
          Actualizar
        </Button>
      </div>

      {/* Stats */}
      <WorklistStats stats={stats} isLoading={statsLoading} />

      <div className="flex gap-6">
        {/* Lista de técnicas agrupadas */}
        <div className="w-1/2">
          <Card>
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Técnicas Pendientes</h2>
              {loadingTecnicas ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-20 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : errorTecnicas ? (
                <div className="text-center py-8">
                  <p className="text-red-500">Error al cargar las técnicas</p>
                  <Button variant="primary" onClick={() => refetchTecnicas()} className="mt-2">
                    Reintentar
                  </Button>
                </div>
              ) : tecnicasAgrupadas.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No hay técnicas pendientes</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {tecnicasAgrupadas.map(tecnica => (
                    <TecnicaCard
                      key={tecnica.id_tecnica_proc}
                      tecnica={tecnica}
                      onClick={handleSelectProceso}
                      isSelected={selectedProcesoId === tecnica.id_tecnica_proc}
                    />
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Detalle de muestras */}
        <div className="w-1/2">
          <Card>
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {selectedProcesoId ? 'Detalle de Muestras' : 'Selecciona una técnica'}
              </h2>
              {!selectedProcesoId ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    Selecciona una técnica de la lista para ver las muestras asociadas
                  </p>
                </div>
              ) : loadingDetalle ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-32 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : errorDetalle ? (
                <div className="text-center py-8">
                  <p className="text-red-500">Error al cargar el detalle</p>
                  <Button variant="primary" onClick={() => refetchDetalle()} className="mt-2">
                    Reintentar
                  </Button>
                </div>
              ) : tecnicasDetalle.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No hay muestras para esta técnica</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                  {tecnicasDetalle.map(tecnica => (
                    <MuestraDetailCard
                      key={tecnica.id_tecnica}
                      tecnica={tecnica}
                      tecnicos={tecnicos}
                      onAsignarTecnico={handleAsignarTecnico}
                      onIniciarTecnica={handleIniciarTecnica}
                      onCompletarTecnica={handleCompletarTecnica}
                    />
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
