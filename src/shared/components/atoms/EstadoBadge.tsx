/**
 * Componente Badge para mostrar estados de manera consistente
 * Utiliza el sistema centralizado de estados para garantizar uniformidad
 */

import React from 'react'
import * as Icons from 'lucide-react'
import { type AppEstado } from '../../constants/appStates'
import { getEstadoConfig, getEstadoBadgeClasses } from '../../utils/stateHelpers'

// ================================
// TIPOS
// ================================

interface EstadoBadgeProps {
  estado: AppEstado
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
  showTooltip?: boolean
  className?: string
  onClick?: () => void
}

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
  const config = getEstadoConfig(estado)
  const classes = getEstadoBadgeClasses(estado, size)

  // Obtener el icono dinámicamente
  const getIconComponent = () => {
    if (!showIcon || !config.icon) return null

    const iconMap: Record<string, React.ComponentType<{ size?: number }>> = {
      Clock: Icons.Clock,
      PlayCircle: Icons.PlayCircle,
      CheckCircle: Icons.CheckCircle,
      XCircle: Icons.XCircle,
      AlertCircle: Icons.AlertCircle,
      Lock: Icons.Lock,
      Loader2: Icons.Loader2,
      AlertTriangle: Icons.AlertTriangle,
      Inbox: Icons.Inbox,
      Package: Icons.Package,
      Zap: Icons.Zap,
      CheckSquare: Icons.CheckSquare,
      XSquare: Icons.XSquare,
      Calendar: Icons.Calendar,
      UserCheck: Icons.UserCheck,
      UserMinus: Icons.UserMinus,
      UserX: Icons.UserX,
      Shield: Icons.Shield,
      Pause: Icons.Pause
    }

    return iconMap[config.icon] || null
  }

  const IconComponent = getIconComponent()

  const badgeElement = (
    <span
      className={`${classes} ${onClick ? 'cursor-pointer hover:opacity-80' : ''} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {IconComponent && <IconComponent size={size === 'sm' ? 12 : size === 'lg' ? 16 : 14} />}
      {config.label}
    </span>
  )

  // Envolver en tooltip si se requiere
  if (showTooltip && config.description) {
    return (
      <div className="relative group">
        {badgeElement}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
          {config.description}
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
 */
export const SolicitudBadge: React.FC<Omit<EstadoBadgeProps, 'estado'> & { estado: string }> = ({
  estado,
  ...props
}) => {
  return <EstadoBadge estado={estado as AppEstado} {...props} />
}

/**
 * Badge específico para técnicas
 */
export const TecnicaBadge: React.FC<Omit<EstadoBadgeProps, 'estado'> & { estado: string }> = ({
  estado,
  ...props
}) => {
  return <EstadoBadge estado={estado as AppEstado} {...props} />
}

/**
 * Badge con prioridad que cambia de color según urgencia
 */
export const PriorityBadge: React.FC<EstadoBadgeProps & { showPriority?: boolean }> = ({
  estado,
  showPriority = false,
  ...props
}) => {
  const config = getEstadoConfig(estado)

  return (
    <div className="flex items-center gap-2">
      <EstadoBadge estado={estado} {...props} />
      {showPriority && <span className="text-xs text-gray-500">P{config.priority}</span>}
    </div>
  )
}

export default EstadoBadge
