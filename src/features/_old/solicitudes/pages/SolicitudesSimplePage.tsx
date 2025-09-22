import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSolicitudes, useDeleteSolicitud } from '../hooks/useSolicitudes'
import type { SolicitudAPIResponse } from '../interfaces/solicitudes.types'
import { SolicitudCard } from '../components/SolicitudCard'
import { SolicitudesStats } from '../components/SolicitudesStats'
import { useNotification } from '@/shared/components/Notification/NotificationContext'
import { RefreshCw, Filter, Calendar, Plus } from 'lucide-react'
import { Button } from '@/shared/components/molecules/Button'
import { APP_STATES } from '@/shared/states'

export const SolicitudesSimplePage = () => {
  const { solicitudes, isLoading, refetch } = useSolicitudes()
  const navigate = useNavigate()

  const deleteMutation = useDeleteSolicitud()
  const { notify } = useNotification()

  const [filtroEstado, setFiltroEstado] = useState('')
  const [soloHoy, setSoloHoy] = useState(false)

  // Cálculo de estadísticas locales - con validación mejorada
  const calcularEstadisticas = () => {
    const solicitudesArray = solicitudes || []

    if (solicitudesArray.length === 0) {
      return {
        total_solicitudes: 0,
        solicitudes_pendientes: 0,
        solicitudes_en_progreso: 0,
        solicitudes_completadas: 0,
        solicitudes_vencidas: 0,
        promedio_tiempo_procesamiento: null,
        solicitudes_creadas_hoy: 0,
        solicitudes_completadas_hoy: 0
      }
    }

    const hoy = new Date().toISOString().split('T')[0]

    return {
      total_solicitudes: solicitudesArray.length,
      solicitudes_pendientes: solicitudesArray.filter(
        (s: SolicitudAPIResponse) => s.estado_solicitud === APP_STATES.SOLICITUD.PENDIENTE
      ).length,
      solicitudes_en_progreso: solicitudesArray.filter(
        (s: SolicitudAPIResponse) => s.estado_solicitud === APP_STATES.SOLICITUD.EN_PROCESO
      ).length,
      solicitudes_completadas: solicitudesArray.filter(
        (s: SolicitudAPIResponse) => s.estado_solicitud === APP_STATES.SOLICITUD.COMPLETADA
      ).length,
      solicitudes_vencidas: solicitudesArray.filter((s: SolicitudAPIResponse) => {
        if (!s.f_compromiso) return false
        return (
          new Date(s.f_compromiso) < new Date() &&
          s.estado_solicitud !== APP_STATES.SOLICITUD.COMPLETADA
        )
      }).length,
      promedio_tiempo_procesamiento: null,
      solicitudes_creadas_hoy: solicitudesArray.filter(
        (s: SolicitudAPIResponse) => s.f_creacion?.split('T')[0] === hoy
      ).length,
      solicitudes_completadas_hoy: solicitudesArray.filter(
        (s: SolicitudAPIResponse) =>
          s.estado_solicitud === APP_STATES.SOLICITUD.COMPLETADA &&
          s.f_entrega?.split('T')[0] === hoy
      ).length
    }
  }

  // Filtrado local - con validación mejorada
  const solicitudesFiltradas = (solicitudes || []).filter((solicitud: SolicitudAPIResponse) => {
    if (filtroEstado && solicitud.estado_solicitud !== filtroEstado) {
      return false
    }

    if (soloHoy) {
      const hoy = new Date().toISOString().split('T')[0]
      return solicitud.f_creacion?.split('T')[0] === hoy
    }

    return true
  })

  // Handlers
  const handleNuevaSolicitud = () => {
    navigate('/solicitudes/nueva')
  }

  const handleEditarSolicitud = (solicitud: SolicitudAPIResponse) => {
    navigate(`/solicitudes/${solicitud.id_solicitud}/editar`)
  }

  const handleEliminarSolicitud = async (solicitud: SolicitudAPIResponse) => {
    if (!window.confirm(`¿Eliminar solicitud ${solicitud.num_solicitud}?`)) {
      return
    }

    try {
      await deleteMutation.mutateAsync(solicitud.id_solicitud)
      notify('Solicitud eliminada correctamente', 'success')
    } catch {
      notify('Error al eliminar la solicitud', 'error')
    }
  }

  const limpiarFiltros = () => {
    setFiltroEstado('')
    setSoloHoy(false)
  }

  const estadisticas = calcularEstadisticas()
  const tieneFiltros = filtroEstado || soloHoy

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Solicitudes</h1>
          <div className="animate-pulse h-10 w-32 bg-gray-200 rounded"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-24 bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Solicitudes</h1>
          <p className="text-gray-600 mt-1">
            {solicitudesFiltradas.length} de {solicitudes?.length || 0} solicitudes
            {tieneFiltros && ' (filtradas)'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => refetch()} variant="primary" disabled={isLoading}>
            <div className="flex items-center gap-2">
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Actualizar
            </div>
          </Button>
          <Button onClick={handleNuevaSolicitud} variant="accent">
            <div className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Nueva Solicitud
            </div>
          </Button>
        </div>
      </div>

      {/* Estadísticas */}
      <SolicitudesStats stats={estadisticas} isLoading={isLoading} />

      {/* Filtros Simples */}
      <div className="bg-white p-4 rounded-lg shadow border">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filtros:</span>
          </div>

          <select
            value={filtroEstado}
            onChange={e => setFiltroEstado(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm"
          >
            <option value="">Todos los estados</option>
            <option value={APP_STATES.SOLICITUD.PENDIENTE}>Pendiente</option>
            <option value={APP_STATES.SOLICITUD.EN_PROCESO}>En Progreso</option>
            <option value={APP_STATES.SOLICITUD.COMPLETADA}>Completada</option>
            <option value={APP_STATES.SOLICITUD.CANCELADA}>Cancelada</option>
            <option value={APP_STATES.SOLICITUD.RECHAZADA}>Rechazada</option>
          </select>

          <Button
            onClick={() => setSoloHoy(!soloHoy)}
            className={`flex items-center gap-2 px-3 py-1 text-sm rounded-md ${
              soloHoy
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Sólo Hoy
          </Button>

          {tieneFiltros && (
            <Button
              onClick={limpiarFiltros}
              className="flex items-center gap-2 px-3 py-1 text-sm bg-red-50 text-red-600 hover:bg-red-100 rounded-md"
            >
              Limpiar Filtros
            </Button>
          )}
        </div>
      </div>

      {/* Lista de solicitudes */}
      <div className="space-y-4">
        {solicitudesFiltradas.length > 0 ? (
          <div className="grid gap-4">
            {solicitudesFiltradas.map((solicitud: SolicitudAPIResponse) => (
              <SolicitudCard
                key={solicitud.id_solicitud}
                solicitud={solicitud}
                onEdit={handleEditarSolicitud}
                onDelete={handleEliminarSolicitud}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-4">
              {tieneFiltros
                ? 'No se encontraron solicitudes con los filtros aplicados'
                : 'No hay solicitudes disponibles'}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
