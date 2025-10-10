import { SearchFilter } from '@/shared/components/organisms/Filters/FilterComponents'
import { FilterContainer } from '@/shared/components/organisms/Filters/FilterContainer'
import { ListPage } from '@/shared/components/organisms/ListPage'
import { useReactivos, useDeleteReactivo } from '@/shared/hooks/useDim_tables'
import { useListFilters } from '@/shared/hooks/useListFilters'
import { Reactivo } from '@/shared/interfaces/dim_tables.types'
import { createMultiFieldSearchFilter } from '@/shared/utils/filterUtils'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ReactivoListHeader, ReactivoListDetail } from '../components/ReactivoList'
import { useConfirmation } from '@/shared/components/Confirmation/ConfirmationContext'
import { useNotification } from '@/shared/components/Notification/NotificationContext'

const REACTIVO_COLUMNS = [
  { label: 'Referencia', span: 2 },
  { label: 'Reactivo', span: 3 },
  { label: 'Lote', span: 2 },
  { label: 'Volumen', span: 3 },
  { label: '', span: 2 }
]

export const ReactivosPage = () => {
  const { data: reactivos, isLoading, error, refetch } = useReactivos()
  const deleteMutation = useDeleteReactivo()
  const { confirm } = useConfirmation()
  const { notify } = useNotification()

  const navigate = useNavigate()

  const handleDelete = async (reactivo: Reactivo) => {
    try {
      const confirmed = await confirm({
        title: '¿Eliminar reactivo?',
        message: `¿Estás seguro de que deseas eliminar el reactivo "${reactivo.reactivo || reactivo.num_referencia}"? Esta acción no se puede deshacer.`,
        type: 'danger',
        confirmText: 'Eliminar',
        cancelText: 'Cancelar'
      })

      if (confirmed) {
        await deleteMutation.mutateAsync(reactivo.id)
        notify('Reactivo eliminado correctamente', 'success')
      }
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Error al eliminar el reactivo', 'error')
    }
  }

  const filterConfig = useMemo(
    () => ({
      busqueda: {
        type: 'search' as const,
        defaultValue: '',
        filterFn: createMultiFieldSearchFilter<Reactivo>(reactivo => [
          reactivo.num_referencia,
          reactivo.reactivo,
          reactivo.lote,
          reactivo.volumen_formula
        ])
      }
    }),
    []
  )

  const {
    filters,
    filteredItems: reactivosFiltrados,
    hasActiveFilters,
    updateFilter,
    clearFilters
  } = useListFilters<Reactivo>(reactivos || [], filterConfig)

  const handlers = {
    onNew: () => navigate('/reactivos/nuevo')
  }

  const renderFilters = () => (
    <FilterContainer onClear={clearFilters} hasActiveFilters={hasActiveFilters}>
      <SearchFilter
        label="Búsqueda"
        value={filters.busqueda as string}
        onChange={value => updateFilter('busqueda', value)}
        placeholder="Buscar por referencia, reactivo, lote..."
        className="min-w-[300px]"
      />
    </FilterContainer>
  )

  return (
    <ListPage
      title="Gestión de Reactivos"
      data={{
        items: reactivosFiltrados,
        isLoading,
        error,
        refetch
      }}
      handlers={handlers}
      renderFilters={renderFilters}
      config={{
        newButtonText: 'Nuevo reactivo',
        emptyStateMessage: 'No hay reactivos disponibles'
      }}
    >
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <ReactivoListHeader fieldList={REACTIVO_COLUMNS} />
        {reactivosFiltrados.map((reactivo: Reactivo) => (
          <ReactivoListDetail
            key={reactivo.id}
            reactivo={reactivo}
            onEdit={() => navigate(`/reactivos/${reactivo.id}/editar`)}
            onDelete={() => handleDelete(reactivo)}
            fieldSpans={REACTIVO_COLUMNS.map(col => col.span)}
          />
        ))}
      </div>
    </ListPage>
  )
}
