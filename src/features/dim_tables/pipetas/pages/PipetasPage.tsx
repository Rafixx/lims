import { SearchFilter } from '@/shared/components/organisms/Filters/FilterComponents'
import { FilterContainer } from '@/shared/components/organisms/Filters/FilterContainer'
import { ListPage } from '@/shared/components/organisms/ListPage'
import { usePipetas } from '@/shared/hooks/useDim_tables'
import { useListFilters } from '@/shared/hooks/useListFilters'
import { Pipeta } from '@/shared/interfaces/dim_tables.types'
import { createMultiFieldSearchFilter } from '@/shared/utils/filterUtils'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { PipetaCard } from '../components/PipetaCard'

export const PipetasPage = () => {
  const { data: pipetas, isLoading, error, refetch } = usePipetas()

  const navigate = useNavigate()
  const filterConfig = useMemo(
    () => ({
      busqueda: {
        type: 'search' as const,
        defaultValue: '',
        filterFn: createMultiFieldSearchFilter<Pipeta>(pipeta => [
          pipeta.codigo,
          pipeta.modelo,
          pipeta.zona
        ])
      }
    }),
    []
  )

  const {
    filters,
    filteredItems: pipetasFiltradas,
    hasActiveFilters,
    updateFilter,
    clearFilters
  } = useListFilters<Pipeta>(pipetas || [], filterConfig)

  const handlers = {
    onNew: () => navigate('/pipetas/nueva')
  }

  const renderFilters = () => (
    <FilterContainer onClear={clearFilters} hasActiveFilters={hasActiveFilters}>
      <SearchFilter
        label="Búsqueda"
        value={filters.busqueda as string}
        onChange={value => updateFilter('busqueda', value)}
        placeholder="Buscar por código, modelo, zona..."
        className="min-w-[300px]"
      />
    </FilterContainer>
  )

  return (
    <ListPage
      title="Gestión de Pipetas"
      data={{
        items: pipetasFiltradas,
        isLoading,
        error,
        refetch
      }}
      handlers={handlers}
      renderFilters={renderFilters}
      config={{
        newButtonText: 'Nueva pipeta',
        emptyStateMessage: 'No hay pipetas disponibles'
      }}
    >
      <div className="grid gap-1">
        {pipetasFiltradas.map((pipeta: Pipeta) => (
          <PipetaCard
            key={pipeta.id}
            pipeta={pipeta}
            onEdit={() => navigate(`/pipetas/${pipeta.id}/editar`)}
            onDelete={() => {
              /* handle delete */
            }}
          />
        ))}
      </div>
    </ListPage>
  )
}
