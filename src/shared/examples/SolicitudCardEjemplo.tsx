/**
 * Ejemplo de componente actualizado usando el nuevo sistema centralizado de estados
 * Demuestra como integrar EstadoBadge y las utilidades de estado
 */

import React from 'react'
import { User, Building, TestTube, MapPin, Calendar } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

// Importar el sistema centralizado de estados
import { EstadoBadge, getEstadoConfig, APP_STATES, type SolicitudEstado } from '@/shared/states'

// ================================
// TIPOS (Ejemplo actualizado)
// ================================

interface SolicitudPendienteEjemplo {
  id: number
  num_solicitud: string
  estado: SolicitudEstado // ✅ Usando el tipo centralizado
  nombre_cliente: string
  nombre_tecnico_responsable: string
  nombre_centro: string
  descripcion_criterio_validacion: string
  descripcion_ubicacion: string
  tipo_muestra: string
  fecha_creacion: string
  fecha_actualizacion: string
}

interface SolicitudCardEjemploProps {
  solicitud: SolicitudPendienteEjemplo
  onEstadoChange?: (solicitud: SolicitudPendienteEjemplo, nuevoEstado: SolicitudEstado) => void
  onView?: (solicitud: SolicitudPendienteEjemplo) => void
}

// ================================
// COMPONENTE EJEMPLO
// ================================

export const SolicitudCardEjemplo: React.FC<SolicitudCardEjemploProps> = ({
  solicitud,
  onEstadoChange,
  onView
}) => {
  const estadoConfig = getEstadoConfig(solicitud.estado)

  const handleEstadoClick = () => {
    // Ejemplo de cambio de estado: de PENDIENTE a EN_PROCESO
    if (solicitud.estado === APP_STATES.SOLICITUD.PENDIENTE && onEstadoChange) {
      onEstadoChange(solicitud, APP_STATES.SOLICITUD.EN_PROCESO)
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      {/* Header con número de solicitud y estado */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{solicitud.num_solicitud}</h3>
          <p className="text-sm text-gray-500">
            Actualizado{' '}
            {formatDistanceToNow(new Date(solicitud.fecha_actualizacion), {
              addSuffix: true,
              locale: es
            })}
          </p>
        </div>

        {/* ✅ Badge con estado usando el sistema centralizado */}
        <EstadoBadge
          estado={solicitud.estado}
          size="md"
          showIcon={true}
          showTooltip={true}
          onClick={handleEstadoClick}
          className="transition-transform hover:scale-105"
        />
      </div>

      {/* Información principal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        <div className="flex items-center gap-2">
          <User size={16} className="text-gray-400" />
          <span className="text-sm text-gray-600">Cliente:</span>
          <span className="text-sm font-medium">{solicitud.nombre_cliente}</span>
        </div>

        <div className="flex items-center gap-2">
          <Building size={16} className="text-gray-400" />
          <span className="text-sm text-gray-600">Centro:</span>
          <span className="text-sm font-medium">{solicitud.nombre_centro}</span>
        </div>

        <div className="flex items-center gap-2">
          <User size={16} className="text-blue-500" />
          <span className="text-sm text-gray-600">Técnico:</span>
          <span className="text-sm font-medium">{solicitud.nombre_tecnico_responsable}</span>
        </div>

        <div className="flex items-center gap-2">
          <TestTube size={16} className="text-purple-500" />
          <span className="text-sm text-gray-600">Muestra:</span>
          <span className="text-sm font-medium">{solicitud.tipo_muestra}</span>
        </div>
      </div>

      {/* Información adicional */}
      <div className="space-y-2 mb-4">
        <div className="flex items-start gap-2">
          <MapPin size={16} className="text-green-500 mt-0.5" />
          <div>
            <span className="text-sm text-gray-600">Ubicación:</span>
            <p className="text-sm font-medium">{solicitud.descripcion_ubicacion}</p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Calendar size={16} className="text-orange-500 mt-0.5" />
          <div>
            <span className="text-sm text-gray-600">Criterio de validación:</span>
            <p className="text-sm font-medium">{solicitud.descripcion_criterio_validacion}</p>
          </div>
        </div>
      </div>

      {/* Indicador visual de prioridad */}
      <div className={`h-1 rounded-full ${estadoConfig.bgColor} mb-3`} />

      {/* Acciones */}
      <div className="flex items-center justify-between">
        <div className="text-xs text-gray-500">
          Prioridad: {estadoConfig.priority} | {estadoConfig.description}
        </div>

        <button
          onClick={() => onView?.(solicitud)}
          className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
        >
          Ver detalles
        </button>
      </div>
    </div>
  )
}

export default SolicitudCardEjemplo
