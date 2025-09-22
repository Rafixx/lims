import { SearchFilter } from '@/shared/components/organisms/Filters/FilterComponents'
import { FilterContainer } from '@/shared/components/organisms/Filters/FilterContainer'
import { ListPage } from '@/shared/components/organisms/ListPage'
import { usePruebas } from '@/shared/hooks/useDim_tables'
import { useListFilters } from '@/shared/hooks/useListFilters'
import { Prueba } from '@/shared/interfaces/dim_tables.types'
import { createMultiFieldSearchFilter } from '@/shared/utils/filterUtils'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { PruebasCard } from '../components/PruebasCard'

export const PruebasPage = () => {
  const { data: pruebas, isLoading, error, refetch } = usePruebas()

  const navigate = useNavigate()
  const filterConfig = useMemo(
    () => ({
      busqueda: {
        type: 'search' as const,
        defaultValue: '',
        filterFn: createMultiFieldSearchFilter<Prueba>(prueba => [prueba.cod_prueba, prueba.prueba])
      }
    }),
    []
  )

  const {
    filters,
    filteredItems: pruebasFiltradas,
    hasActiveFilters,
    updateFilter,
    clearFilters
  } = useListFilters<Prueba>(pruebas || [], filterConfig)

  const handlers = {
    onNew: () => navigate('/pruebas/nueva')
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
      title="Gestión de pruebas"
      data={{
        items: pruebasFiltradas,
        isLoading,
        error,
        refetch
      }}
      handlers={handlers}
      renderFilters={renderFilters}
      config={{
        newButtonText: 'Nueva prueba',
        emptyStateMessage: 'No hay pruebas disponibles'
      }}
    >
      <div className="grid gap-1">
        {pruebasFiltradas.map((prueba: Prueba) => (
          <PruebasCard
            key={prueba.id}
            prueba={prueba}
            onEdit={m => navigate(`/pruebas/${prueba.id}/editar`)}
            onDelete={() => {
              /* handle delete */
            }}
          />
        ))}
      </div>
    </ListPage>
  )
}
