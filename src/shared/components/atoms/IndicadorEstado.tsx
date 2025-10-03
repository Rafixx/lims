/**
 * Componente para mostrar indicadores de estado visuales
 * Basado en la nueva API de gestión de estados
 */

import React from 'react'
import type { DimEstado } from '../../interfaces/estados.types'
import '../../styles/estados.css'

interface IndicadorEstadoProps {
  estado?: DimEstado | null
  size?: 'small' | 'medium' | 'large'
  variant?: 'badge' | 'pill' | 'outline'
  showDescription?: boolean
  className?: string
}

export const IndicadorEstado: React.FC<IndicadorEstadoProps> = ({
  estado,
  size = 'medium',
  variant = 'badge',
  showDescription = false,
  className = ''
}) => {
  if (!estado) {
    return (
      <span className={`estado-indicator sin-estado ${size} ${variant} ${className}`}>
        Sin estado
      </span>
    )
  }

  const backgroundColor = estado.color || '#6b7280'
  const textColor = getContrastColor(backgroundColor)

  const baseClasses = `estado-indicator ${size} ${variant}`
  const stateClasses = `estado-${estado.estado.toLowerCase().replace(/_/g, '-')}`
  const finalClasses = [baseClasses, stateClasses, className].filter(Boolean).join(' ')

  const style: React.CSSProperties = {
    backgroundColor,
    color: textColor,
    borderColor: variant === 'outline' ? backgroundColor : undefined
  }

  return (
    <span
      className={finalClasses}
      style={style}
      title={estado.descripcion}
      data-estado={estado.estado}
      data-entidad={estado.entidad}
    >
      <span className="estado-text">{estado.estado.replace(/_/g, ' ')}</span>
      {showDescription && estado.descripcion && (
        <span className="estado-description ml-1">({estado.descripcion})</span>
      )}
      {estado.es_final && <span className="estado-final-indicator ml-1">●</span>}
    </span>
  )
}

/**
 * Función auxiliar para obtener color de texto contrastante
 */
function getContrastColor(hexColor: string): string {
  // Si no es un color hex válido, usar negro por defecto
  if (!hexColor || !hexColor.startsWith('#')) {
    return '#000000'
  }

  try {
    // Remover el # y parsear los componentes RGB
    const hex = hexColor.replace('#', '')
    const r = parseInt(hex.slice(0, 2), 16)
    const g = parseInt(hex.slice(2, 4), 16)
    const b = parseInt(hex.slice(4, 6), 16)

    // Calcular luminancia relativa usando la fórmula WCAG
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255

    // Si la luminancia es mayor a 0.5, usar texto oscuro, sino texto claro
    return luminance > 0.5 ? '#1f2937' : '#ffffff'
  } catch {
    return '#000000'
  }
}

/**
 * Componente específico para estados de muestra
 */
export const IndicadorEstadoMuestra: React.FC<
  Omit<IndicadorEstadoProps, 'estado'> & { estado?: DimEstado | null }
> = ({ estado, ...props }) => {
  if (estado && estado.entidad !== 'MUESTRA') {
    console.warn('IndicadorEstadoMuestra recibió un estado que no es de MUESTRA')
  }

  return <IndicadorEstado estado={estado} {...props} />
}

/**
 * Componente específico para estados de técnica
 */
export const IndicadorEstadoTecnica: React.FC<
  Omit<IndicadorEstadoProps, 'estado'> & { estado?: DimEstado | null }
> = ({ estado, ...props }) => {
  if (estado && estado.entidad !== 'TECNICA') {
    console.warn('IndicadorEstadoTecnica recibió un estado que no es de TECNICA')
  }

  return <IndicadorEstado estado={estado} {...props} />
}

/**
 * Componente para mostrar lista de estados disponibles
 */
interface ListaEstadosProps {
  estados: DimEstado[]
  estadoActual?: number
  onEstadoClick?: (estado: DimEstado) => void
  size?: 'small' | 'medium' | 'large'
  variant?: 'badge' | 'pill' | 'outline'
}

export const ListaEstados: React.FC<ListaEstadosProps> = ({
  estados,
  estadoActual,
  onEstadoClick,
  size = 'medium',
  variant = 'badge'
}) => {
  if (!estados.length) {
    return <div className="lista-estados-empty">No hay estados disponibles</div>
  }

  return (
    <div className="lista-estados">
      {estados.map(estado => {
        const isActive = estadoActual === estado.id
        const isClickable = !!onEstadoClick

        return (
          <div
            key={estado.id}
            className={`lista-estado-item ${isActive ? 'active' : ''} ${
              isClickable ? 'clickable' : ''
            }`}
            onClick={() => onEstadoClick?.(estado)}
            role={isClickable ? 'button' : undefined}
            tabIndex={isClickable ? 0 : undefined}
            onKeyDown={
              isClickable
                ? e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      onEstadoClick?.(estado)
                    }
                  }
                : undefined
            }
          >
            <IndicadorEstado estado={estado} size={size} variant={variant} showDescription />
            <div className="flex gap-2">
              {estado.es_inicial && <span className="estado-inicial-badge">Inicial</span>}
              {estado.es_final && <span className="estado-final-badge">Final</span>}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default IndicadorEstado
