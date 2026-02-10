import { useState } from 'react'
import { RefreshCw, Calendar, Plus, ArrowLeft, Filter } from 'lucide-react'
import { Button } from '@/shared/components/molecules/Button'
import { Link } from 'react-router-dom'

interface ListPageProps {
  title: string
  subtitle?: string

  data: {
    items: unknown[]
    total?: number
    filtered?: number
    isLoading: boolean
    error?: unknown
    refetch: () => void
  }

  handlers?: {
    onNew?: () => void
    onSecondaryAction?: () => void
    onRefresh?: () => void
  }

  renderStats?: () => React.ReactNode
  renderFilters?: () => React.ReactNode
  renderActions?: () => React.ReactNode
  customActions?: React.ReactNode

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
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-6 w-32 bg-surface-200 rounded" />
        <div className="h-8 w-64 bg-surface-200 rounded" />
        <div className="h-4 w-48 bg-surface-200 rounded" />
        <div className="space-y-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-10 bg-surface-100 rounded border border-surface-200" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap gap-4 justify-between items-start">
        <div className="min-w-0">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-surface-600 hover:text-primary-600 transition-colors mb-3 text-sm"
          >
            <ArrowLeft className="w-4 h-4 flex-shrink-0" />
            <span>Volver a Inicio</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-surface-900 mb-1">{title}</h1>
          {subtitle && <p className="text-surface-600 text-sm">{subtitle}</p>}
          <p className="text-surface-500 text-sm mt-1">
            {data.filtered ?? data.items.length} de {data.total ?? data.items.length} elementos
            {data.filtered !== undefined &&
              data.filtered < (data.total ?? data.items.length) &&
              ` · ${(data.total ?? data.items.length) - data.filtered} filtrados`}
          </p>
        </div>

        {/* Acciones — hacen wrap en móvil */}
        <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
          {renderActions && renderActions()}

          {showRefreshButton && (
            <Button
              onClick={handlers?.onRefresh || data.refetch}
              variant="secondary"
              disabled={data.isLoading}
            >
              <RefreshCw className={`w-4 h-4 ${data.isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Actualizar</span>
            </Button>
          )}

          {customActions}

          {!hideNewButton && handlers?.onNew && (
            <>
              <Button onClick={handlers.onNew} variant="primary">
                <Plus className="w-4 h-4" />
                <span className="hidden xs:inline">{newButtonText}</span>
              </Button>
              {config.secondaryActionText &&
                config.secondaryActionIcon &&
                handlers.onSecondaryAction && (
                  <Button onClick={handlers.onSecondaryAction} variant="primary">
                    {config.secondaryActionIcon}
                    <span className="hidden sm:inline">{config.secondaryActionText}</span>
                  </Button>
                )}
            </>
          )}
        </div>
      </div>

      {/* Barra de toggles para stats y filtros */}
      {(renderStats || renderFilters) && (
        <div className="flex flex-wrap gap-2">
          {renderStats && showStatsToggle && (
            <Button
              onClick={() => setShowStats(!showStats)}
              variant="ghost"
              className="flex items-center gap-2 text-sm"
            >
              <Calendar className="w-4 h-4" />
              {showStats ? 'Ocultar estadísticas' : 'Ver estadísticas'}
            </Button>
          )}
          {renderFilters && showFilterToggle && (
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="ghost"
              className="flex items-center gap-2 text-sm"
            >
              <Filter className="w-4 h-4" />
              {showFilters ? 'Ocultar filtros' : 'Mostrar filtros'}
            </Button>
          )}
        </div>
      )}

      {/* Stats */}
      {renderStats && (showStats || !showStatsToggle) && (
        <div className="animate-fade-in">{renderStats()}</div>
      )}

      {/* Filtros */}
      {renderFilters && (showFilters || !showFilterToggle) && (
        <div className="bg-white p-4 rounded-lg shadow-soft border border-surface-200 animate-fade-in">
          {renderFilters()}
        </div>
      )}

      {/* Contenido principal */}
      <div>
        {data.items.length > 0 ? (
          children
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-12 h-12 rounded-full bg-surface-100 flex items-center justify-center mb-3">
              <span className="text-surface-400 text-xl">·</span>
            </div>
            <p className="text-surface-500 text-sm">{emptyStateMessage}</p>
          </div>
        )}
      </div>
    </div>
  )
}
