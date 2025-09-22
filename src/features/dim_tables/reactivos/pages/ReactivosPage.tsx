import { SearchFilter } from '@/shared/components/organisms/Filters/FilterComponents'
import { FilterContainer } from '@/shared/components/organisms/Filters/FilterContainer'
import { ListPage } from '@/shared/components/organisms/ListPage'
import { useReactivos } from '@/shared/hooks/useDim_tables'
import { useListFilters } from '@/shared/hooks/useListFilters'
import { Reactivo } from '@/shared/interfaces/dim_tables.types'
import { createMultiFieldSearchFilter } from '@/shared/utils/filterUtils'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ReactivoCard } from '../components/ReactivoCard'

export const ReactivosPage = () => {
  const { data: reactivos, isLoading, error, refetch } = useReactivos()

  const navigate = useNavigate()
  const filterConfig = useMemo(
    () => ({
      busqueda: {
        type: 'search' as const,
        defaultValue: '',
        filterFn: createMultiFieldSearchFilter<Reactivo>(reactivo => [
          reactivo.num_referencia,
          reactivo.reactivo,
          reactivo.lote,
          reactivo.volumen_formula
        ])
      }
    }),
    []
  )

  const {
    filters,
    filteredItems: reactivosFiltrados,
    hasActiveFilters,
    updateFilter,
    clearFilters
  } = useListFilters<Reactivo>(reactivos || [], filterConfig)

  const handlers = {
    onNew: () => navigate('/reactivos/nuevo')
  }

  const renderFilters = () => (
    <FilterContainer onClear={clearFilters} hasActiveFilters={hasActiveFilters}>
      <SearchFilter
        label="Búsqueda"
        value={filters.busqueda as string}
        onChange={value => updateFilter('busqueda', value)}
        placeholder="Buscar por referencia, reactivo, lote..."
        className="min-w-[300px]"
      />
    </FilterContainer>
  )

  return (
    <ListPage
      title="Gestión de Reactivos"
      data={{
        items: reactivosFiltrados,
        isLoading,
        error,
        refetch
      }}
      handlers={handlers}
      renderFilters={renderFilters}
      config={{
        newButtonText: 'Nuevo reactivo',
        emptyStateMessage: 'No hay reactivos disponibles'
      }}
    >
      <div className="grid gap-1">
        {reactivosFiltrados.map((reactivo: Reactivo) => (
          <ReactivoCard
            key={reactivo.id}
            reactivo={reactivo}
            onEdit={() => navigate(`/reactivos/${reactivo.id}/editar`)}
            onDelete={() => {
              /* handle delete */
            }}
          />
        ))}
      </div>
    </ListPage>
  )
}
