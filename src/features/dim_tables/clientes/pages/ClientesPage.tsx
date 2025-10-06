import { SearchFilter } from '@/shared/components/organisms/Filters/FilterComponents'
import { FilterContainer } from '@/shared/components/organisms/Filters/FilterContainer'
import { ListPage } from '@/shared/components/organisms/ListPage'
import { useClientes, useDeleteCliente } from '@/shared/hooks/useDim_tables'
import { useListFilters } from '@/shared/hooks/useListFilters'
import { Cliente } from '@/shared/interfaces/dim_tables.types'
import { createMultiFieldSearchFilter } from '@/shared/utils/filterUtils'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ClienteCard } from '../components/ClienteCard'
import { useConfirmation } from '@/shared/components/Confirmation/ConfirmationContext'
import { useNotification } from '@/shared/components/Notification/NotificationContext'

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
      <div className="grid gap-1">
        {clientesFiltrados.map((cliente: Cliente) => (
          <ClienteCard
            key={cliente.id}
            cliente={cliente}
            onEdit={() => handlers.onEdit(cliente)}
            onDelete={() => handlers.onDelete(cliente)}
          />
        ))}
      </div>
    </ListPage>
  )
}
