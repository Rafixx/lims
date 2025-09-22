import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMuestras, useMuestrasStats } from '../hooks/useMuestras'
import { Muestra } from '../interfaces/muestras.types'
import { MuestraCard } from '../components/MuestraCard'
import { ListPage } from '../../../shared/components/organisms/ListPage'
import { useListFilters } from '@/shared/hooks/useListFilters'
import { MuestraStatsComponent } from '../components/MuestraStats'
import { FilterContainer } from '@/shared/components/organisms/Filters/FilterContainer'
import {
  SelectFilter,
  ToggleFilter,
  SearchFilter
} from '@/shared/components/organisms/Filters/FilterComponents'
import { Calendar } from 'lucide-react'
import { APP_STATES } from '@/shared/states'
import {
  createExactFilter,
  createTodayFilter,
  createMultiFieldSearchFilter
} from '@/shared/utils/filterUtils'
import { getEstadosByType } from '@/shared/utils/estadoUtils'

// src/features/muestras/pages/MuestrasPage.tsx
export const MuestrasPage = () => {
  const { muestras, isLoading, error, refetch } = useMuestras()
  const { stats, isLoading: statsLoading } = useMuestrasStats()
  const navigate = useNavigate()

  // Configuración de filtros específica para muestras
  const filterConfig = useMemo(
    () => ({
      busqueda: {
        type: 'search' as const,
        defaultValue: '',
        filterFn: createMultiFieldSearchFilter<Muestra>(muestra => [
          muestra.codigo_epi,
          muestra.codigo_externo,
          muestra.solicitud?.cliente?.nombre,
          muestra.paciente?.nombre
        ])
      },
      estado: {
        type: 'select' as const,
        defaultValue: '',
        filterFn: createExactFilter<Muestra>(muestra => muestra.estado_muestra)
      },
      soloHoy: {
        type: 'toggle' as const,
        defaultValue: false,
        filterFn: createTodayFilter<Muestra>(muestra => muestra.solicitud?.f_creacion)
      }
    }),
    []
  )

  const {
    filters,
    filteredItems: muestrasFiltradas,
    hasActiveFilters,
    updateFilter,
    clearFilters
  } = useListFilters(muestras || [], filterConfig)

  const handlers = {
    onNew: () => navigate('/solicitudes/nueva')
  }

  const renderStats = () => (
    <MuestraStatsComponent stats={stats ?? undefined} isLoading={statsLoading} />
  )

  const renderFilters = () => (
    <FilterContainer onClear={clearFilters} hasActiveFilters={hasActiveFilters}>
      <SearchFilter
        label="Búsqueda"
        value={filters.busqueda as string}
        onChange={value => updateFilter('busqueda', value)}
        placeholder="Buscar por código, cliente, paciente..."
        className="min-w-[300px]"
      />

      <SelectFilter
        label="Estado"
        value={filters.estado as string}
        onChange={value => updateFilter('estado', value)}
        options={getEstadosByType(APP_STATES.MUESTRA)}
      />

      <ToggleFilter
        label="Solo Hoy"
        active={filters.soloHoy as boolean}
        onChange={active => updateFilter('soloHoy', active)}
        icon={<Calendar className="w-4 h-4" />}
      />
    </FilterContainer>
  )

  return (
    <ListPage
      title="Gestión de Muestras"
      data={{
        items: muestrasFiltradas,
        total: muestras?.length,
        filtered: muestrasFiltradas.length,
        isLoading,
        error,
        refetch
      }}
      handlers={handlers}
      renderStats={renderStats}
      renderFilters={renderFilters}
      config={{
        newButtonText: 'Nueva Muestra',
        emptyStateMessage: 'No hay muestras disponibles'
      }}
    >
      <div className="grid gap-1">
        {muestrasFiltradas.map((muestra: Muestra) => (
          <MuestraCard
            key={muestra.id_muestra}
            muestra={muestra}
            onEdit={m => navigate(`/muestras/${m.id_muestra}/editar`)}
            onDelete={() => {
              /* handle delete */
            }}
          />
        ))}
      </div>
    </ListPage>
  )
}
