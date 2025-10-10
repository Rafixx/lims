import { SearchFilter } from '@/shared/components/organisms/Filters/FilterComponents'
import { FilterContainer } from '@/shared/components/organisms/Filters/FilterContainer'
import { ListPage } from '@/shared/components/organisms/ListPage'
import { useTiposMuestra, useDeleteTipoMuestra } from '@/shared/hooks/useDim_tables'
import { useListFilters } from '@/shared/hooks/useListFilters'
import { TipoMuestra } from '@/shared/interfaces/dim_tables.types'
import { createMultiFieldSearchFilter } from '@/shared/utils/filterUtils'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { TipoMuestraListHeader, TipoMuestraListDetail } from '../components/TipoMuestraList'
import { useConfirmation } from '@/shared/components/Confirmation/ConfirmationContext'
import { useNotification } from '@/shared/components/Notification/NotificationContext'

const TIPO_MUESTRA_COLUMNS = [
  { label: 'Código', span: 4 },
  { label: 'Tipo de Muestra', span: 6 },
  { label: '', span: 2 }
]

export const TiposMuestraPage = () => {
  const { data: tiposMuestra, isLoading, error, refetch } = useTiposMuestra()
  const deleteMutation = useDeleteTipoMuestra()
  const { confirm } = useConfirmation()
  const { notify } = useNotification()

  const navigate = useNavigate()

  const handleDelete = async (tipoMuestra: TipoMuestra) => {
    try {
      const confirmed = await confirm({
        title: '¿Eliminar tipo de muestra?',
        message: `¿Estás seguro de que deseas eliminar el tipo de muestra "${tipoMuestra.cod_tipo_muestra}"? Esta acción no se puede deshacer.`,
        type: 'danger',
        confirmText: 'Eliminar',
        cancelText: 'Cancelar'
      })

      if (confirmed) {
        await deleteMutation.mutateAsync(tipoMuestra.id)
        notify('Tipo de muestra eliminado correctamente', 'success')
      }
    } catch (error) {
      notify(
        error instanceof Error ? error.message : 'Error al eliminar el tipo de muestra',
        'error'
      )
    }
  }

  const filterConfig = useMemo(
    () => ({
      busqueda: {
        type: 'search' as const,
        defaultValue: '',
        filterFn: createMultiFieldSearchFilter<TipoMuestra>(tipoMuestra => [
          tipoMuestra.cod_tipo_muestra,
          tipoMuestra.tipo_muestra
        ])
      }
    }),
    []
  )

  const {
    filters,
    filteredItems: tiposMuestraFiltrados,
    hasActiveFilters,
    updateFilter,
    clearFilters
  } = useListFilters<TipoMuestra>(tiposMuestra || [], filterConfig)

  const handlers = {
    onNew: () => navigate('/tipos-muestra/nuevo')
  }

  const renderFilters = () => (
    <FilterContainer onClear={clearFilters} hasActiveFilters={hasActiveFilters}>
      <SearchFilter
        label="Búsqueda"
        value={filters.busqueda as string}
        onChange={value => updateFilter('busqueda', value)}
        placeholder="Buscar por código, tipo de muestra..."
        className="min-w-[300px]"
      />
    </FilterContainer>
  )

  return (
    <ListPage
      title="Gestión de Tipos de Muestra"
      data={{
        items: tiposMuestraFiltrados,
        isLoading,
        error,
        refetch
      }}
      handlers={handlers}
      renderFilters={renderFilters}
      config={{
        newButtonText: 'Nuevo Tipo de Muestra',
        emptyStateMessage: 'No hay tipos de muestra disponibles'
      }}
    >
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <TipoMuestraListHeader fieldList={TIPO_MUESTRA_COLUMNS} />
        {tiposMuestraFiltrados.map((tipoMuestra: TipoMuestra) => (
          <TipoMuestraListDetail
            key={tipoMuestra.id}
            tipoMuestra={tipoMuestra}
            onEdit={() => navigate(`/tipos-muestra/${tipoMuestra.id}/editar`)}
            onDelete={() => handleDelete(tipoMuestra)}
            fieldSpans={TIPO_MUESTRA_COLUMNS.map(col => col.span)}
          />
        ))}
      </div>
    </ListPage>
  )
}
