import { SearchFilter } from '@/shared/components/organisms/Filters/FilterComponents'
import { FilterContainer } from '@/shared/components/organisms/Filters/FilterContainer'
import { ListPage } from '@/shared/components/organisms/ListPage'
import { useClientes } from '@/shared/hooks/useDim_tables'
import { useListFilters } from '@/shared/hooks/useListFilters'
import { Cliente } from '@/shared/interfaces/dim_tables.types'
import { createMultiFieldSearchFilter } from '@/shared/utils/filterUtils'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ClienteCard } from '../components/ClienteCard'

export const ClientesPage = () => {
  const { data: clientes, isLoading, error, refetch } = useClientes()

  const navigate = useNavigate()
  const filterConfig = useMemo(
    () => ({
      busqueda: {
        type: 'search' as const,
        defaultValue: '',
        filterFn: createMultiFieldSearchFilter<Cliente>(cliente => [
          cliente.nombre,
          cliente.razon_social,
          cliente.nif,
          cliente.direccion
        ])
      }
    }),
    []
  )

  const {
    filters,
    filteredItems: clientesFiltrados,
    hasActiveFilters,
    updateFilter,
    clearFilters
  } = useListFilters<Cliente>(clientes || [], filterConfig)

  const handlers = {
    onNew: () => navigate('/clientes/nuevo')
  }

  const renderFilters = () => (
    <FilterContainer onClear={clearFilters} hasActiveFilters={hasActiveFilters}>
      <SearchFilter
        label="Búsqueda"
        value={filters.busqueda as string}
        onChange={value => updateFilter('busqueda', value)}
        placeholder="Buscar por nombre, razón social, NIF..."
        className="min-w-[300px]"
      />
    </FilterContainer>
  )

  return (
    <ListPage
      title="Gestión de Clientes"
      data={{
        items: clientesFiltrados,
        isLoading,
        error,
        refetch
      }}
      handlers={handlers}
      renderFilters={renderFilters}
      config={{
        newButtonText: 'Nuevo cliente',
        emptyStateMessage: 'No hay clientes disponibles'
      }}
    >
      <div className="grid gap-1">
        {clientesFiltrados.map((cliente: Cliente) => (
          <ClienteCard
            key={cliente.id}
            cliente={cliente}
            onEdit={() => navigate(`/clientes/${cliente.id}/editar`)}
            onDelete={() => {
              /* handle delete */
            }}
          />
        ))}
      </div>
    </ListPage>
  )
}
