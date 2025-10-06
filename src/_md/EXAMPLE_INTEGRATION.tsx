// EJEMPLO DE INTEGRACIÓN DEL SISTEMA DE CONFIRMACIÓN
// Este archivo muestra cómo integrar useConfirmation en CentrosPage.tsx

import { SearchFilter } from '@/shared/components/organisms/Filters/FilterComponents'
import { FilterContainer } from '@/shared/components/organisms/Filters/FilterContainer'
import { ListPage } from '@/shared/components/organisms/ListPage'
import { useCentros, useDeleteCentro } from '@/shared/hooks/useDim_tables'
import { useListFilters } from '@/shared/hooks/useListFilters'
import { Centro } from '@/shared/interfaces/dim_tables.types'
import { createMultiFieldSearchFilter } from '@/shared/utils/filterUtils'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { CentroCard } from '../components/CentroCard'
// ✨ NUEVO: Importar los hooks de confirmación y notificación
import { useConfirmation } from '@/shared/components/Confirmation'
import { useNotification } from '@/shared/components/Notification/NotificationContext'

export const CentrosPage = () => {
  const { data: centros, isLoading, error, refetch } = useCentros()
  const deleteMutation = useDeleteCentro()
  const navigate = useNavigate()

  // ✨ NUEVO: Inicializar los hooks
  const { confirm } = useConfirmation()
  const { notify } = useNotification()

  const filterConfig = useMemo(
    () => ({
      busqueda: {
        type: 'search' as const,
        defaultValue: '',
        filterFn: createMultiFieldSearchFilter<Centro>(centro => [
          centro.codigo,
          centro.descripcion
        ])
      }
    }),
    []
  )

  const {
    filters,
    filteredItems: centrosFiltrados,
    hasActiveFilters,
    updateFilter,
    clearFilters
  } = useListFilters<Centro>(centros || [], filterConfig)

  const handlers = {
    onNew: () => navigate('/centros/nuevo'),
    onEdit: (centro: Centro) => navigate(`/centros/${centro.id}/editar`),

    // ✨ NUEVO: Reemplazar window.confirm con el sistema de confirmación
    onDelete: async (centro: Centro) => {
      // Mostrar diálogo de confirmación personalizado
      const isConfirmed = await confirm({
        title: 'Eliminar Centro',
        message: `¿Está seguro de eliminar el centro "${centro.codigo}"? Esta acción no se puede deshacer.`,
        confirmText: 'Sí, eliminar',
        cancelText: 'Cancelar',
        type: 'danger'
      })

      // Si el usuario cancela, no hacer nada
      if (!isConfirmed) {
        return
      }

      // Si confirma, proceder con la eliminación
      try {
        await deleteMutation.mutateAsync(centro.id)
        notify('Centro eliminado correctamente', 'success')
        refetch()
      } catch (error) {
        notify(error instanceof Error ? error.message : 'Error al eliminar el centro', 'error')
      }
    }
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
      title="Gestión de Centro"
      data={{
        items: centrosFiltrados,
        isLoading,
        error,
        refetch
      }}
      handlers={handlers}
      renderFilters={renderFilters}
      config={{
        newButtonText: 'Nuevo centro',
        emptyStateMessage: 'No hay Centro disponibles'
      }}
    >
      <div className="grid gap-1">
        {centrosFiltrados.map((centro: Centro) => (
          <CentroCard
            key={centro.id}
            centro={centro}
            onEdit={() => handlers.onEdit(centro)}
            onDelete={() => handlers.onDelete(centro)}
          />
        ))}
      </div>
    </ListPage>
  )
}
