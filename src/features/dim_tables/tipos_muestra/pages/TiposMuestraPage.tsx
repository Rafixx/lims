import { SearchFilter } from '@/shared/components/organisms/Filters/FilterComponents'
import { FilterContainer } from '@/shared/components/organisms/Filters/FilterContainer'
import { ListPage } from '@/shared/components/organisms/ListPage'
import { useTiposMuestra } from '@/shared/hooks/useDim_tables'
import { useListFilters } from '@/shared/hooks/useListFilters'
import { TipoMuestra } from '@/shared/interfaces/dim_tables.types'
import { createMultiFieldSearchFilter } from '@/shared/utils/filterUtils'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { TipoMuestraCard } from '../components/TipoMuestraCard'

export const TiposMuestraPage = () => {
  const { data: tiposMuestra, isLoading, error, refetch } = useTiposMuestra()

  const navigate = useNavigate()
  const filterConfig = useMemo(
    () => ({
      busqueda: {
        type: 'search' as const,
        defaultValue: '',
        filterFn: createMultiFieldSearchFilter<TipoMuestra>(tipoMuestra => [
          tipoMuestra.cod_tipo_muestra,
          tipoMuestra.tipo_muestra
        ])
      }
    }),
    []
  )

  const {
    filters,
    filteredItems: tiposMuestraFiltrados,
    hasActiveFilters,
    updateFilter,
    clearFilters
  } = useListFilters<TipoMuestra>(tiposMuestra || [], filterConfig)

  const handlers = {
    onNew: () => navigate('/tipos-muestra/nuevo')
  }

  const renderFilters = () => (
    <FilterContainer onClear={clearFilters} hasActiveFilters={hasActiveFilters}>
      <SearchFilter
        label="Búsqueda"
        value={filters.busqueda as string}
        onChange={value => updateFilter('busqueda', value)}
        placeholder="Buscar por código, tipo de muestra..."
        className="min-w-[300px]"
      />
    </FilterContainer>
  )

  return (
    <ListPage
      title="Gestión de Tipos de Muestra"
      data={{
        items: tiposMuestraFiltrados,
        isLoading,
        error,
        refetch
      }}
      handlers={handlers}
      renderFilters={renderFilters}
      config={{
        newButtonText: 'Nuevo Tipo de Muestra',
        emptyStateMessage: 'No hay tipos de muestra disponibles'
      }}
    >
      <div className="grid gap-1">
        {tiposMuestraFiltrados.map((tipoMuestra: TipoMuestra) => (
          <TipoMuestraCard
            key={tipoMuestra.id}
            tipoMuestra={tipoMuestra}
            onEdit={() => navigate(`/tipos-muestra/${tipoMuestra.id}/editar`)}
            onDelete={() => {
              /* handle delete */
            }}
          />
        ))}
      </div>
    </ListPage>
  )
}
