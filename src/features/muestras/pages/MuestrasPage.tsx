import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMuestras, useMuestrasStats } from '../hooks/useMuestras'
import { Muestra } from '../interfaces/muestras.types'
import { MuestraFilter } from '../components/MuestraFilter'
import { ListPage } from '../../../shared/components/organisms/ListPage'
import { useListFilters } from '@/shared/hooks/useListFilters'
import { MuestraStatsComponent } from '../components/MuestraStats'
import { PlusCircle } from 'lucide-react'
import {
  createExactFilter,
  createTodayFilter,
  createMultiFieldSearchFilter
} from '@/shared/utils/filterUtils'
import { MuestraListHeader } from '../components/MuestraList/MuestraListHeader'
import { MuestraListDetail } from '../components/MuestraList/MuestraListDetail'

// Configuración de columnas (mantener spans sincronizados)
const COLUMN_CONFIG = [
  { label: 'Cód EXT', span: 1 },
  { label: 'Cód EPI', span: 1 },
  { label: 'Cliente', span: 2 },
  { label: 'Paciente', span: 2 },
  { label: 'Tipo Muestra', span: 1 },
  { label: 'Prueba', span: 2 },
  { label: 'Recepción', span: 1 },
  { label: 'Estado', span: 1 },
  { label: '', span: 1 }
]

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
    onNew: () => navigate('/muestras/nueva'),
    onSecondaryAction: () => alert('Funcionalidad no implementada')
  }

  const renderStats = () => (
    <MuestraStatsComponent stats={stats ?? undefined} isLoading={statsLoading} />
  )

  const renderFilters = () => (
    <MuestraFilter
      filters={{
        busqueda: filters.busqueda as string,
        estado: filters.estado as string,
        soloHoy: filters.soloHoy as boolean
      }}
      onFilterChange={updateFilter}
      onClearFilters={clearFilters}
      hasActiveFilters={hasActiveFilters}
    />
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
        emptyStateMessage: 'No hay muestras disponibles',
        secondaryActionIcon: <PlusCircle className="w-4 h-4" />,
        secondaryActionText: 'Grupo de muestras'
      }}
    >
      <div className="grid gap-1">
        <MuestraListHeader fieldList={COLUMN_CONFIG} />
        {muestrasFiltradas.map((muestra: Muestra) => (
          <MuestraListDetail
            key={muestra.id_muestra}
            muestra={muestra}
            onEdit={m => navigate(`/muestras/${m.id_muestra}/editar`)}
            onDelete={() => {
              /* handle delete */
            }}
            fieldSpans={COLUMN_CONFIG.map(col => col.span)}
          />
        ))}
      </div>
    </ListPage>
  )
}

// fieldList: {
//   label: string
//   span: number
// }[]
