import { Search, X } from 'lucide-react'
import { useCentros } from '@/shared/hooks/useDim_tables'

type ExternalizacionFilterProps = {
  filters: {
    busqueda: string
    id_centro: number | null
    id_estado: number | null
    mayorCincoDias: boolean
  }
  onFilterChange: (key: string, value: string | number | boolean | null) => void
  onClearFilters: () => void
  hasActiveFilters: boolean
}

export const ExternalizacionFilter = ({
  filters,
  onFilterChange,
  onClearFilters,
  hasActiveFilters
}: ExternalizacionFilterProps) => {
  const { data: centros = [] } = useCentros()

  return (
    <div className="space-y-4">
      {/* Búsqueda general */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
        <input
          type="text"
          placeholder="Buscar por código, técnica, agencia, servicio..."
          value={filters.busqueda}
          onChange={e => onFilterChange('busqueda', e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      {/* Filtros rápidos por estado */}
      <div className="flex flex-wrap gap-3">
        {/* Filtro rápido: EXTERNALIZADA (16) */}
        <button
          onClick={() => onFilterChange('id_estado', filters.id_estado === 16 ? null : 16)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filters.id_estado === 16
              ? 'bg-info-500 text-white'
              : 'bg-surface-100 text-surface-700 hover:bg-surface-200'
          }`}
          title="Técnica marcada para el proceso de externalización"
        >
          EXTERNALIZADA
        </button>

        {/* Filtro rápido: ENVIADA_EXT (17) */}
        <button
          onClick={() => onFilterChange('id_estado', filters.id_estado === 17 ? null : 17)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filters.id_estado === 17
              ? 'bg-warning-500 text-white'
              : 'bg-surface-100 text-surface-700 hover:bg-surface-200'
          }`}
          title="Enviada a laboratorio externo"
        >
          ENVIADA
        </button>

        {/* Filtro rápido: RECIBIDA_EXT (18) */}
        <button
          onClick={() => onFilterChange('id_estado', filters.id_estado === 18 ? null : 18)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filters.id_estado === 18
              ? 'bg-success-500 text-white'
              : 'bg-surface-100 text-surface-700 hover:bg-surface-200'
          }`}
          title="Recibida desde laboratorio externo"
        >
          RECIBIDA
        </button>

        {/* Filtro rápido: > 5 días */}
        <button
          onClick={() => onFilterChange('mayorCincoDias', !filters.mayorCincoDias)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filters.mayorCincoDias
              ? 'bg-danger-500 text-white'
              : 'bg-surface-100 text-surface-700 hover:bg-surface-200'
          }`}
        >
          &gt; 5 días
        </button>

        {/* Selector de centro */}
        <select
          value={filters.id_centro ?? ''}
          onChange={e => onFilterChange('id_centro', e.target.value ? Number(e.target.value) : null)}
          className="px-4 py-2 border border-surface-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="">Todos los centros</option>
          {centros.map((centro: { id: number; codigo: string; descripcion?: string }) => (
            <option key={centro.id} value={centro.id}>
              {centro.descripcion || centro.codigo}
            </option>
          ))}
        </select>

        {/* Botón de limpiar filtros */}
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="flex items-center gap-2 px-4 py-2 bg-danger-50 text-danger-600 rounded-lg text-sm font-medium hover:bg-danger-100 transition-colors"
          >
            <X className="w-4 h-4" />
            Limpiar filtros
          </button>
        )}
      </div>
    </div>
  )
}
