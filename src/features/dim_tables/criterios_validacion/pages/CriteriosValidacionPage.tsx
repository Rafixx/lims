import { SearchFilter } from '@/shared/components/organisms/Filters/FilterComponents'
import { FilterContainer } from '@/shared/components/organisms/Filters/FilterContainer'
import { ListPage } from '@/shared/components/organisms/ListPage'
import { useCriteriosValidacion } from '@/shared/hooks/useDim_tables'
import { useListFilters } from '@/shared/hooks/useListFilters'
import { CriterioValidacion } from '@/shared/interfaces/dim_tables.types'
import { createMultiFieldSearchFilter } from '@/shared/utils/filterUtils'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { CriterioValidacionCard } from '../components/CriterioValidacionCard'

export const CriteriosValidacionPage = () => {
  const { data: criterios, isLoading, error, refetch } = useCriteriosValidacion()

  const navigate = useNavigate()
  const filterConfig = useMemo(
    () => ({
      busqueda: {
        type: 'search' as const,
        defaultValue: '',
        filterFn: createMultiFieldSearchFilter<CriterioValidacion>(criterio => [
          criterio.codigo,
          criterio.descripcion
        ])
      }
    }),
    []
  )

  const {
    filters,
    filteredItems: criteriosFiltrados,
    hasActiveFilters,
    updateFilter,
    clearFilters
  } = useListFilters<CriterioValidacion>(criterios || [], filterConfig)

  const handlers = {
    onNew: () => navigate('/criterios-validacion/nuevo')
  }

  const renderFilters = () => (
    <FilterContainer onClear={clearFilters} hasActiveFilters={hasActiveFilters}>
      <SearchFilter
        label="Búsqueda"
        value={filters.busqueda as string}
        onChange={value => updateFilter('busqueda', value)}
        placeholder="Buscar por código, descripción..."
        className="min-w-[300px]"
      />
    </FilterContainer>
  )

  return (
    <ListPage
      title="Gestión de Criterios de Validación"
      data={{
        items: criteriosFiltrados,
        isLoading,
        error,
        refetch
      }}
      handlers={handlers}
      renderFilters={renderFilters}
      config={{
        newButtonText: 'Nuevo criterio',
        emptyStateMessage: 'No hay criterios de validación disponibles'
      }}
    >
      <div className="grid gap-1">
        {criteriosFiltrados.map((criterio: CriterioValidacion) => (
          <CriterioValidacionCard
            key={criterio.id}
            criterio={criterio}
            onEdit={() => navigate(`/criterios-validacion/${criterio.id}/editar`)}
            onDelete={() => {
              /* handle delete */
            }}
          />
        ))}
      </div>
    </ListPage>
  )
}
