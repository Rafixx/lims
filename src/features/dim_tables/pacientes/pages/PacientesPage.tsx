import { SearchFilter } from '@/shared/components/organisms/Filters/FilterComponents'
import { FilterContainer } from '@/shared/components/organisms/Filters/FilterContainer'
import { ListPage } from '@/shared/components/organisms/ListPage'
import { usePacientes } from '@/shared/hooks/useDim_tables'
import { useListFilters } from '@/shared/hooks/useListFilters'
import { Paciente } from '@/shared/interfaces/dim_tables.types'
import { createMultiFieldSearchFilter } from '@/shared/utils/filterUtils'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { PacienteCard } from '../components/PacienteCard'

export const PacientesPage = () => {
  const { data: pacientes, isLoading, error, refetch } = usePacientes()

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
            onEdit={p => navigate(`/pacientes/${paciente.id}/editar`)}
            onDelete={() => {
              /* handle delete */
            }}
          />
        ))}
      </div>
    </ListPage>
  )
}
