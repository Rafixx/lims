import { SearchFilter } from '@/shared/components/organisms/Filters/FilterComponents'
import { FilterContainer } from '@/shared/components/organisms/Filters/FilterContainer'
import { ListPage } from '@/shared/components/organisms/ListPage'
import { useClientes, useDeleteCliente } from '@/shared/hooks/useDim_tables'
import { useListFilters } from '@/shared/hooks/useListFilters'
import { useSortAndPaginate } from '@/shared/hooks/useSortAndPaginate'
import { Cliente } from '@/shared/interfaces/dim_tables.types'
import { createMultiFieldSearchFilter } from '@/shared/utils/filterUtils'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ClienteListHeader, ClienteListDetail } from '../components/ClienteList'
import { useConfirmation } from '@/shared/components/Confirmation/ConfirmationContext'
import { useNotification } from '@/shared/components/Notification/NotificationContext'
import { Pagination } from '@/shared/components/molecules/Pagination'

const CLIENTE_COLUMNS = [
  { label: 'Nombre', span: 3, sortKey: 'nombre' },
  { label: 'Razón Social', span: 3, sortKey: 'razon_social' },
  { label: 'NIF', span: 2, sortKey: 'nif' },
  { label: 'Dirección', span: 2, sortKey: 'direccion' },
  { label: '', span: 2 }
]

export const ClientesPage = () => {
  const { data: clientes, isLoading, error, refetch } = useClientes()

  const deleteMutation = useDeleteCliente()
  const { confirm } = useConfirmation()
  const { notify } = useNotification()
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

  const { sortKey, sortDirection, onSort, page, setPage, pageSize, setPageSize, totalPages, paginatedItems } =
    useSortAndPaginate(clientesFiltrados, { defaultSortKey: 'nombre' })

  const handlers = {
    onNew: () => navigate('/clientes/nuevo'),
    onEdit: (cliente: Cliente) => navigate(`/clientes/${cliente.id}/editar`),
    onDelete: async (cliente: Cliente) => {
      const isConfirmed = await confirm({
        title: 'Eliminar Cliente',
        message: `¿Está seguro de eliminar el cliente "${cliente.nombre}"? Esta acción no se puede deshacer.`,
        confirmText: 'Sí, eliminar',
        cancelText: 'Cancelar',
        type: 'danger'
      })

      if (!isConfirmed) {
        return
      }

      try {
        await deleteMutation.mutateAsync(cliente.id)
        notify('Cliente eliminado correctamente', 'success')
        refetch()
      } catch (error) {
        notify(error instanceof Error ? error.message : 'Error al eliminar el cliente', 'error')
      }
    }
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
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <ClienteListHeader fieldList={CLIENTE_COLUMNS} sortKey={sortKey} sortDirection={sortDirection} onSort={onSort} />
        {paginatedItems.map((cliente: Cliente) => (
          <ClienteListDetail
            key={cliente.id}
            cliente={cliente}
            onEdit={handlers.onEdit}
            onDelete={handlers.onDelete}
            fieldSpans={CLIENTE_COLUMNS.map(col => col.span)}
          />
        ))}
        <Pagination page={page} totalPages={totalPages} totalItems={clientesFiltrados.length} pageSize={pageSize} onPageChange={setPage} onPageSizeChange={setPageSize} />
      </div>
    </ListPage>
  )
}
