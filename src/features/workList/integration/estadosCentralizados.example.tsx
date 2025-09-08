/**
 * Ejemplo simplificado de integración del sistema centralizado de estados con workList
 * Este archivo demuestra cómo usar el sistema de estados en la feature workList
 */

import { useState, useEffect } from 'react'
import { useStateManager, useStateAnalytics } from '@/shared/hooks/useStateManager'
import { EstadoBadge } from '@/shared/components/atoms/EstadoBadge'
import { APP_STATES, type MuestraEstado } from '@/shared/states'
import {
  getEstadoConfig,
  esTransicionValida,
  getEstadosPermitidos
} from '@/shared/utils/stateHelpers'

// ================================
// TIPOS PARA WORKLIST
// ================================

interface MuestraWorkList {
  id: number
  codigo: string
  estado: MuestraEstado
  paciente: string
  prueba: string
  fecha_recepcion: string
  fecha_procesamiento?: string
  prioridad: number
  observaciones?: string
}

// ================================
// EJEMPLO DE COMPONENTE MUESTRA CARD
// ================================

interface MuestraCardProps {
  muestra: MuestraWorkList
  onUpdateEstado?: (id: number, nuevoEstado: MuestraEstado) => void
}

export const MuestraCard = ({ muestra, onUpdateEstado }: MuestraCardProps) => {
  const stateManager = useStateManager()
  const [isUpdating, setIsUpdating] = useState(false)

  // Inicializar el estado del manager
  useEffect(() => {
    stateManager.setState(muestra.estado)
  }, [muestra.estado, stateManager])

  const handleEstadoChange = async (nuevoEstado: MuestraEstado) => {
    if (!stateManager.canTransitionTo(nuevoEstado)) {
      alert(`Transición no válida de ${stateManager.currentState} a ${nuevoEstado}`)
      return
    }

    setIsUpdating(true)
    try {
      // Actualizar estado local
      stateManager.setState(nuevoEstado)

      // Actualizar en servidor (simulado)
      await new Promise(resolve => setTimeout(resolve, 1000))
      onUpdateEstado?.(muestra.id, nuevoEstado)
    } catch {
      // Revertir si falla
      stateManager.undo()
      alert('Error al actualizar estado')
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="bg-white border rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-lg">{muestra.codigo}</h3>
        <EstadoBadge estado={stateManager.currentState || muestra.estado} />
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
        <p>
          <span className="font-medium">Paciente:</span> {muestra.paciente}
        </p>
        <p>
          <span className="font-medium">Prueba:</span> {muestra.prueba}
        </p>
        <p>
          <span className="font-medium">Prioridad:</span> {muestra.prioridad}
        </p>
        <p>
          <span className="font-medium">Recepción:</span>{' '}
          {new Date(muestra.fecha_recepcion).toLocaleDateString()}
        </p>
      </div>

      {muestra.observaciones && (
        <div className="mb-4 p-2 bg-gray-50 rounded text-sm">
          <span className="font-medium">Observaciones:</span> {muestra.observaciones}
        </div>
      )}

      <div className="space-y-2">
        <div className="text-sm font-medium text-gray-700">Estados disponibles:</div>
        <div className="flex flex-wrap gap-2">
          {stateManager.allowedStates.map(estado => (
            <button
              key={estado}
              onClick={() => handleEstadoChange(estado as MuestraEstado)}
              disabled={isUpdating || !stateManager.canTransitionTo(estado)}
              className="disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <EstadoBadge estado={estado} size="sm" />
            </button>
          ))}
        </div>
      </div>

      {stateManager.history.length > 1 && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Historial:</span>
            <button
              onClick={() => stateManager.undo()}
              disabled={!stateManager.canUndo || isUpdating}
              className="text-xs text-blue-600 hover:text-blue-800 disabled:opacity-50"
            >
              Deshacer
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ================================
// EJEMPLO DE HOOK PERSONALIZADO PARA WORKLIST
// ================================

export const useWorkListStates = (muestras: MuestraWorkList[]) => {
  // Análisis de estados usando el hook centralizado
  const analytics = useStateAnalytics(muestras, m => m.estado)

  // Filtros por estado
  const [filtroEstado, setFiltroEstado] = useState<string[]>([])

  const muestrasFiltradas = muestras.filter(
    m => filtroEstado.length === 0 || filtroEstado.includes(m.estado)
  )

  const toggleFiltroEstado = (estado: string) => {
    setFiltroEstado(prev =>
      prev.includes(estado) ? prev.filter(e => e !== estado) : [...prev, estado]
    )
  }

  const limpiarFiltros = () => {
    setFiltroEstado([])
  }

  // Métricas específicas del workList usando los estados reales del sistema
  const muestrasEnProcesamiento = muestras.filter(
    m => m.estado === APP_STATES.MUESTRA.EN_PROCESAMIENTO
  ).length

  const muestrasPendientes = muestras.filter(m => m.estado === APP_STATES.MUESTRA.RECIBIDA).length

  const muestrasCompletadas = muestras.filter(m => m.estado === APP_STATES.MUESTRA.PROCESADA).length

  const muestrasRechazadas = muestras.filter(m => m.estado === APP_STATES.MUESTRA.RECHAZADA).length

  return {
    analytics,
    muestrasFiltradas,
    filtroEstado,
    toggleFiltroEstado,
    limpiarFiltros,
    metricas: {
      enProcesamiento: muestrasEnProcesamiento,
      pendientes: muestrasPendientes,
      completadas: muestrasCompletadas,
      rechazadas: muestrasRechazadas,
      total: muestras.length
    }
  }
}

// ================================
// EJEMPLO DE COMPONENTE DASHBOARD
// ================================

export const WorkListDashboard = ({ muestras }: { muestras: MuestraWorkList[] }) => {
  const { analytics, filtroEstado, toggleFiltroEstado, limpiarFiltros, metricas } =
    useWorkListStates(muestras)

  return (
    <div className="space-y-6">
      {/* Métricas Rápidas */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{metricas.pendientes}</div>
          <div className="text-sm text-blue-800">Recibidas</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-yellow-600">{metricas.enProcesamiento}</div>
          <div className="text-sm text-yellow-800">En Procesamiento</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{metricas.completadas}</div>
          <div className="text-sm text-green-800">Procesadas</div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-red-600">{metricas.rechazadas}</div>
          <div className="text-sm text-red-800">Rechazadas</div>
        </div>
      </div>

      {/* Analytics Detallados */}
      {analytics && (
        <div className="bg-white border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Distribución de Estados</h3>
          <div className="grid grid-cols-3 gap-4">
            {analytics.estadisticas.map(({ estado, cantidad, porcentaje }) => (
              <div
                key={estado}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  filtroEstado.includes(estado) ? 'bg-blue-100' : 'bg-gray-50 hover:bg-gray-100'
                }`}
                onClick={() => toggleFiltroEstado(estado)}
              >
                <div className="flex items-center justify-between mb-2">
                  <EstadoBadge estado={estado} size="sm" />
                  <span className="text-lg font-bold">{cantidad}</span>
                </div>
                <div className="text-sm text-gray-600">{porcentaje.toFixed(1)}%</div>
              </div>
            ))}
          </div>

          {filtroEstado.length > 0 && (
            <button
              onClick={limpiarFiltros}
              className="mt-4 text-sm text-blue-600 hover:text-blue-800"
            >
              Limpiar filtros ({filtroEstado.length} activos)
            </button>
          )}
        </div>
      )}
    </div>
  )
}

// ================================
// UTILIDADES ESPECÍFICAS PARA WORKLIST
// ================================

/**
 * Función para determinar la próxima acción sugerida basada en el estado
 */
export const getSugeridaAccion = (estado: MuestraEstado): string => {
  switch (estado) {
    case APP_STATES.MUESTRA.RECIBIDA:
      return 'Iniciar proceso de análisis'
    case APP_STATES.MUESTRA.EN_PROCESAMIENTO:
      return 'Continuar con el procesamiento'
    case APP_STATES.MUESTRA.PROCESADA:
      return 'Muestra lista para reporte'
    case APP_STATES.MUESTRA.RECHAZADA:
      return 'Revisar motivo de rechazo'
    case APP_STATES.MUESTRA.CADUCADA:
      return 'Muestra caducada, considerar nueva toma'
    default:
      return 'Revisar estado de la muestra'
  }
}

/**
 * Función para validar transiciones específicas del workList
 */
export const validarTransicionWorkList = (
  estadoActual: MuestraEstado,
  estadoDestino: MuestraEstado,
  muestra: MuestraWorkList
): { valida: boolean; mensaje?: string } => {
  // Usar la validación base del sistema
  if (!esTransicionValida(estadoActual, estadoDestino)) {
    return {
      valida: false,
      mensaje: `Transición no permitida de ${estadoActual} a ${estadoDestino}`
    }
  }

  // Validaciones específicas del workList
  if (estadoDestino === APP_STATES.MUESTRA.EN_PROCESAMIENTO && !muestra.fecha_recepcion) {
    return {
      valida: false,
      mensaje: 'No se puede iniciar procesamiento sin fecha de recepción'
    }
  }

  if (estadoDestino === APP_STATES.MUESTRA.PROCESADA && muestra.prioridad < 3) {
    return {
      valida: false,
      mensaje: 'Muestras de baja prioridad requieren revisión adicional'
    }
  }

  return { valida: true }
}

// ================================
// EJEMPLOS DE USO
// ================================

/**
 * Ejemplo de datos mock para pruebas
 */
export const muestrasMock: MuestraWorkList[] = [
  {
    id: 1,
    codigo: 'MUE-001',
    estado: APP_STATES.MUESTRA.RECIBIDA,
    paciente: 'Juan Pérez',
    prueba: 'Hemograma Completo',
    fecha_recepcion: '2025-01-08T09:00:00Z',
    prioridad: 4,
    observaciones: 'Muestra en ayunas'
  },
  {
    id: 2,
    codigo: 'MUE-002',
    estado: APP_STATES.MUESTRA.EN_PROCESAMIENTO,
    paciente: 'María García',
    prueba: 'Perfil Lipídico',
    fecha_recepcion: '2025-01-08T08:30:00Z',
    fecha_procesamiento: '2025-01-08T10:15:00Z',
    prioridad: 5
  },
  {
    id: 3,
    codigo: 'MUE-003',
    estado: APP_STATES.MUESTRA.PROCESADA,
    paciente: 'Carlos López',
    prueba: 'Glucosa',
    fecha_recepcion: '2025-01-07T16:00:00Z',
    fecha_procesamiento: '2025-01-08T08:00:00Z',
    prioridad: 3
  }
]

// ================================
// EXPORTACIONES
// ================================

export { type MuestraWorkList }
