import { SearchFilter } from '@/shared/components/organisms/Filters/FilterComponents'
import { FilterContainer } from '@/shared/components/organisms/Filters/FilterContainer'
import { ListPage } from '@/shared/components/organisms/ListPage'
import { useCentros } from '@/shared/hooks/useDim_tables'
import { useListFilters } from '@/shared/hooks/useListFilters'
import { Centro, Prueba } from '@/shared/interfaces/dim_tables.types'
import { createMultiFieldSearchFilter } from '@/shared/utils/filterUtils'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { CentroCard } from '../components/CentroCard'

export const CentrosPage = () => {
  const { data: centros, isLoading, error, refetch } = useCentros()

  const navigate = useNavigate()
  const filterConfig = useMemo(
    () => ({
      busqueda: {
        type: 'search' as const,
        defaultValue: '',
        filterFn: createMultiFieldSearchFilter<Centro>(centro => [
          centro.codigo,
          centro.descripcion
        ])
      }
    }),
    []
  )

  const {
    filters,
    filteredItems: centrosFiltrados,
    hasActiveFilters,
    updateFilter,
    clearFilters
  } = useListFilters<Centro>(centros || [], filterConfig)

  const handlers = {
    onNew: () => navigate('/Centro/nueva')
  }

  const renderFilters = () => (
    <FilterContainer onClear={clearFilters} hasActiveFilters={hasActiveFilters}>
      <SearchFilter
        label="Búsqueda"
        value={filters.busqueda as string}
        onChange={value => updateFilter('busqueda', value)}
        placeholder="Buscar por código, prueba..."
        className="min-w-[300px]"
      />
    </FilterContainer>
  )
  return (
    <ListPage
      title="Gestión de Centro"
      data={{
        items: centrosFiltrados,
        isLoading,
        error,
        refetch
      }}
      handlers={handlers}
      renderFilters={renderFilters}
      config={{
        newButtonText: 'Nueva prueba',
        emptyStateMessage: 'No hay Centro disponibles'
      }}
    >
      <div className="grid gap-1">
        {centrosFiltrados.map((centro: Centro) => (
          <CentroCard
            key={centro.id}
            centro={centro}
            onEdit={c => navigate(`/Centro/${centro.id}/editar`)}
            onDelete={() => {
              /* handle delete */
            }}
          />
        ))}
      </div>
    </ListPage>
  )
}
