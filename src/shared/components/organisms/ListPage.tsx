import { useState } from 'react'
import { RefreshCw, Calendar, Plus } from 'lucide-react'
import { Button } from '@/shared/components/molecules/Button'

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
  handlers: {
    onNew: () => void
    onRefresh?: () => void
  }

  // Render slots (máxima flexibilidad)
  renderStats?: () => React.ReactNode
  renderFilters?: () => React.ReactNode
  renderActions?: () => React.ReactNode

  // Configuración de comportamiento
  config?: {
    showStatsToggle?: boolean
    showRefreshButton?: boolean
    newButtonText?: string
    emptyStateMessage?: string
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
  config = {},
  children
}: ListPageProps) => {
  const [showStats, setShowStats] = useState(false)

  const {
    showStatsToggle = true,
    showRefreshButton = true,
    newButtonText = 'Nuevo',
    emptyStateMessage = 'No hay elementos disponibles'
  } = config

  if (data.isLoading) {
    return <span>Cargando...</span>
    // <LoadingSkeleton title={title} />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">{title}</h1>
          {subtitle && <p className="text-surface-600 mt-1">{subtitle}</p>}
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
              onClick={handlers.onRefresh || data.refetch}
              variant="primary"
              disabled={data.isLoading}
            >
              <RefreshCw className={`w-4 h-4 ${data.isLoading ? 'animate-spin' : ''}`} />
              Actualizar
            </Button>
          )}

          {/* Botón nuevo */}
          <Button onClick={handlers.onNew} variant="accent">
            <Plus className="w-4 h-4" />
            {newButtonText}
          </Button>
        </div>
      </div>

      {/* Stats Section */}
      {renderStats && (
        <div className="space-y-4">
          {showStatsToggle && (
            <div className="flex justify-end">
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

          {(showStats || !showStatsToggle) && (
            <div className="animate-in slide-in-from-top-2 duration-300">{renderStats()}</div>
          )}
        </div>
      )}

      {/* Filters Section */}
      {renderFilters && (
        <div className="bg-white p-4 rounded-lg shadow border">{renderFilters()}</div>
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
