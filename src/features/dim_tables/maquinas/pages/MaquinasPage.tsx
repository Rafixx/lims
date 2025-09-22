import { SearchFilter } from '@/shared/components/organisms/Filters/FilterComponents'
import { FilterContainer } from '@/shared/components/organisms/Filters/FilterContainer'
import { ListPage } from '@/shared/components/organisms/ListPage'
import { useMaquinas } from '@/shared/hooks/useDim_tables'
import { useListFilters } from '@/shared/hooks/useListFilters'
import { Maquina } from '@/shared/interfaces/dim_tables.types'
import { createMultiFieldSearchFilter } from '@/shared/utils/filterUtils'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { MaquinaCard } from '../components/MaquinaCard'

export const MaquinasPage = () => {
  const { data: maquinas, isLoading, error, refetch } = useMaquinas()

  const navigate = useNavigate()
  const filterConfig = useMemo(
    () => ({
      busqueda: {
        type: 'search' as const,
        defaultValue: '',
        filterFn: createMultiFieldSearchFilter<Maquina>(maquina => [
          maquina.codigo,
          maquina.maquina,
          maquina.perfil_termico
        ])
      }
    }),
    []
  )

  const {
    filters,
    filteredItems: maquinasFiltradas,
    hasActiveFilters,
    updateFilter,
    clearFilters
  } = useListFilters<Maquina>(maquinas || [], filterConfig)

  const handlers = {
    onNew: () => navigate('/maquinas/nueva')
  }

  const renderFilters = () => (
    <FilterContainer onClear={clearFilters} hasActiveFilters={hasActiveFilters}>
      <SearchFilter
        label="Búsqueda"
        value={filters.busqueda as string}
        onChange={value => updateFilter('busqueda', value)}
        placeholder="Buscar por código, máquina, perfil térmico..."
        className="min-w-[300px]"
      />
    </FilterContainer>
  )

  return (
    <ListPage
      title="Gestión de Máquinas"
      data={{
        items: maquinasFiltradas,
        isLoading,
        error,
        refetch
      }}
      handlers={handlers}
      renderFilters={renderFilters}
      config={{
        newButtonText: 'Nueva máquina',
        emptyStateMessage: 'No hay máquinas disponibles'
      }}
    >
      <div className="grid gap-1">
        {maquinasFiltradas.map((maquina: Maquina) => (
          <MaquinaCard
            key={maquina.id}
            maquina={maquina}
            onEdit={() => navigate(`/maquinas/${maquina.id}/editar`)}
            onDelete={() => {
              /* handle delete */
            }}
          />
        ))}
      </div>
    </ListPage>
  )
}
