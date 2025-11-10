import { SearchFilter } from '@/shared/components/organisms/Filters/FilterComponents'
import { FilterContainer } from '@/shared/components/organisms/Filters/FilterContainer'
import { ListPage } from '@/shared/components/organisms/ListPage'
import { usePlantillaPasos, useDeletePlantillaPaso } from '@/shared/hooks/useDim_tables'
import { useListFilters } from '@/shared/hooks/useListFilters'
import { PlantillaPasos } from '@/shared/interfaces/dim_tables.types'
import { createMultiFieldSearchFilter } from '@/shared/utils/filterUtils'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { PlantillaPasoListHeader, PlantillaPasoListDetail } from '../components/PlantillaPasoList'
import { useConfirmation } from '@/shared/components/Confirmation/ConfirmationContext'
import { useNotification } from '@/shared/components/Notification/NotificationContext'

const PLANTILLA_PASO_COLUMNS = [
  { label: 'Orden', span: 2 },
  { label: 'Código', span: 3 },
  { label: 'Descripción', span: 5 },
  { label: '', span: 2 }
]

export const PlantillasPasosPage = () => {
  const { data: pasos, isLoading, error, refetch } = usePlantillaPasos()
  const deleteMutation = useDeletePlantillaPaso()
  const { confirm } = useConfirmation()
  const { notify } = useNotification()

  const navigate = useNavigate()
  const filterConfig = useMemo(
    () => ({
      busqueda: {
        type: 'search' as const,
        defaultValue: '',
        filterFn: createMultiFieldSearchFilter<PlantillaPasos>(paso => [
          paso.codigo,
          paso.descripcion,
          paso.orden?.toString()
        ])
      }
    }),
    []
  )

  const {
    filters,
    filteredItems: pasosFiltrados,
    hasActiveFilters,
    updateFilter,
    clearFilters
  } = useListFilters<PlantillaPasos>(pasos || [], filterConfig)

  const handleDelete = async (paso: PlantillaPasos) => {
    try {
      const confirmed = await confirm({
        title: '¿Eliminar paso?',
        message: `¿Estás seguro de que deseas eliminar el paso "${paso.codigo || paso.descripcion}"? Esta acción no se puede deshacer.`,
        type: 'danger',
        confirmText: 'Eliminar',
        cancelText: 'Cancelar'
      })

      if (confirmed) {
        await deleteMutation.mutateAsync(paso.id)
        notify('Paso eliminado correctamente', 'success')
      }
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Error al eliminar el paso', 'error')
    }
  }

  const handlers = {
    onNew: () => navigate('/plantillas-pasos/nuevo')
  }

  const renderFilters = () => (
    <FilterContainer onClear={clearFilters} hasActiveFilters={hasActiveFilters}>
      <SearchFilter
        label="Búsqueda"
        value={filters.busqueda as string}
        onChange={value => updateFilter('busqueda', value)}
        placeholder="Buscar por código, descripción, orden..."
        className="min-w-[300px]"
      />
    </FilterContainer>
  )

  return (
    <ListPage
      title="Gestión de Pasos de Plantilla"
      data={{
        items: pasosFiltrados,
        isLoading,
        error,
        refetch
      }}
      handlers={handlers}
      renderFilters={renderFilters}
      config={{
        newButtonText: 'Nuevo paso',
        emptyStateMessage: 'No hay pasos disponibles'
      }}
    >
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <PlantillaPasoListHeader fieldList={PLANTILLA_PASO_COLUMNS} />
        {pasosFiltrados.map((paso: PlantillaPasos) => (
          <PlantillaPasoListDetail
            key={paso.id}
            paso={paso}
            onEdit={() => navigate(`/plantillas-pasos/${paso.id}/editar`)}
            onDelete={() => handleDelete(paso)}
            fieldSpans={PLANTILLA_PASO_COLUMNS.map(col => col.span)}
          />
        ))}
      </div>
    </ListPage>
  )
}
