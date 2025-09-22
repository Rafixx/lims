import { Filter, X } from 'lucide-react'

// src/shared/components/organisms/Filters/FilterContainer.tsx
interface FilterContainerProps {
  children: React.ReactNode
  title?: {
    activate?: string
    deactivate?: string
  }
  onClear?: () => void
  hasActiveFilters?: boolean
  className?: string
}

export const FilterContainer = ({
  children,
  // title = 'Filtros',
  title = { activate: 'Filtros activos', deactivate: 'Filtros' },
  onClear,
  hasActiveFilters = false,
  className = ''
}: FilterContainerProps) => (
  <div className={`bg-white rounded-lg border border-surface-200 p-4 shadow-soft ${className}`}>
    {/* Header con título y botón limpiar */}
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-surface-500" />
        {hasActiveFilters ? (
          // <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
          <span className="text-sm font-semibold text-primary-700">{title.activate}</span>
        ) : (
          <span className="text-sm font-semibold text-surface-700">{title.deactivate}</span>
        )}
      </div>

      {/* Botón siempre presente pero invisible cuando no hay filtros activos */}
      <span
        onClick={hasActiveFilters && onClear ? onClear : undefined}
        className={`flex items-center gap-1 px-3 py-1.5 text-xs transition-all duration-200 ${
          hasActiveFilters && onClear
            ? 'text-danger-600 hover:bg-danger-50 hover:text-danger-700 cursor-pointer visible opacity-100'
            : 'text-transparent cursor-default invisible opacity-0'
        }`}
      >
        <X className="w-3 h-3" />
        Limpiar filtros
      </span>
    </div>

    {/* Filtros en grid responsivo */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-end">
      {children}
    </div>
  </div>
)
