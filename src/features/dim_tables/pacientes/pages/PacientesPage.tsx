import { SearchFilter } from '@/shared/components/organisms/Filters/FilterComponents'
import { FilterContainer } from '@/shared/components/organisms/Filters/FilterContainer'
import { ListPage } from '@/shared/components/organisms/ListPage'
import { usePacientes, useDeletePaciente } from '@/shared/hooks/useDim_tables'
import { useListFilters } from '@/shared/hooks/useListFilters'
import { Paciente } from '@/shared/interfaces/dim_tables.types'
import { createMultiFieldSearchFilter } from '@/shared/utils/filterUtils'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { PacienteCard } from '../components/PacienteCard'
import { useConfirmation } from '@/shared/components/Confirmation/ConfirmationContext'
import { useNotification } from '@/shared/components/Notification/NotificationContext'

export const PacientesPage = () => {
  const { data: pacientes, isLoading, error, refetch } = usePacientes()
  const deleteMutation = useDeletePaciente()
  const { confirm } = useConfirmation()
  const { notify } = useNotification()

  const navigate = useNavigate()
  const filterConfig = useMemo(
    () => ({
      busqueda: {
        type: 'search' as const,
        defaultValue: '',
        filterFn: createMultiFieldSearchFilter<Paciente>(paciente => [
          paciente.nombre,
          paciente.sip,
          paciente.direccion
        ])
      }
    }),
    []
  )

  const {
    filters,
    filteredItems: pacientesFiltrados,
    hasActiveFilters,
    updateFilter,
    clearFilters
  } = useListFilters<Paciente>(pacientes || [], filterConfig)

  const handleDelete = async (paciente: Paciente) => {
    try {
      const confirmed = await confirm({
        title: '¿Eliminar paciente?',
        message: `¿Estás seguro de que deseas eliminar el paciente "${paciente.nombre}"? Esta acción no se puede deshacer.`,
        type: 'danger',
        confirmText: 'Eliminar',
        cancelText: 'Cancelar'
      })

      if (confirmed) {
        await deleteMutation.mutateAsync(paciente.id)
        notify('Paciente eliminado correctamente', 'success')
      }
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Error al eliminar el paciente', 'error')
    }
  }

  const handlers = {
    onNew: () => navigate('/pacientes/nuevo')
  }

  const renderFilters = () => (
    <FilterContainer onClear={clearFilters} hasActiveFilters={hasActiveFilters}>
      <SearchFilter
        label="Búsqueda"
        value={filters.busqueda as string}
        onChange={value => updateFilter('busqueda', value)}
        placeholder="Buscar por nombre, SIP, dirección..."
        className="min-w-[300px]"
      />
    </FilterContainer>
  )

  return (
    <ListPage
      title="Gestión de Pacientes"
      data={{
        items: pacientesFiltrados,
        isLoading,
        error,
        refetch
      }}
      handlers={handlers}
      renderFilters={renderFilters}
      config={{
        newButtonText: 'Nuevo paciente',
        emptyStateMessage: 'No hay pacientes disponibles'
      }}
    >
      <div className="grid gap-1">
        {pacientesFiltrados.map((paciente: Paciente) => (
          <PacienteCard
            key={paciente.id}
            paciente={paciente}
            onEdit={() => navigate(`/pacientes/${paciente.id}/editar`)}
            onDelete={() => handleDelete(paciente)}
          />
        ))}
      </div>
    </ListPage>
  )
}
