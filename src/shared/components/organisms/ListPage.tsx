import { useState } from 'react'
import { RefreshCw, Calendar, Plus, ArrowLeft, Filter } from 'lucide-react'
import { Button } from '@/shared/components/molecules/Button'
import { Link } from 'react-router-dom'

interface ListPageProps {
  title: string
  subtitle?: string

  // Data y loading states
  data: {
    items: unknown[]
    total?: number
    filtered?: number
    isLoading: boolean
    error?: unknown
    refetch: () => void
  }

  // Handlers principales
  handlers?: {
    onNew?: () => void
    onSecondaryAction?: () => void
    onRefresh?: () => void
  }

  // Render slots (máxima flexibilidad)
  renderStats?: () => React.ReactNode
  renderFilters?: () => React.ReactNode
  renderActions?: () => React.ReactNode
  customActions?: React.ReactNode

  // Configuración de comportamiento
  config?: {
    showStatsToggle?: boolean
    showFilterToggle?: boolean
    showRefreshButton?: boolean
    newButtonText?: string
    secondaryActionText?: string
    secondaryActionIcon?: React.ReactNode
    emptyStateMessage?: string
    hideNewButton?: boolean
  }

  // Contenido principal
  children: React.ReactNode
}

export const ListPage = ({
  title,
  subtitle,
  data,
  handlers,
  renderStats,
  renderFilters,
  renderActions,
  customActions,
  config = {},
  children
}: ListPageProps) => {
  const [showStats, setShowStats] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const {
    showStatsToggle = true,
    showFilterToggle = true,
    showRefreshButton = true,
    newButtonText = 'Nuevo',
    emptyStateMessage = 'No hay elementos disponibles',
    hideNewButton = false
  } = config

  if (data.isLoading) {
    return <span>Cargando...</span>
    // <LoadingSkeleton title={title} />
  }

  return (
    <div className="space-y-8 ">
      {/* Header con navegación */}
      <div className="flex justify-between items-center">
        <div>
          {/* Header */}
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-surface-600 hover:text-primary-600 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a Inicio</span>
          </Link>
          <h1 className="text-3xl font-bold text-surface-900 mb-2">{title}</h1>
          {subtitle && <p className="text-surface-600">{subtitle}</p>}
          <p className="text-surface-600 mt-1">
            {data.filtered ?? data.items.length} de {data.total ?? data.items.length} elementos
            {data.filtered !== undefined &&
              data.filtered < (data.total ?? data.items.length) &&
              ` (${(data.total ?? data.items.length) - data.filtered} filtrados)`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Acciones personalizadas */}
          {renderActions && renderActions()}

          {/* Botón refrescar */}
          {showRefreshButton && (
            <Button
              onClick={handlers?.onRefresh || data.refetch}
              variant="secondary"
              disabled={data.isLoading}
            >
              <RefreshCw className={`w-4 h-4 ${data.isLoading ? 'animate-spin' : ''}`} />
              Actualizar
            </Button>
          )}

          {/* Acciones personalizadas adicionales */}
          {customActions}

          {/* Botón nuevo */}
          {!hideNewButton && handlers?.onNew && (
            <div className="flex items-center gap-2">
              <Button onClick={handlers.onNew} variant="primary">
                <Plus className="w-4 h-4" />
                {newButtonText}
              </Button>
              {config.secondaryActionText &&
                config.secondaryActionIcon &&
                handlers.onSecondaryAction && (
                  <Button onClick={handlers.onSecondaryAction} variant="primary">
                    {config.secondaryActionIcon}
                    {config.secondaryActionText}
                  </Button>
                )}
            </div>
          )}
        </div>
      </div>

      {/* Stats Section */}
      {renderStats && (
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            {/* Stats Content */}
            {(showStats || !showStatsToggle) && (
              <div className="flex-1 animate-in slide-in-from-left-2 duration-300">
                {renderStats()}
              </div>
            )}

            {/* Toggle Button */}
            {showStatsToggle && (
              <div className="flex-shrink-0">
                <Button
                  onClick={() => setShowStats(!showStats)}
                  variant="ghost"
                  className="flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  {showStats ? 'Ocultar estadísticas' : 'Ver estadísticas'}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Filters Section */}
      {renderFilters && (
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            {/* Filters Content */}
            {(showFilters || !showFilterToggle) && (
              <div className="flex-1 animate-in slide-in-from-left-2 duration-300 bg-white p-4 rounded-lg shadow border">
                {renderFilters()}
              </div>
            )}

            {/* Toggle Button */}
            {showFilterToggle && (
              <div className="flex-shrink-0">
                <Button
                  onClick={() => setShowFilters(!showFilters)}
                  variant="ghost"
                  className="flex items-center gap-2"
                >
                  <Filter className="w-4 h-4" />
                  {showFilters ? 'Ocultar filtros' : 'Mostrar filtros'}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="space-y-4">
        {
          data.items.length > 0 ? children : <span>{emptyStateMessage}</span>
          // <EmptyState message={emptyStateMessage} />
        }
      </div>
    </div>
  )
}
