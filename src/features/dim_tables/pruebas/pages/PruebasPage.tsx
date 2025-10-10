import { SearchFilter } from '@/shared/components/organisms/Filters/FilterComponents'
import { FilterContainer } from '@/shared/components/organisms/Filters/FilterContainer'
import { ListPage } from '@/shared/components/organisms/ListPage'
import { usePruebas, useDeletePrueba } from '@/shared/hooks/useDim_tables'
import { useListFilters } from '@/shared/hooks/useListFilters'
import { Prueba } from '@/shared/interfaces/dim_tables.types'
import { createMultiFieldSearchFilter } from '@/shared/utils/filterUtils'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { PruebaListHeader, PruebaListDetail } from '../components/PruebaList'
import { useConfirmation } from '@/shared/components/Confirmation/ConfirmationContext'
import { useNotification } from '@/shared/components/Notification/NotificationContext'

const PRUEBA_COLUMNS = [
  { label: 'Código', span: 4 },
  { label: 'Prueba', span: 6 },
  { label: '', span: 2 }
]

export const PruebasPage = () => {
  const { data: pruebas, isLoading, error, refetch } = usePruebas()
  const deleteMutation = useDeletePrueba()
  const { confirm } = useConfirmation()
  const { notify } = useNotification()

  const navigate = useNavigate()

  const handleDelete = async (prueba: Prueba) => {
    try {
      const confirmed = await confirm({
        title: '¿Eliminar prueba?',
        message: `¿Estás seguro de que deseas eliminar la prueba "${prueba.cod_prueba}"? Esta acción no se puede deshacer.`,
        type: 'danger',
        confirmText: 'Eliminar',
        cancelText: 'Cancelar'
      })

      if (confirmed) {
        await deleteMutation.mutateAsync(prueba.id)
        notify('Prueba eliminada correctamente', 'success')
      }
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Error al eliminar la prueba', 'error')
    }
  }

  const filterConfig = useMemo(
    () => ({
      busqueda: {
        type: 'search' as const,
        defaultValue: '',
        filterFn: createMultiFieldSearchFilter<Prueba>(prueba => [prueba.cod_prueba, prueba.prueba])
      }
    }),
    []
  )

  const {
    filters,
    filteredItems: pruebasFiltradas,
    hasActiveFilters,
    updateFilter,
    clearFilters
  } = useListFilters<Prueba>(pruebas || [], filterConfig)

  const handlers = {
    onNew: () => navigate('/pruebas/nueva')
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
      title="Gestión de pruebas"
      data={{
        items: pruebasFiltradas,
        isLoading,
        error,
        refetch
      }}
      handlers={handlers}
      renderFilters={renderFilters}
      config={{
        newButtonText: 'Nueva prueba',
        emptyStateMessage: 'No hay pruebas disponibles'
      }}
    >
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <PruebaListHeader fieldList={PRUEBA_COLUMNS} />
        {pruebasFiltradas.map((prueba: Prueba) => (
          <PruebaListDetail
            key={prueba.id}
            prueba={prueba}
            onEdit={() => navigate(`/pruebas/${prueba.id}/editar`)}
            onDelete={() => handleDelete(prueba)}
            fieldSpans={PRUEBA_COLUMNS.map(col => col.span)}
          />
        ))}
      </div>
    </ListPage>
  )
}
