/**
 * Componente para mostrar indicadores de estado visuales
 * Basado en la nueva API de gestión de estados
 */

import React from 'react'
import type { DimEstado } from '../../interfaces/estados.types'

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
  const stateClasses = `estado-${estado.estado.toLowerCase()}`
  const finalClasses = [baseClasses, stateClasses, className].filter(Boolean).join(' ')

  const style: React.CSSProperties = {
    backgroundColor,
    color: textColor,
    borderColor: backgroundColor
  }

  return (
    <span
      className={finalClasses}
      style={style}
      title={estado.descripcion}
      data-estado={estado.estado}
      data-entidad={estado.entidad}
    >
      <span className="estado-text">{estado.estado}</span>
      {showDescription && estado.descripcion && (
        <span className="estado-description">({estado.descripcion})</span>
      )}
      {estado.es_final && <span className="estado-final-indicator">●</span>}
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
    const r = parseInt(hexColor.slice(1, 3), 16)
    const g = parseInt(hexColor.slice(3, 5), 16)
    const b = parseInt(hexColor.slice(5, 7), 16)

    // Calcular luminancia
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255

    return luminance > 0.5 ? '#000000' : '#ffffff'
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
          >
            <IndicadorEstado estado={estado} size={size} variant={variant} showDescription />
            {estado.es_inicial && <span className="estado-inicial-badge">Inicial</span>}
            {estado.es_final && <span className="estado-final-badge">Final</span>}
          </div>
        )
      })}
    </div>
  )
}

export default IndicadorEstado
