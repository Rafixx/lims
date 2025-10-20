// src/features/workList/pages/WorklistDetailPage.tsx

import { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDeleteWorklist, useWorklist } from '../hooks/useWorklists'
import { useTecnicosLaboratorio } from '@/shared/hooks/useDim_tables'
import { Card } from '@/shared/components/molecules/Card'
import { Button } from '@/shared/components/molecules/Button'
import { Select } from '@/shared/components/molecules/Select'
import { ArrowLeft, AlertTriangle, Trash2, User, Import } from 'lucide-react'
import { formatDateTime } from '@/shared/utils/helpers'
import { APP_STATES } from '@/shared/states'
import { IndicadorEstado } from '@/shared/components/atoms/IndicadorEstado'
import { useEstados } from '@/shared/hooks/useEstados'
import { WorkListDetailStats } from '../components/WorkListDetailStats'
import { worklistService } from '../services/worklistService'
import { ResultadoInfo } from '@/features/muestras/components/MuestraList/ResultadoInfo'
import { useNotification } from '@/shared/components/Notification/NotificationContext'

export const WorklistDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const worklistId = parseInt(id || '0')
  const { notify } = useNotification()

  const [selectedTecnicoId, setSelectedTecnicoId] = useState<string>('')
  const [isAssigningTecnico, setIsAssigningTecnico] = useState(false)

  // Queries
  const { worklist, isLoading: loadingWorklist, refetch: refetchWorkList } = useWorklist(worklistId)
  const { data: estadosTecnica = [] } = useEstados('TECNICA')
  // const { data: estadisticas, isLoading: loadingEstadisticas } = useWorklistEstadisticas(worklistId)

  // const { data: tecnicasAgrupadas = [], isLoading: loadingTecnicas } =
  // useWorklistTecnicasAgrupadas(worklistId)
  const { data: tecnicos = [] } = useTecnicosLaboratorio()

  // Mutations
  // const asignarTecnico = useAsignarTecnico()
  // const iniciarTecnica = useIniciarTecnica()
  // const completarTecnica = useCompletarTecnica()
  // const deleteWorklist = useDeleteWorklist()

  // Verificar si todas las técnicas ya tienen resultados (debe estar antes de los early returns)
  const allTecnicasHaveResults = useMemo(() => {
    if (!worklist?.tecnicas || worklist.tecnicas.length === 0) return false

    return worklist.tecnicas.every(tecnica => {
      return Boolean(
        tecnica.resultados &&
          (tecnica.resultados.valor !== null ||
            tecnica.resultados.valor_texto ||
            tecnica.resultados.valor_fecha ||
            tecnica.resultados.tipo_res)
      )
    })
  }, [worklist?.tecnicas])

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
        await useDeleteWorklist()
        navigate('/worklist')
        notify('Worklist eliminada correctamente', 'success')
      } catch (error) {
        notify('Error al eliminar la worklist', 'error')
        console.error('Error deleting worklist:', error)
      }
    }
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
  const handleImportDataResults = async () => {
    try {
      // Lógica para importar resultados de datos
      await worklistService.importDataResults(worklist.id_worklist)
      refetchWorkList()
      notify('Resultados importados correctamente', 'success')
    } catch (error: unknown) {
      // Verificar si el error es porque ya existen resultados
      const errorMessage =
        (error as { response?: { data?: { message?: string } }; message?: string })?.response?.data
          ?.message ||
        (error as { message?: string })?.message ||
        ''

      if (errorMessage.includes('ya tienen resultados')) {
        // Mostrar como advertencia en lugar de error
        notify('Las técnicas ya tienen resultados asociados', 'warning')
      } else {
        notify('Error al importar resultados', 'error')
      }
      console.error('Error importing data results:', error)
    }
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
              <p className="text-gray-600 mt-1">Creado el {formatDateTime(worklist.create_dt)}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="soft"
              onClick={handleImportDataResults}
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
              variant="primary"
              onClick={handleDeleteWorklist}
              className="flex items-center gap-2"
            >
              <Trash2 size={16} />
              Eliminar Worklist
            </Button>
          </div>
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
              {/* Header de columnas */}
              <div className="grid grid-cols-12 gap-4 px-3 py-2 bg-gray-100 rounded-lg font-semibold text-sm text-gray-700">
                <div className="col-span-2">Códigos</div>
                <div className="col-span-2">Técnico Lab</div>
                <div className="col-span-6">Resultados</div>
                <div className="col-span-2">Estado</div>
              </div>

              {/* Filas de técnicas */}
              {(worklist.tecnicas || []).map((tecnica, index) => {
                const hasResultados = Boolean(
                  tecnica.resultados &&
                    (tecnica.resultados.valor !== null ||
                      tecnica.resultados.valor_texto ||
                      tecnica.resultados.valor_fecha ||
                      tecnica.resultados.tipo_res)
                )

                return (
                  <div
                    key={index}
                    className="grid grid-cols-12 gap-4 border p-3 rounded bg-white hover:bg-gray-50 transition-colors items-center"
                  >
                    {/* Columna 1: Códigos (span 2) */}
                    <div className="col-span-2 space-y-1">
                      <div className="text-xs text-gray-600">
                        <span className="font-medium">Externo:</span>{' '}
                        {tecnica.muestra?.codigo_externo || 'N/A'}
                      </div>
                      <div className="text-xs text-gray-600">
                        <span className="font-medium">Epidisease:</span>{' '}
                        {tecnica.muestra?.codigo_epi || 'N/A'}
                      </div>
                    </div>

                    {/* Columna 2: Técnico Lab (span 2) */}
                    <div className="col-span-2">
                      {tecnica.tecnico_resp ? (
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400 flex-shrink-0" />
                          <span className="text-sm text-gray-700 truncate">
                            {tecnica.tecnico_resp.nombre}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">Sin asignar</span>
                      )}
                    </div>

                    {/* Columna 3: Resultados (span 6) */}
                    <div className="col-span-6">
                      {hasResultados && tecnica.resultados ? (
                        <ResultadoInfo resultado={tecnica.resultados} />
                      ) : (
                        <span className="text-xs text-gray-400">Sin resultados</span>
                      )}
                    </div>

                    {/* Columna 4: Estado (span 2) */}
                    <div className="col-span-2 flex justify-end">
                      <IndicadorEstado
                        estado={estadosTecnica.find(e => e.estado === tecnica.estado)}
                        size="small"
                      />
                    </div>
                  </div>
                )
              })}
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
