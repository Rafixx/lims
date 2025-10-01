/**
 * Componente para cambiar estados con validación de transiciones
 * Basado en la nueva API de gestión de estados
 */

import React, { useState, useEffect } from 'react'
import { useEstadosDisponibles, useCambiarEstado } from '../../hooks/useEstados'
import { IndicadorEstado } from '../atoms/IndicadorEstado'
import { Button } from '../molecules/Button'
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react'
import type { EntidadTipo, DimEstado, CambioEstadoResponse } from '../../interfaces/estados.types'

interface CambiarEstadoProps {
  entidad: EntidadTipo
  itemId: number
  estadoActual?: DimEstado | null
  onEstadoCambiado?: (nuevoEstado: DimEstado) => void
  onError?: (error: Error) => void
  onCancel?: () => void
  size?: 'small' | 'medium' | 'large'
  variant?: 'modal' | 'inline' | 'dropdown'
  disabled?: boolean
}

export const CambiarEstado: React.FC<CambiarEstadoProps> = ({
  entidad,
  itemId,
  estadoActual,
  onEstadoCambiado,
  onError,
  onCancel,
  size = 'medium',
  variant = 'inline',
  disabled = false
}) => {
  const [estadoSeleccionado, setEstadoSeleccionado] = useState<number | ''>('')
  const [comentario, setComentario] = useState('')
  const [showConfirmation, setShowConfirmation] = useState(false)

  // Hooks para obtener estados disponibles y cambiar estado
  const {
    data: estadosDisponibles = [],
    isLoading: loadingEstados,
    error: errorEstados
  } = useEstadosDisponibles(entidad, estadoActual?.id)

  const {
    cambiarEstado,
    isLoading: cambiandoEstado,
    error: errorCambio,
    isSuccess,
    reset
  } = useCambiarEstado(entidad, {
    onSuccess: (resultado: CambioEstadoResponse) => {
      const nuevoEstado: DimEstado = resultado.estadoInfo
      onEstadoCambiado?.(nuevoEstado)

      setEstadoSeleccionado('')
      setComentario('')
      setShowConfirmation(false)
    },
    onError: (error: Error) => {
      onError?.(error)
    }
  })

  // Reset cuando cambia el estado actual
  useEffect(() => {
    setEstadoSeleccionado('')
    setComentario('')
    setShowConfirmation(false)
    reset()
  }, [estadoActual?.id, reset])

  const handleCambiarEstado = async () => {
    if (!estadoSeleccionado) return

    try {
      await cambiarEstado(itemId, Number(estadoSeleccionado), comentario || undefined)
    } catch (error) {
      console.error('Error al cambiar estado:', error)
    }
  }

  const handleConfirmar = () => {
    if (variant === 'modal' || showConfirmation) {
      handleCambiarEstado()
    } else {
      setShowConfirmation(true)
    }
  }

  const estadoSeleccionadoInfo = estadosDisponibles.find(
    estado => estado.id === Number(estadoSeleccionado)
  )

  const error = errorEstados || errorCambio
  const isLoading = loadingEstados || cambiandoEstado

  // Mapear tamaños a formato del Button
  const buttonSize = size === 'small' ? 'sm' : size === 'large' ? 'lg' : 'md'

  // Si no hay estados disponibles y no está cargando, no mostrar el componente
  if (!loadingEstados && estadosDisponibles.length === 0) {
    return null
  }

  // Si el estado actual es final, no permitir cambios
  if (estadoActual?.es_final) {
    return (
      <div className={`cambiar-estado-final ${size}`}>
        <IndicadorEstado estado={estadoActual} size={size} />
        <span className="estado-final-text">Estado final - No se pueden hacer cambios</span>
      </div>
    )
  }

  // Variante dropdown simplificada
  if (variant === 'dropdown') {
    return (
      <div className="cambiar-estado-dropdown">
        <select
          value={estadoSeleccionado}
          onChange={e => {
            const value = e.target.value === '' ? '' : Number(e.target.value)
            setEstadoSeleccionado(value)
            if (value) {
              cambiarEstado(itemId, Number(value), comentario || undefined)
            }
          }}
          disabled={disabled || isLoading}
          className="form-select"
        >
          <option value="">Cambiar estado...</option>
          {estadosDisponibles.map(estado => (
            <option key={estado.id} value={estado.id}>
              {estado.estado}
            </option>
          ))}
        </select>
      </div>
    )
  }

  return (
    <div className={`cambiar-estado ${variant} ${size}`}>
      {/* Estado actual */}
      <div className="estado-actual-section">
        <label className="estado-label">Estado actual:</label>
        <IndicadorEstado estado={estadoActual} size={size} showDescription />
      </div>

      {/* Selector de nuevo estado */}
      <div className="nuevo-estado-section">
        <div className="form-group">
          <label>Nuevo estado:</label>
          <select
            value={estadoSeleccionado}
            onChange={e =>
              setEstadoSeleccionado(e.target.value === '' ? '' : Number(e.target.value))
            }
            disabled={disabled || isLoading}
            required
            className="form-select"
          >
            <option value="">Seleccionar estado...</option>
            {estadosDisponibles.map(estado => (
              <option key={estado.id} value={estado.id}>
                {estado.estado} - {estado.descripcion}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Vista previa del estado seleccionado */}
      {estadoSeleccionadoInfo && (
        <div className="estado-preview">
          <label className="estado-label">Vista previa:</label>
          <IndicadorEstado
            estado={estadoSeleccionadoInfo as DimEstado}
            size={size}
            showDescription
          />
        </div>
      )}

      {/* Campo de comentario */}
      <div className="comentario-section">
        <div className="form-group">
          <label htmlFor="comentario">Comentario (opcional):</label>
          <textarea
            id="comentario"
            value={comentario}
            onChange={e => setComentario(e.target.value)}
            placeholder="Agregar comentario sobre el cambio de estado..."
            rows={3}
            disabled={disabled || isLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Mensajes de error */}
      {error && (
        <div className="error-message">
          <AlertTriangle size={16} />
          <span>{error.message || 'Error al procesar el cambio de estado'}</span>
        </div>
      )}

      {/* Mensaje de éxito */}
      {isSuccess && (
        <div className="success-message">
          <CheckCircle size={16} />
          <span>Estado cambiado exitosamente</span>
        </div>
      )}

      {/* Confirmación */}
      {showConfirmation && estadoSeleccionadoInfo && (
        <div className="confirmation-section">
          <div className="confirmation-message">
            <AlertTriangle size={16} />
            <span>¿Confirmar cambio de estado a &quot;{estadoSeleccionadoInfo.estado}&quot;?</span>
          </div>
        </div>
      )}

      {/* Botones de acción */}
      <div className="acciones-section">
        {showConfirmation ? (
          <div className="confirmation-buttons">
            <Button
              variant="primary"
              size={buttonSize}
              onClick={handleCambiarEstado}
              disabled={disabled || isLoading}
              loading={cambiandoEstado}
            >
              <CheckCircle size={16} />
              Confirmar
            </Button>
            <Button
              variant="secondary"
              size={buttonSize}
              onClick={() => setShowConfirmation(false)}
              disabled={disabled || isLoading}
            >
              <XCircle size={16} />
              Cancelar
            </Button>
          </div>
        ) : (
          <div className="action-buttons">
            <Button
              variant="primary"
              size={buttonSize}
              onClick={handleConfirmar}
              disabled={disabled || !estadoSeleccionado || isLoading}
              loading={isLoading}
            >
              {variant === 'modal' ? 'Cambiar Estado' : 'Siguiente'}
            </Button>
            {onCancel && (
              <Button
                variant="secondary"
                size={buttonSize}
                onClick={onCancel}
                disabled={disabled || isLoading}
              >
                Cancelar
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Componente simplificado para cambio rápido de estado
 */
interface CambioRapidoEstadoProps {
  entidad: EntidadTipo
  itemId: number
  estadoActual?: DimEstado | null
  onEstadoCambiado?: (nuevoEstado: DimEstado) => void
  disabled?: boolean
}

export const CambioRapidoEstado: React.FC<CambioRapidoEstadoProps> = props => {
  return <CambiarEstado {...props} variant="dropdown" size="small" />
}

export default CambiarEstado
