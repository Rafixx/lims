import { SearchFilter } from '@/shared/components/organisms/Filters/FilterComponents'
import { FilterContainer } from '@/shared/components/organisms/Filters/FilterContainer'
import { ListPage } from '@/shared/components/organisms/ListPage'
import { useUbicaciones, useDeleteUbicacion } from '@/shared/hooks/useDim_tables'
import { useListFilters } from '@/shared/hooks/useListFilters'
import { Ubicacion } from '@/shared/interfaces/dim_tables.types'
import { createMultiFieldSearchFilter } from '@/shared/utils/filterUtils'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { UbicacionCard } from '../components/UbicacionCard'
import { useConfirmation } from '@/shared/components/Confirmation/ConfirmationContext'
import { useNotification } from '@/shared/components/Notification/NotificationContext'

export const UbicacionesPage = () => {
  const { data: ubicaciones, isLoading, error, refetch } = useUbicaciones()

  const deleteMutation = useDeleteUbicacion()
  const { confirm } = useConfirmation()
  const { notify } = useNotification()
  const navigate = useNavigate()
  const filterConfig = useMemo(
    () => ({
      busqueda: {
        type: 'search' as const,
        defaultValue: '',
        filterFn: createMultiFieldSearchFilter<Ubicacion>(ubicacion => [
          ubicacion.codigo,
          ubicacion.ubicacion
        ])
      }
    }),
    []
  )

  const {
    filters,
    filteredItems: ubicacionesFiltradas,
    hasActiveFilters,
    updateFilter,
    clearFilters
  } = useListFilters<Ubicacion>(ubicaciones || [], filterConfig)

  const handleDelete = async (ubicacion: Ubicacion) => {
    const isConfirmed = await confirm({
      title: 'Eliminar Ubicación',
      message: `¿Está seguro de eliminar la ubicación "${ubicacion.codigo}"? Esta acción no se puede deshacer.`,
      confirmText: 'Sí, eliminar',
      cancelText: 'Cancelar',
      type: 'danger'
    })

    if (!isConfirmed) {
      return
    }

    try {
      await deleteMutation.mutateAsync(ubicacion.id)
      notify('Ubicación eliminada correctamente', 'success')
      refetch()
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Error al eliminar la ubicación', 'error')
    }
  }

  const handlers = {
    onNew: () => navigate('/ubicaciones/nueva'),
    onEdit: (ubicacion: Ubicacion) => navigate(`/ubicaciones/${ubicacion.id}/editar`),
    onDelete: handleDelete
  }

  const renderFilters = () => (
    <FilterContainer onClear={clearFilters} hasActiveFilters={hasActiveFilters}>
      <SearchFilter
        label="Búsqueda"
        value={filters.busqueda as string}
        onChange={value => updateFilter('busqueda', value)}
        placeholder="Buscar por código, ubicación..."
        className="min-w-[300px]"
      />
    </FilterContainer>
  )

  return (
    <ListPage
      title="Gestión de Ubicaciones"
      data={{
        items: ubicacionesFiltradas,
        isLoading,
        error,
        refetch
      }}
      handlers={handlers}
      renderFilters={renderFilters}
      config={{
        newButtonText: 'Nueva ubicación',
        emptyStateMessage: 'No hay ubicaciones disponibles'
      }}
    >
      <div className="grid gap-1">
        {ubicacionesFiltradas.map((ubicacion: Ubicacion) => (
          <UbicacionCard
            key={ubicacion.id}
            ubicacion={ubicacion}
            onEdit={() => handlers.onEdit(ubicacion)}
            onDelete={() => handlers.onDelete(ubicacion)}
          />
        ))}
      </div>
    </ListPage>
  )
}
