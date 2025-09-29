// src/features/workList/pages/WorklistDetailPage.tsx

import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useWorklist } from '../hooks/useWorklists'
import { useTecnicosLaboratorio } from '@/shared/hooks/useDim_tables'
import { Card } from '@/shared/components/molecules/Card'
import { Button } from '@/shared/components/molecules/Button'
import { Select } from '@/shared/components/molecules/Select'
import { ArrowLeft, AlertTriangle, Trash2, User } from 'lucide-react'
import { APP_STATES, type AppEstado } from '@/shared/states'
import { EstadoBadge } from '@/shared/components/atoms/EstadoBadge'
import { WorkListDetailStats } from '../components/WorkListDetailStats'
import { worklistService } from '../services/worklistService'

export const WorklistDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const worklistId = parseInt(id || '0')

  const [selectedTecnicoId, setSelectedTecnicoId] = useState<string>('')
  const [isAssigningTecnico, setIsAssigningTecnico] = useState(false)

  // Queries
  const { worklist, isLoading: loadingWorklist, refetch: refetchWorkList } = useWorklist(worklistId)
  // const { data: estadisticas, isLoading: loadingEstadisticas } = useWorklistEstadisticas(worklistId)

  // const { data: tecnicasAgrupadas = [], isLoading: loadingTecnicas } =
  // useWorklistTecnicasAgrupadas(worklistId)
  const { data: tecnicos = [] } = useTecnicosLaboratorio()

  // Mutations
  // const asignarTecnico = useAsignarTecnico()
  // const iniciarTecnica = useIniciarTecnica()
  // const completarTecnica = useCompletarTecnica()
  // const deleteWorklist = useDeleteWorklist()

  const handleTecnicoChange = async (tecnicoId: string) => {
    if (!tecnicoId || !worklist) return

    setIsAssigningTecnico(true)
    setSelectedTecnicoId(tecnicoId)

    try {
      await worklistService.setTecnicoLab(worklist.id_worklist, parseInt(tecnicoId))
      console.log(`Asignando técnico ${tecnicoId} al worklist ${worklist.id_worklist}`)

      // TODO: Actualizar el estado local o refetch del worklist
      await refetchWorkList()
    } catch (error) {
      console.error('Error assigning technician:', error)
      // Revertir el estado en caso de error
      setSelectedTecnicoId('')
    } finally {
      setIsAssigningTecnico(false)
    }
  }

  // TODO: Implementar funciones cuando estén disponibles los hooks correspondientes
  // const handleIniciarTecnica = async (idTecnica: number) => {
  //   try {
  //     // await iniciarTecnica.mutateAsync(idTecnica)
  //   } catch (error) {
  //     console.error('Error starting technique:', error)
  //   }
  // }

  // const handleCompletarTecnica = async (idTecnica: number) => {
  //   try {
  //     // await completarTecnica.mutateAsync(idTecnica)
  //   } catch (error) {
  //     console.error('Error completing technique:', error)
  //   }
  // }

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

  // Cálculo de estadísticas
  const totalTecnicas = worklist.tecnicas.length || 0
  const tecnicasEnProgreso =
    worklist.tecnicas.filter(tecnica => tecnica.estado === APP_STATES.TECNICA.EN_PROGRESO).length ||
    0
  const tecnicasCompletadas =
    worklist.tecnicas.filter(tecnica => tecnica.estado === APP_STATES.TECNICA.COMPLETADA).length ||
    0
  const porcentajeProgreso =
    totalTecnicas > 0 ? Math.round((tecnicasCompletadas / totalTecnicas) * 100) : 0

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
        <WorkListDetailStats
          totalTecnicas={totalTecnicas}
          tecnicasEnProgreso={tecnicasEnProgreso}
          tecnicasCompletadas={tecnicasCompletadas}
          porcentajeProgreso={porcentajeProgreso}
        />
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
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-semibold text-gray-900">{worklist.tecnica_proc}</h2>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600 min-w-max">
                      Cambiar técnico asignado:
                    </span>
                  </div>
                  <div className="min-w-[200px]">
                    <Select
                      value={selectedTecnicoId}
                      onChange={e => handleTecnicoChange(e.target.value)}
                      disabled={isAssigningTecnico || tecnicos.length === 0}
                    >
                      <option value="">
                        {tecnicos.length === 0
                          ? 'No hay técnicos disponibles'
                          : 'Seleccionar técnico'}
                      </option>
                      {tecnicos.map(tecnico => (
                        <option key={tecnico.id_usuario} value={tecnico.id_usuario}>
                          {tecnico.nombre}
                        </option>
                      ))}
                    </Select>
                  </div>
                  {isAssigningTecnico && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
                  )}
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="mb-5">
                <span className="py-2 px-4 font-medium text-gray-900">MUESTRAS</span>
              </div>
              {(worklist.tecnicas || []).map((tecnica, index) => (
                <div
                  key={index}
                  className="border p-3 rounded bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <span className="font-medium text-gray-900">
                        Código Epidisease: {tecnica.muestra?.codigo_epi}
                      </span>
                      <span className="text-gray-600">
                        • Código Externo: {tecnica.muestra?.codigo_externo || 'N/A'}
                      </span>
                    </div>
                    {/* Tecnico de laboratorio, si existe */}
                    {tecnica.tecnico_resp ? (
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">
                          Técnico de laboratorio: {tecnica.tecnico_resp.nombre}
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-600">• Sin técnico asignado</span>
                    )}
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
