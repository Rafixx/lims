import { SearchFilter } from '@/shared/components/organisms/Filters/FilterComponents'
import { FilterContainer } from '@/shared/components/organisms/Filters/FilterContainer'
import { ListPage } from '@/shared/components/organisms/ListPage'
import { useCriteriosValidacion, useDeleteCriterioValidacion } from '@/shared/hooks/useDim_tables'
import { useListFilters } from '@/shared/hooks/useListFilters'
import { CriterioValidacion } from '@/shared/interfaces/dim_tables.types'
import { createMultiFieldSearchFilter } from '@/shared/utils/filterUtils'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CriterioValidacionListHeader,
  CriterioValidacionListDetail
} from '../components/CriterioValidacionList'
import { useConfirmation } from '@/shared/components/Confirmation/ConfirmationContext'
import { useNotification } from '@/shared/components/Notification/NotificationContext'

const CRITERIO_VALIDACION_COLUMNS = [
  { label: 'Código', span: 4 },
  { label: 'Descripción', span: 6 },
  { label: '', span: 2 }
]

export const CriteriosValidacionPage = () => {
  const { data: criterios, isLoading, error, refetch } = useCriteriosValidacion()

  const deleteMutation = useDeleteCriterioValidacion()
  const { confirm } = useConfirmation()
  const { notify } = useNotification()
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
    onNew: () => navigate('/criterios-validacion/nuevo'),
    onEdit: (criterio: CriterioValidacion) =>
      navigate(`/criterios-validacion/${criterio.id}/editar`),
    onDelete: async (criterio: CriterioValidacion) => {
      const isConfirmed = await confirm({
        title: 'Eliminar Criterio de Validación',
        message: `¿Está seguro de eliminar el criterio "${criterio.codigo}"? Esta acción no se puede deshacer.`,
        confirmText: 'Sí, eliminar',
        cancelText: 'Cancelar',
        type: 'danger'
      })

      if (!isConfirmed) {
        return
      }

      try {
        await deleteMutation.mutateAsync(criterio.id)
        notify('Criterio de validación eliminado correctamente', 'success')
        refetch()
      } catch (error) {
        notify(
          error instanceof Error ? error.message : 'Error al eliminar el criterio de validación',
          'error'
        )
      }
    }
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
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <CriterioValidacionListHeader fieldList={CRITERIO_VALIDACION_COLUMNS} />
        {criteriosFiltrados.map((criterio: CriterioValidacion) => (
          <CriterioValidacionListDetail
            key={criterio.id}
            criterio={criterio}
            onEdit={() => handlers.onEdit(criterio)}
            onDelete={() => handlers.onDelete(criterio)}
            fieldSpans={CRITERIO_VALIDACION_COLUMNS.map(col => col.span)}
          />
        ))}
      </div>
    </ListPage>
  )
}
