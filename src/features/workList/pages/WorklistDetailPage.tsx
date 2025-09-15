// src/features/workList/pages/WorklistDetailPage.tsx

import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  useWorklist,
  useWorklistEstadisticas,
  useWorklistTecnicasAgrupadas,
  useAsignarTecnico,
  useIniciarTecnica,
  useCompletarTecnica,
  useDeleteWorklist
} from '../hooks/useWorklistsNew'
import { useTecnicosLab } from '../hooks/useTecnicosLab'
import { Card } from '@/shared/components/molecules/Card'
import { Button } from '@/shared/components/molecules/Button'
import { EstadoBadge } from '@/shared/components/atoms/EstadoBadge'
import {
  ArrowLeft,
  BarChart3,
  Clock,
  CheckCircle,
  User,
  Calendar,
  Play,
  Check,
  UserCheck,
  AlertTriangle,
  Trash2
} from 'lucide-react'
import type { TecnicaWorklist } from '../interfaces/worklist.types'

export const WorklistDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const worklistId = parseInt(id || '0')

  const [selectedTecnicoId, setSelectedTecnicoId] = useState<Record<number, number>>({})

  // Queries
  const { data: worklist, isLoading: loadingWorklist } = useWorklist(worklistId)
  const { data: estadisticas, isLoading: loadingEstadisticas } = useWorklistEstadisticas(worklistId)
  const { data: tecnicasAgrupadas = [], isLoading: loadingTecnicas } =
    useWorklistTecnicasAgrupadas(worklistId)
  const { data: tecnicos = [] } = useTecnicosLab()

  // Mutations
  const asignarTecnico = useAsignarTecnico()
  const iniciarTecnica = useIniciarTecnica()
  const completarTecnica = useCompletarTecnica()
  const deleteWorklist = useDeleteWorklist()

  const handleAsignarTecnico = async (idTecnica: number) => {
    const tecnicoId = selectedTecnicoId[idTecnica]
    if (!tecnicoId) return

    try {
      await asignarTecnico.mutateAsync({
        idTecnica,
        data: { id_tecnico: tecnicoId }
      })
    } catch (error) {
      console.error('Error assigning technician:', error)
    }
  }

  const handleIniciarTecnica = async (idTecnica: number) => {
    try {
      await iniciarTecnica.mutateAsync(idTecnica)
    } catch (error) {
      console.error('Error starting technique:', error)
    }
  }

  const handleCompletarTecnica = async (idTecnica: number) => {
    try {
      await completarTecnica.mutateAsync(idTecnica)
    } catch (error) {
      console.error('Error completing technique:', error)
    }
  }

  const handleDeleteWorklist = async () => {
    if (!worklist) return

    if (window.confirm(`¿Está seguro de eliminar el worklist "${worklist.nombre}"?`)) {
      try {
        await deleteWorklist.mutateAsync(worklistId)
        navigate('/worklist')
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

  if (loadingWorklist || loadingEstadisticas) {
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
              variant="ghost"
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
            variant="danger"
            onClick={handleDeleteWorklist}
            className="flex items-center gap-2"
          >
            <Trash2 size={16} />
            Eliminar Worklist
          </Button>
        </div>

        {/* Estadísticas */}
        {estadisticas && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="flex items-center">
                <BarChart3 className="h-8 w-8 text-blue-600" />
                <div className="ml-3">
                  <p className="text-2xl font-bold text-gray-900">{estadisticas.total_tecnicas}</p>
                  <p className="text-gray-600">Total técnicas</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-yellow-600" />
                <div className="ml-3">
                  <p className="text-2xl font-bold text-gray-900">
                    {estadisticas.tecnicas_en_progreso}
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
                    {estadisticas.tecnicas_completadas}
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
                    {Math.round(estadisticas.porcentaje_completado)}%
                  </p>
                  <p className="text-gray-600">Progreso</p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Técnicas por Proceso */}
      {loadingTecnicas ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Cargando técnicas...</span>
        </div>
      ) : tecnicasAgrupadas && tecnicasAgrupadas.length > 0 ? (
        <div className="space-y-6">
          {tecnicasAgrupadas.map(grupo => (
            <Card key={grupo.dim_tecnicas_proc} className="p-6">
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">{grupo.proceso_nombre}</h2>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>
                      {grupo.completadas} de {grupo.total} completadas
                    </span>
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${grupo.porcentaje_completado}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {(grupo.tecnicas || []).map(tecnica => (
                  <TecnicaItem
                    key={tecnica.id}
                    tecnica={tecnica}
                    tecnicos={tecnicos}
                    selectedTecnicoId={selectedTecnicoId[tecnica.id]}
                    onTecnicoChange={tecnicoId =>
                      setSelectedTecnicoId(prev => ({ ...prev, [tecnica.id]: tecnicoId }))
                    }
                    onAsignarTecnico={() => handleAsignarTecnico(tecnica.id)}
                    onIniciar={() => handleIniciarTecnica(tecnica.id)}
                    onCompletar={() => handleCompletarTecnica(tecnica.id)}
                    isLoading={
                      asignarTecnico.isPending ||
                      iniciarTecnica.isPending ||
                      completarTecnica.isPending
                    }
                  />
                ))}
              </div>
            </Card>
          ))}
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

// Componente para cada técnica individual
interface TecnicaItemProps {
  tecnica: TecnicaWorklist
  tecnicos: any[]
  selectedTecnicoId?: number
  onTecnicoChange: (tecnicoId: number) => void
  onAsignarTecnico: () => void
  onIniciar: () => void
  onCompletar: () => void
  isLoading: boolean
}

const TecnicaItem: React.FC<TecnicaItemProps> = ({
  tecnica,
  tecnicos,
  selectedTecnicoId,
  onTecnicoChange,
  onAsignarTecnico,
  onIniciar,
  onCompletar,
  isLoading
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES')
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-2">
            <h3 className="font-medium text-gray-900">{tecnica.codigo}</h3>
            <EstadoBadge estado={tecnica.estado} />
          </div>

          <div className="text-sm text-gray-600 flex items-center gap-4">
            <span className="flex items-center gap-1">
              <User size={14} />
              {tecnica.muestra.paciente_nombre}
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={14} />
              {formatDate(tecnica.fecha_creacion)}
            </span>
            {tecnica.tecnico_asignado && (
              <span className="flex items-center gap-1">
                <UserCheck size={14} />
                {tecnica.tecnico_asignado.nombre}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Asignación de técnico */}
          {tecnica.estado === 'PENDIENTE_TECNICA' && !tecnica.tecnico_asignado && (
            <>
              <select
                value={selectedTecnicoId || ''}
                onChange={e => onTecnicoChange(Number(e.target.value))}
                className="text-sm border border-gray-300 rounded px-2 py-1"
              >
                <option value="">Seleccionar técnico</option>
                {(tecnicos || []).map(tecnico => (
                  <option key={tecnico.id} value={tecnico.id}>
                    {tecnico.nombre}
                  </option>
                ))}
              </select>
              <Button disabled={!selectedTecnicoId || isLoading} onClick={onAsignarTecnico}>
                <UserCheck size={16} />
              </Button>
            </>
          )}

          {/* Iniciar técnica */}
          {tecnica.estado === 'PENDIENTE_TECNICA' && tecnica.tecnico_asignado && (
            <Button disabled={isLoading} onClick={onIniciar} className="flex items-center gap-1">
              <Play size={16} />
              Iniciar
            </Button>
          )}

          {/* Completar técnica */}
          {tecnica.estado === 'EN_PROGRESO' && (
            <Button
              disabled={isLoading}
              onClick={onCompletar}
              variant="accent"
              className="flex items-center gap-1"
            >
              <Check size={16} />
              Completar
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
