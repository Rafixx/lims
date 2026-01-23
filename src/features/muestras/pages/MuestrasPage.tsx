import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMuestras, useMuestrasStats, useDeleteMuestra } from '../hooks/useMuestras'
import { Muestra } from '../interfaces/muestras.types'
import { MuestraFilter } from '../components/MuestraFilter'
import { ListPage } from '../../../shared/components/organisms/ListPage'
import { useListFilters } from '@/shared/hooks/useListFilters'
import { MuestraStatsComponent } from '../components/MuestraStats'
import { PlusCircle } from 'lucide-react'
import {
  createNumericExactFilter,
  createTodayFilter,
  createMultiFieldSearchFilter
} from '@/shared/utils/filterUtils'
import { MuestraListHeader } from '../components/MuestraList/MuestraListHeader'
import { MuestraListDetail } from '../components/MuestraList/MuestraListDetail'
import { useConfirmation } from '@/shared/components/Confirmation/ConfirmationContext'
import { useNotification } from '@/shared/components/Notification/NotificationContext'

// Configuración de columnas (mantener spans sincronizados)
const COLUMN_CONFIG = [
  { label: 'Cód EXT', span: 1 },
  { label: 'Cód EPI', span: 1 },
  { label: 'Estudio', span: 1 },
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
  const deleteMuestraMutation = useDeleteMuestra()
  const navigate = useNavigate()
  const { confirm } = useConfirmation()
  const { notify } = useNotification()
  const [isDeleting, setIsDeleting] = useState(false)

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
      id_estado: {
        type: 'select' as const,
        defaultValue: null,
        filterFn: createNumericExactFilter<Muestra>(muestra => muestra.id_estado)
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

  const handleDelete = async (muestra: Muestra) => {
    const confirmed = await confirm({
      title: 'Eliminar muestra',
      message: `¿Estás seguro de que deseas eliminar la muestra ${muestra.codigo_externo || muestra.codigo_epi || `#${muestra.id_muestra}`}? Esta acción no se puede deshacer.`,
      confirmText: 'Sí, eliminar',
      cancelText: 'Cancelar',
      type: 'danger'
    })

    if (!confirmed) return

    setIsDeleting(true)
    try {
      await deleteMuestraMutation.mutateAsync(muestra.id_muestra)
      notify('Muestra eliminada correctamente', 'success')
      refetch()
    } catch (error) {
      notify('Error al eliminar la muestra', 'error')
      console.error('Error deleting muestra:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handlers = {
    onNew: () => navigate('/muestras/nueva'),
    onSecondaryAction: () => navigate('/muestras/nueva?tipo=grupo')
  }

  const renderStats = () => (
    <MuestraStatsComponent stats={stats ?? undefined} isLoading={statsLoading} />
  )

  const renderFilters = () => (
    <MuestraFilter
      filters={{
        busqueda: filters.busqueda as string,
        id_estado: filters.id_estado as number | null,
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
        isLoading: isLoading || isDeleting,
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
            onDelete={handleDelete}
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
