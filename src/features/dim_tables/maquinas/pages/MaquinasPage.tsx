import { SearchFilter } from '@/shared/components/organisms/Filters/FilterComponents'
import { FilterContainer } from '@/shared/components/organisms/Filters/FilterContainer'
import { ListPage } from '@/shared/components/organisms/ListPage'
import { useMaquinas, useDeleteMaquina } from '@/shared/hooks/useDim_tables'
import { useListFilters } from '@/shared/hooks/useListFilters'
import { Maquina } from '@/shared/interfaces/dim_tables.types'
import { createMultiFieldSearchFilter } from '@/shared/utils/filterUtils'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { MaquinaCard } from '../components/MaquinaCard'
import { useConfirmation } from '@/shared/components/Confirmation/ConfirmationContext'
import { useNotification } from '@/shared/components/Notification/NotificationContext'

export const MaquinasPage = () => {
  const { data: maquinas, isLoading, error, refetch } = useMaquinas()
  const deleteMutation = useDeleteMaquina()
  const { confirm } = useConfirmation()
  const { notify } = useNotification()

  const navigate = useNavigate()
  const filterConfig = useMemo(
    () => ({
      busqueda: {
        type: 'search' as const,
        defaultValue: '',
        filterFn: createMultiFieldSearchFilter<Maquina>(maquina => [
          maquina.codigo,
          maquina.maquina,
          maquina.perfil_termico
        ])
      }
    }),
    []
  )

  const {
    filters,
    filteredItems: maquinasFiltradas,
    hasActiveFilters,
    updateFilter,
    clearFilters
  } = useListFilters<Maquina>(maquinas || [], filterConfig)

  const handleDelete = async (maquina: Maquina) => {
    try {
      const confirmed = await confirm({
        title: '¿Eliminar máquina?',
        message: `¿Estás seguro de que deseas eliminar la máquina "${maquina.codigo}"? Esta acción no se puede deshacer.`,
        type: 'danger',
        confirmText: 'Eliminar',
        cancelText: 'Cancelar'
      })

      if (confirmed) {
        await deleteMutation.mutateAsync(maquina.id)
        notify('Máquina eliminada correctamente', 'success')
      }
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Error al eliminar la máquina', 'error')
    }
  }

  const handlers = {
    onNew: () => navigate('/maquinas/nueva')
  }

  const renderFilters = () => (
    <FilterContainer onClear={clearFilters} hasActiveFilters={hasActiveFilters}>
      <SearchFilter
        label="Búsqueda"
        value={filters.busqueda as string}
        onChange={value => updateFilter('busqueda', value)}
        placeholder="Buscar por código, máquina, perfil térmico..."
        className="min-w-[300px]"
      />
    </FilterContainer>
  )

  return (
    <ListPage
      title="Gestión de Máquinas"
      data={{
        items: maquinasFiltradas,
        isLoading,
        error,
        refetch
      }}
      handlers={handlers}
      renderFilters={renderFilters}
      config={{
        newButtonText: 'Nueva máquina',
        emptyStateMessage: 'No hay máquinas disponibles'
      }}
    >
      <div className="grid gap-1">
        {maquinasFiltradas.map((maquina: Maquina) => (
          <MaquinaCard
            key={maquina.id}
            maquina={maquina}
            onEdit={() => navigate(`/maquinas/${maquina.id}/editar`)}
            onDelete={() => handleDelete(maquina)}
          />
        ))}
      </div>
    </ListPage>
  )
}
