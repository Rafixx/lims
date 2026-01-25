import { SearchFilter } from '@/shared/components/organisms/Filters/FilterComponents'
import { FilterContainer } from '@/shared/components/organisms/Filters/FilterContainer'
import { ListPage } from '@/shared/components/organisms/ListPage'
import { useTecnicasProc, useDeleteTecnicaProc } from '@/shared/hooks/useDim_tables'
import { useListFilters } from '@/shared/hooks/useListFilters'
import { TecnicaProc } from '@/shared/interfaces/dim_tables.types'
import { createMultiFieldSearchFilter } from '@/shared/utils/filterUtils'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { TecnicaProcListHeader, TecnicaProcListDetail } from '../components/TecnicaProcList'
import { useConfirmation } from '@/shared/components/Confirmation/ConfirmationContext'
import { useNotification } from '@/shared/components/Notification/NotificationContext'

const TECNICA_PROC_COLUMNS = [
  { label: 'Técnica', span: 5 },
  { label: 'Orden', span: 2 },
  { label: 'Plantilla Asociada', span: 3 },
  { label: '', span: 2 }
]

export const TecnicasProcPage = () => {
  const { data: tecnicasProc, isLoading, error, refetch } = useTecnicasProc()
  const deleteMutation = useDeleteTecnicaProc()
  const { confirm } = useConfirmation()
  const { notify } = useNotification()

  const navigate = useNavigate()

  const handleDelete = async (tecnicaProc: TecnicaProc) => {
    try {
      const confirmed = await confirm({
        title: '¿Eliminar técnica?',
        message: `¿Estás seguro de que deseas eliminar la técnica "${tecnicaProc.tecnica_proc}"? Esta acción no se puede deshacer.`,
        type: 'danger',
        confirmText: 'Eliminar',
        cancelText: 'Cancelar'
      })

      if (confirmed) {
        await deleteMutation.mutateAsync(tecnicaProc.id)
        notify('Técnica eliminada correctamente', 'success')
      }
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Error al eliminar la técnica', 'error')
    }
  }

  const filterConfig = useMemo(
    () => ({
      busqueda: {
        type: 'search' as const,
        defaultValue: '',
        filterFn: createMultiFieldSearchFilter<TecnicaProc>(tecnicaProc => [
          tecnicaProc.tecnica_proc,
          tecnicaProc.plantillaTecnica?.tecnica
        ])
      }
    }),
    []
  )

  const {
    filters,
    filteredItems: tecnicasProcFiltradas,
    hasActiveFilters,
    updateFilter,
    clearFilters
  } = useListFilters<TecnicaProc>(tecnicasProc || [], filterConfig)

  const handlers = {
    onNew: () => navigate('/tecnicas-proc/nueva')
  }

  const renderFilters = () => (
    <FilterContainer onClear={clearFilters} hasActiveFilters={hasActiveFilters}>
      <SearchFilter
        label="Búsqueda"
        value={filters.busqueda as string}
        onChange={value => updateFilter('busqueda', value)}
        placeholder="Buscar por nombre de técnica, plantilla..."
        className="min-w-[300px]"
      />
    </FilterContainer>
  )
  return (
    <ListPage
      title="Gestión de técnicas de procesamiento"
      data={{
        items: tecnicasProcFiltradas,
        isLoading,
        error,
        refetch
      }}
      handlers={handlers}
      renderFilters={renderFilters}
      config={{
        newButtonText: 'Nueva técnica',
        emptyStateMessage: 'No hay técnicas de procesamiento disponibles'
      }}
    >
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <TecnicaProcListHeader fieldList={TECNICA_PROC_COLUMNS} />
        {tecnicasProcFiltradas.map((tecnicaProc: TecnicaProc) => (
          <TecnicaProcListDetail
            key={tecnicaProc.id}
            tecnicaProc={tecnicaProc}
            onEdit={() => navigate(`/tecnicas-proc/${tecnicaProc.id}/editar`)}
            onDelete={() => handleDelete(tecnicaProc)}
            fieldSpans={TECNICA_PROC_COLUMNS.map(col => col.span)}
          />
        ))}
      </div>
    </ListPage>
  )
}
