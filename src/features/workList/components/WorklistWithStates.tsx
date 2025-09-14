// src/features/workList/components/WorklistWithStates.tsx
// Componente que demuestra la integración con el sistema de estados centralizado

import React from 'react'
import { useWorklistWithStates } from '../hooks/useWorklistNew'
import { EstadoBadge, TecnicaBadge } from '@/shared/states'
import { APP_STATES, type TecnicaEstado } from '@/shared/states'
import { Button } from '@/shared/components/molecules/Button'
import { Card } from '@/shared/components/molecules/Card'
import { RefreshCw, Filter, BarChart3 } from 'lucide-react'

export const WorklistWithStates = () => {
  const {
    tecnicas,
    estadisticas,
    analytics,
    isLoading,
    error,
    isUpdating,
    filtrosEstado,
    ordenamiento,
    setOrdenamiento,
    toggleFiltroEstado,
    limpiarFiltros,
    cambiarEstadoTecnica,
    refetch
  } = useWorklistWithStates()

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse bg-gray-200 h-16 rounded"></div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg">
        <p className="text-red-800">Error al cargar técnicas: {error.message}</p>
        <Button onClick={() => refetch()} className="mt-2" variant="ghost">
          <RefreshCw className="w-4 h-4 mr-2" />
          Reintentar
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header con estadísticas rápidas */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">WorkList con Estados Centralizados</h1>
          <p className="text-gray-600">
            {tecnicas.length} técnicas {filtrosEstado.length > 0 && '(filtradas)'}
          </p>
        </div>

        <div className="flex gap-2">
          <Button onClick={() => refetch()} disabled={isLoading || isUpdating}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        </div>
      </div>

      {/* Métricas usando el sistema de estados */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pendientes</p>
              <p className="text-2xl font-bold text-amber-600">
                {estadisticas.total_tecnicas_pendientes}
              </p>
            </div>
            <div className="p-2 bg-amber-100 rounded">
              <BarChart3 className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">En Progreso</p>
              <p className="text-2xl font-bold text-blue-600">
                {estadisticas.total_tecnicas_en_progreso}
              </p>
            </div>
            <div className="p-2 bg-blue-100 rounded">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completadas</p>
              <p className="text-2xl font-bold text-green-600">
                {estadisticas.total_tecnicas_completadas_hoy}
              </p>
            </div>
            <div className="p-2 bg-green-100 rounded">
              <BarChart3 className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Procesos</p>
              <p className="text-2xl font-bold text-purple-600">{estadisticas.total_procesos}</p>
            </div>
            <div className="p-2 bg-purple-100 rounded">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filtros por estado usando el sistema centralizado */}
      <Card className="p-4">
        <div className="flex items-center gap-4 mb-4">
          <Filter className="w-5 h-5 text-gray-500" />
          <span className="font-medium">Filtros por Estado:</span>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {Object.values(APP_STATES.TECNICA).map(estado => (
            <button
              key={estado}
              onClick={() => toggleFiltroEstado(estado as TecnicaEstado)}
              className={`transition-all ${
                filtrosEstado.includes(estado as TecnicaEstado)
                  ? 'ring-2 ring-blue-500'
                  : 'hover:ring-1 hover:ring-gray-300'
              }`}
            >
              <TecnicaBadge estado={estado as TecnicaEstado} />
            </button>
          ))}
        </div>

        <div className="flex gap-4 items-center">
          <div>
            <label className="text-sm font-medium mr-2">Ordenar por:</label>
            <select
              value={ordenamiento}
              onChange={e => setOrdenamiento(e.target.value as 'prioridad' | 'fecha' | 'estado')}
              className="border border-gray-300 rounded px-3 py-1 text-sm"
            >
              <option value="prioridad">Prioridad</option>
              <option value="fecha">Fecha</option>
              <option value="estado">Estado</option>
            </select>
          </div>

          {filtrosEstado.length > 0 && (
            <Button onClick={limpiarFiltros} variant="ghost">
              Limpiar Filtros ({filtrosEstado.length})
            </Button>
          )}
        </div>
      </Card>

      {/* Lista de técnicas con controles de estado */}
      <div className="space-y-3">
        {tecnicas.map(tecnica => (
          <Card key={tecnica.id_tecnica} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-medium">{tecnica.tecnica_proc?.tecnica_proc}</h3>
                  <TecnicaBadge estado={tecnica.estado} />
                </div>

                <div className="text-sm text-gray-600">
                  <p>Técnico: {tecnica.id_tecnico_resp || 'No asignado'}</p>
                  <p>Fecha: {new Date(tecnica.fecha_estado).toLocaleDateString()}</p>
                  {tecnica.comentarios && (
                    <p className="text-gray-800 mt-1">📝 {tecnica.comentarios}</p>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                {tecnica.estado === APP_STATES.TECNICA.PENDIENTE && (
                  <Button
                    onClick={() =>
                      cambiarEstadoTecnica(
                        tecnica.id_tecnica,
                        tecnica.estado,
                        APP_STATES.TECNICA.EN_PROGRESO
                      )
                    }
                    disabled={isUpdating}
                    variant="primary"
                  >
                    Iniciar
                  </Button>
                )}

                {tecnica.estado === APP_STATES.TECNICA.EN_PROGRESO && (
                  <Button
                    onClick={() =>
                      cambiarEstadoTecnica(
                        tecnica.id_tecnica,
                        tecnica.estado,
                        APP_STATES.TECNICA.COMPLETADA
                      )
                    }
                    disabled={isUpdating}
                    variant="accent"
                  >
                    Completar
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}

        {tecnicas.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {filtrosEstado.length > 0
                ? 'No hay técnicas con los filtros aplicados'
                : 'No hay técnicas disponibles'}
            </p>
          </div>
        )}
      </div>

      {/* Analytics del sistema de estados */}
      {analytics && (
        <Card className="p-4">
          <h3 className="font-medium mb-3">Analytics de Estados</h3>
          <div className="text-sm text-gray-600">
            <p>Estados ordenados: {analytics.estadosOrdenados.join(', ')}</p>
            <p>Total items: {analytics.totalItems}</p>
            <p>Conteos: {JSON.stringify(analytics.conteos)}</p>
          </div>
        </Card>
      )}
    </div>
  )
}
