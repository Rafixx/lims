// src/features/workList/pages/WorklistDetailPage.tsx

import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useWorklist } from '../hooks/useWorklists'
import { useTecnicosLaboratorio } from '@/shared/hooks/useDim_tables'
import { Card } from '@/shared/components/molecules/Card'
import { Button } from '@/shared/components/molecules/Button'
import { ArrowLeft, BarChart3, Clock, CheckCircle, AlertTriangle, Trash2 } from 'lucide-react'
import { TecnicaItem } from '../components/TecnicaItem'
import { APP_STATES, type AppEstado } from '@/shared/states'
import { EstadoBadge } from '@/shared/components/atoms/EstadoBadge'

export const WorklistDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const worklistId = parseInt(id || '0')

  const [selectedTecnicoId, setSelectedTecnicoId] = useState<Record<number, number>>({})

  // Queries
  const { worklist, isLoading: loadingWorklist } = useWorklist(worklistId)
  // const { data: estadisticas, isLoading: loadingEstadisticas } = useWorklistEstadisticas(worklistId)

  // const { data: tecnicasAgrupadas = [], isLoading: loadingTecnicas } =
  // useWorklistTecnicasAgrupadas(worklistId)
  const { data: tecnicos = [] } = useTecnicosLaboratorio()

  // Mutations
  // const asignarTecnico = useAsignarTecnico()
  // const iniciarTecnica = useIniciarTecnica()
  // const completarTecnica = useCompletarTecnica()
  // const deleteWorklist = useDeleteWorklist()

  const handleAsignarTecnico = async (idTecnica: number) => {
    const tecnicoId = selectedTecnicoId[idTecnica]
    if (!tecnicoId) return

    try {
      // await asignarTecnico.mutateAsync({
      //   idTecnica,
      //   data: { id_tecnico: tecnicoId }
      // })
    } catch (error) {
      console.error('Error assigning technician:', error)
    }
  }

  const handleIniciarTecnica = async (idTecnica: number) => {
    try {
      // await iniciarTecnica.mutateAsync(idTecnica)
    } catch (error) {
      console.error('Error starting technique:', error)
    }
  }

  const handleCompletarTecnica = async (idTecnica: number) => {
    try {
      // await completarTecnica.mutateAsync(idTecnica)
    } catch (error) {
      console.error('Error completing technique:', error)
    }
  }

  const handleDeleteWorklist = async () => {
    if (!worklist) return

    if (window.confirm(`¿Está seguro de eliminar el worklist "${worklist.nombre}"?`)) {
      try {
        // await deleteWorklist.mutateAsync(worklistId)
        // navigate('/worklist')
      } catch (error) {
        console.error('Error deleting worklist:', error)
      }
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

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

  if (!worklist) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Worklist no encontrado</h3>
          <Button className="mt-4" onClick={() => navigate('/worklist')}>
            Volver a Worklists
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Button
              variant="accent"
              onClick={() => navigate('/worklist')}
              className="flex items-center gap-2"
            >
              <ArrowLeft size={20} />
              Volver
            </Button>

            <div>
              <h1 className="text-3xl font-bold text-gray-900">{worklist.nombre}</h1>
              <p className="text-gray-600 mt-1">Creado el {formatDate(worklist.create_dt)}</p>
            </div>
          </div>

          <Button
            variant="primary"
            onClick={handleDeleteWorklist}
            className="flex items-center gap-2"
          >
            <Trash2 size={16} />
            Eliminar Worklist
          </Button>
        </div>

        {/* Estadísticas */}
        {/* {estadisticas && ( */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-2xl font-bold text-gray-900">{worklist.tecnicas.length || 0}</p>
                <p className="text-gray-600">Total técnicas</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-3">
                <p className="text-2xl font-bold text-gray-900">
                  {worklist.tecnicas.filter(
                    tecnica => tecnica.estado === APP_STATES.TECNICA.EN_PROGRESO
                  ).length || 0}
                </p>
                <p className="text-gray-600">En progreso</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-3">
                <p className="text-2xl font-bold text-gray-900">
                  {worklist.tecnicas.filter(
                    tecnica => tecnica.estado === APP_STATES.TECNICA.COMPLETADA
                  ).length || 0}
                </p>
                <p className="text-gray-600">Completadas</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-2xl font-bold text-gray-900">
                  {worklist.tecnicas.length > 0
                    ? `${Math.round((worklist.tecnicas.filter(tecnica => tecnica.estado === APP_STATES.TECNICA.COMPLETADA).length / worklist.tecnicas.length) * 100)} %`
                    : ''}
                </p>
                <p className="text-gray-600">Progreso</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Técnicas por Proceso */}
      {loadingWorklist ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Cargando técnicas...</span>
        </div>
      ) : worklist.tecnicas && worklist.tecnicas.length > 0 ? (
        <div className="space-y-6">
          {/* {worklist.tecnicas.map(tecnica => ( */}
          <Card className="p-6">
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  {worklist.tecnica_proc?.tecnica_proc}
                </h2>
                <div className="flex items-center gap-4 text-sm text-gray-600"></div>
              </div>
            </div>

            <div className="space-y-2">
              {(worklist.tecnicas || []).map((tecnica, index) => (
                <div
                  key={index}
                  className="border p-3 rounded bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <span className="font-medium text-gray-900">
                        Código Epidisease: {tecnica.muestra.codigo_epi}
                      </span>
                      <span className="text-gray-600">
                        • Código Externo: {tecnica.muestra.codigo_externo || 'N/A'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <EstadoBadge
                        estado={tecnica.estado as AppEstado}
                        size="sm"
                        showIcon={true}
                        showTooltip={true}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      ) : (
        <Card className="p-8 text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-yellow-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No hay técnicas en este worklist
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Las técnicas aparecerán aquí cuando sean asignadas al worklist.
          </p>
        </Card>
      )}
    </div>
  )
}
