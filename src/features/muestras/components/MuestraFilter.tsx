import { FilterContainer } from '@/shared/components/organisms/Filters/FilterContainer'
import {
  SelectFilter,
  ToggleFilter,
  SearchFilter
} from '@/shared/components/organisms/Filters/FilterComponents'
import { Calendar } from 'lucide-react'
import { APP_STATES } from '@/shared/states'
import { getEstadosByType } from '@/shared/utils/estadoUtils'

interface MuestraFilterProps {
  filters: {
    busqueda: string
    estado: string
    soloHoy: boolean
  }
  onFilterChange: (key: string, value: string | boolean) => void
  onClearFilters: () => void
  hasActiveFilters: boolean
}

export const MuestraFilter = ({
  filters,
  onFilterChange,
  onClearFilters,
  hasActiveFilters
}: MuestraFilterProps) => {
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
        value={filters.estado}
        onChange={value => onFilterChange('estado', value)}
        options={getEstadosByType(APP_STATES.MUESTRA)}
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
