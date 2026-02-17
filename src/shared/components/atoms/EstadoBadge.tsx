/**
 * Componente Badge para mostrar estados de manera consistente
 * Ahora usa DimEstado del backend para información completa de estados
 */

import React from 'react'
import * as Icons from 'lucide-react'
import { type DimEstado } from '../../interfaces/estados.types'

// ================================
// TIPOS
// ================================

interface EstadoBadgeProps {
  estado: DimEstado
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
  showTooltip?: boolean
  className?: string
  onClick?: () => void
}

// Estados con clase CSS definida en estados.css
const KNOWN_CSS_ESTADOS = new Set([
  'registrada', 'pendiente', 'recibida', 'en_proceso',
  'completada', 'completada_tec', 'rechazada', 'cancelada',
  'cancelada_tec', 'en_procesamiento', 'bloqueada'
])

// ================================
// COMPONENTE PRINCIPAL
// ================================

export const EstadoBadge: React.FC<EstadoBadgeProps> = ({
  estado,
  size = 'md',
  showIcon = true,
  showTooltip = true,
  className = '',
  onClick
}) => {
  // Slug para la clase CSS: minúsculas y espacios → guión bajo
  const slug = estado.estado.toLowerCase().replace(/[\s-]+/g, '_')
  const hasCssEstado = KNOWN_CSS_ESTADOS.has(slug)

  // Mapeo de tamaños
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5'
  }

  const getBadgeClasses = () => {
    const base = 'inline-flex items-center gap-1 rounded-full font-medium transition-colors'
    const sizeClass = sizeClasses[size]
    // Clase de color de estados.css (estado-registrada, estado-completada, etc.)
    const colorClass = `estado-${slug}`
    // Fallback Tailwind solo cuando no hay clase CSS ni color de API
    const fallback = !hasCssEstado && !estado.color ? 'bg-gray-100 text-gray-800' : ''
    return [base, sizeClass, colorClass, fallback].filter(Boolean).join(' ')
  }

  // Obtener el icono dinámicamente basado en el estado
  const getIconComponent = () => {
    if (!showIcon) return null
    if (estado.es_final) return Icons.CheckCircle
    if (estado.es_inicial) return Icons.Clock
    return Icons.PlayCircle
  }

  const IconComponent = getIconComponent()
  const iconSize = size === 'sm' ? 12 : size === 'lg' ? 16 : 14

  // Inline style solo como fallback para estados sin clase CSS definida
  const inlineStyle =
    !hasCssEstado && estado.color
      ? { backgroundColor: `${estado.color}20`, color: estado.color }
      : undefined

  const badgeElement = (
    <span
      className={`${getBadgeClasses()} ${onClick ? 'cursor-pointer hover:opacity-80' : ''} ${className}`}
      style={inlineStyle}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {IconComponent && <IconComponent size={iconSize} />}
      {estado.estado}
    </span>
  )

  // Envolver en tooltip si se requiere
  if (showTooltip && estado.descripcion) {
    return (
      <div className="relative group">
        {badgeElement}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
          {estado.descripcion}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
        </div>
      </div>
    )
  }

  return badgeElement
}

// ================================
// VARIANTES ESPECIALIZADAS
// ================================

/**
 * Badge específico para solicitudes
 * @deprecated Usar EstadoBadge directamente con estadoInfo
 */
export const SolicitudBadge: React.FC<Omit<EstadoBadgeProps, 'estado'> & { estado: DimEstado }> = ({
  estado,
  ...props
}) => {
  return <EstadoBadge estado={estado} {...props} />
}

/**
 * Badge específico para técnicas
 * @deprecated Usar EstadoBadge directamente con estadoInfo
 */
export const TecnicaBadge: React.FC<Omit<EstadoBadgeProps, 'estado'> & { estado: DimEstado }> = ({
  estado,
  ...props
}) => {
  return <EstadoBadge estado={estado} {...props} />
}

/**
 * Badge con orden/prioridad
 */
export const PriorityBadge: React.FC<EstadoBadgeProps & { showOrder?: boolean }> = ({
  estado,
  showOrder = false,
  ...props
}) => {
  return (
    <div className="flex items-center gap-2">
      <EstadoBadge estado={estado} {...props} />
      {showOrder && estado.orden && <span className="text-xs text-gray-500">#{estado.orden}</span>}
    </div>
  )
}

export default EstadoBadge
