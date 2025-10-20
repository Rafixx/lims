import { FilterContainer } from '@/shared/components/organisms/Filters/FilterContainer'
import {
  SelectFilter,
  ToggleFilter,
  SearchFilter
} from '@/shared/components/organisms/Filters/FilterComponents'
import { Calendar } from 'lucide-react'
import { useEstados } from '@/shared/hooks/useEstados'
import { useMemo } from 'react'

interface MuestraFilterProps {
  filters: {
    busqueda: string
    id_estado: number | null
    soloHoy: boolean
  }
  onFilterChange: (key: string, value: string | boolean | number | null) => void
  onClearFilters: () => void
  hasActiveFilters: boolean
}

export const MuestraFilter = ({
  filters,
  onFilterChange,
  onClearFilters,
  hasActiveFilters
}: MuestraFilterProps) => {
  // Obtener estados desde el backend
  const { data: estados, isLoading: estadosLoading } = useEstados('MUESTRA')

  // Generar opciones para el selector de estados
  const estadoOptions = useMemo(() => {
    if (!estados) return []
    return estados
      .filter(e => e.activo) // Solo mostrar estados activos
      .sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0)) // Ordenar por el campo orden
      .map(estado => ({
        value: String(estado.id), // SelectFilter espera string
        label: estado.estado
      }))
  }, [estados])

  return (
    <FilterContainer onClear={onClearFilters} hasActiveFilters={hasActiveFilters}>
      <SearchFilter
        label="Búsqueda"
        value={filters.busqueda}
        onChange={value => onFilterChange('busqueda', value)}
        placeholder="Buscar por código, cliente, paciente..."
        className="min-w-[200px]"
      />

      <SelectFilter
        label="Estado"
        value={filters.id_estado ? String(filters.id_estado) : ''}
        onChange={value => onFilterChange('id_estado', value ? Number(value) : null)}
        options={estadoOptions}
        disabled={estadosLoading}
      />

      <ToggleFilter
        label="Solo Hoy"
        active={filters.soloHoy}
        onChange={active => onFilterChange('soloHoy', active)}
        icon={<Calendar className="w-4 h-4" />}
      />
    </FilterContainer>
  )
}
