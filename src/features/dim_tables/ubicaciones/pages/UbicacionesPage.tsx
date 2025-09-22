import { SearchFilter } from '@/shared/components/organisms/Filters/FilterComponents'
import { FilterContainer } from '@/shared/components/organisms/Filters/FilterContainer'
import { ListPage } from '@/shared/components/organisms/ListPage'
import { useUbicaciones } from '@/shared/hooks/useDim_tables'
import { useListFilters } from '@/shared/hooks/useListFilters'
import { Ubicacion } from '@/shared/interfaces/dim_tables.types'
import { createMultiFieldSearchFilter } from '@/shared/utils/filterUtils'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { UbicacionCard } from '../components/UbicacionCard'

export const UbicacionesPage = () => {
  const { data: ubicaciones, isLoading, error, refetch } = useUbicaciones()

  const navigate = useNavigate()
  const filterConfig = useMemo(
    () => ({
      busqueda: {
        type: 'search' as const,
        defaultValue: '',
        filterFn: createMultiFieldSearchFilter<Ubicacion>(ubicacion => [
          ubicacion.codigo,
          ubicacion.ubicacion
        ])
      }
    }),
    []
  )

  const {
    filters,
    filteredItems: ubicacionesFiltradas,
    hasActiveFilters,
    updateFilter,
    clearFilters
  } = useListFilters<Ubicacion>(ubicaciones || [], filterConfig)

  const handlers = {
    onNew: () => navigate('/ubicaciones/nueva')
  }

  const renderFilters = () => (
    <FilterContainer onClear={clearFilters} hasActiveFilters={hasActiveFilters}>
      <SearchFilter
        label="Búsqueda"
        value={filters.busqueda as string}
        onChange={value => updateFilter('busqueda', value)}
        placeholder="Buscar por código, ubicación..."
        className="min-w-[300px]"
      />
    </FilterContainer>
  )

  return (
    <ListPage
      title="Gestión de Ubicaciones"
      data={{
        items: ubicacionesFiltradas,
        isLoading,
        error,
        refetch
      }}
      handlers={handlers}
      renderFilters={renderFilters}
      config={{
        newButtonText: 'Nueva ubicación',
        emptyStateMessage: 'No hay ubicaciones disponibles'
      }}
    >
      <div className="grid gap-1">
        {ubicacionesFiltradas.map((ubicacion: Ubicacion) => (
          <UbicacionCard
            key={ubicacion.id}
            ubicacion={ubicacion}
            onEdit={() => navigate(`/ubicaciones/${ubicacion.id}/editar`)}
            onDelete={() => {
              /* handle delete */
            }}
          />
        ))}
      </div>
    </ListPage>
  )
}
