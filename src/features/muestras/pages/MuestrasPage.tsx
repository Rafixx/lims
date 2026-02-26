import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMuestras, useMuestrasStats, useDeleteMuestra } from '../hooks/useMuestras'
import { Muestra } from '../interfaces/muestras.types'
import { MuestraFilter } from '../components/MuestraFilter'
import { ListPage } from '../../../shared/components/organisms/ListPage'
import { useListFilters } from '@/shared/hooks/useListFilters'
import { MuestraStatsComponent } from '../components/MuestraStats'
import { FileSpreadsheet, PlusCircle } from 'lucide-react'
import {
  createNumericExactFilter,
  createTodayFilter,
  createMultiFieldSearchFilter
} from '@/shared/utils/filterUtils'
import { MuestraListHeader } from '../components/MuestraList/MuestraListHeader'
import { MuestraListDetail } from '../components/MuestraList/MuestraListDetail'
import { MuestraGroupRow } from '../components/MuestraList/MuestraGroupRow'
import { useConfirmation } from '@/shared/components/Confirmation/ConfirmationContext'
import { useNotification } from '@/shared/components/Notification/NotificationContext'
import { Button } from '@/shared/components/molecules/Button'
import { formatDate } from '@/shared/utils/helpers'
import { groupMuestrasByEstudio } from '../utils/groupMuestras'
import { MuestraGroup } from '../interfaces/muestras.types'

// Configuración de columnas — spans deben sumar exactamente 12 (grid-cols-12)
// 1+1+1+1+1+2+1+1+1+2 = 12 ✓
// Acciones con span 2 para acomodar todos los botones (Upload, Duplicar, Editar, Eliminar)
const COLUMN_CONFIG = [
  { label: 'Cód EXT', span: 1, sortKey: 'codigo_externo' },
  { label: 'Cód EPI', span: 1, sortKey: 'codigo_epi' },
  { label: 'Cliente', span: 1, sortKey: 'cliente' },
  { label: 'Paciente', span: 1, sortKey: 'paciente' },
  { label: 'Tipo Muestra', span: 1, sortKey: 'tipo_muestra' },
  { label: 'Prueba', span: 2, sortKey: 'prueba' },
  { label: 'Estudio', span: 1, sortKey: 'estudio' },
  { label: 'Recepción', span: 1, sortKey: 'f_recepcion' },
  { label: 'Estado', span: 1, sortKey: 'estado' },
  { label: 'Acciones', span: 2, className: 'text-right' }
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
  const [sortKey, setSortKey] = useState<string>('')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

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
      numeroEstudio: {
        type: 'search' as const,
        defaultValue: '',
        filterFn: createMultiFieldSearchFilter<Muestra>(muestra => [muestra.estudio])
      },
      id_tipo_muestra: {
        type: 'select' as const,
        defaultValue: null,
        filterFn: createNumericExactFilter<Muestra>(muestra => muestra.tipo_muestra?.id)
      },
      id_prueba: {
        type: 'select' as const,
        defaultValue: null,
        filterFn: createNumericExactFilter<Muestra>(muestra => muestra.prueba?.id)
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

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDirection('asc')
    }
  }

  const sortedMuestras = useMemo<typeof muestrasFiltradas>(() => {
    if (!sortKey) return muestrasFiltradas
    return [...muestrasFiltradas].sort((a, b) => {
      let cmp = 0
      switch (sortKey) {
        case 'codigo_externo':
          cmp = (a.codigo_externo || '').localeCompare(b.codigo_externo || '')
          break
        case 'codigo_epi':
          cmp = (a.codigo_epi || '').localeCompare(b.codigo_epi || '')
          break
        case 'cliente':
          cmp = (a.solicitud?.cliente?.nombre || '').localeCompare(
            b.solicitud?.cliente?.nombre || ''
          )
          break
        case 'paciente':
          cmp = (a.paciente?.nombre || '').localeCompare(b.paciente?.nombre || '')
          break
        case 'tipo_muestra':
          cmp = (a.tipo_muestra?.tipo_muestra || '').localeCompare(
            b.tipo_muestra?.tipo_muestra || ''
          )
          break
        case 'prueba':
          cmp = (a.prueba?.prueba || '').localeCompare(b.prueba?.prueba || '')
          break
        case 'estudio':
          cmp = (a.estudio || '').localeCompare(b.estudio || '')
          break
        case 'f_recepcion':
          cmp = (a.f_recepcion || '').localeCompare(b.f_recepcion || '')
          break
        case 'estado':
          cmp = (a.estadoInfo?.estado || '').localeCompare(b.estadoInfo?.estado || '')
          break
      }
      return sortDirection === 'asc' ? cmp : -cmp
    })
  }, [muestrasFiltradas, sortKey, sortDirection])

  // Agrupar muestras ordenadas por estudio (memoizado para evitar recálculo innecesario)
  const groupedItems = useMemo(() => groupMuestrasByEstudio(sortedMuestras), [sortedMuestras])

  const handleExportCSV = () => {
    const headers = [
      'Cód EXT',
      'Cód EPI',
      'Estudio',
      'Cliente',
      'Paciente',
      'Tipo Muestra',
      'Prueba',
      'Recepción',
      'Estado'
    ]
    const rows = sortedMuestras.map(m => [
      m.codigo_externo || '',
      m.codigo_epi || '',
      m.estudio || '',
      m.solicitud?.cliente?.nombre || '',
      m.paciente?.nombre || '',
      m.tipo_muestra?.tipo_muestra || '',
      m.prueba?.prueba || '',
      m.f_recepcion ? formatDate(m.f_recepcion) : '',
      m.estadoInfo?.estado || ''
    ])
    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n')
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `muestras_${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

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
    onNew: () => navigate('/muestras/nueva')
    // onSecondaryAction: () => navigate('/muestras/nueva?tipo=grupo')
  }

  const renderStats = () => (
    <MuestraStatsComponent stats={stats ?? undefined} isLoading={statsLoading} />
  )

  const renderFilters = () => (
    <MuestraFilter
      filters={{
        busqueda: filters.busqueda as string,
        numeroEstudio: filters.numeroEstudio as string,
        id_tipo_muestra: filters.id_tipo_muestra as number | null,
        id_prueba: filters.id_prueba as number | null,
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
        items: sortedMuestras,
        total: muestras?.length,
        filtered: sortedMuestras.length,
        isLoading: isLoading || isDeleting,
        error,
        refetch
      }}
      handlers={handlers}
      renderStats={renderStats}
      renderFilters={renderFilters}
      customActions={
        <Button variant="secondary" onClick={handleExportCSV}>
          <FileSpreadsheet className="w-4 h-4" />
          Exportar CSV
        </Button>
      }
      config={{
        newButtonText: 'Nueva Muestra',
        emptyStateMessage: 'No hay muestras disponibles',
        secondaryActionIcon: <PlusCircle className="w-4 h-4" />
        // secondaryActionText: 'Grupo de muestras'
      }}
    >
      {/* overflow-x-auto para scroll horizontal en pantallas pequeñas */}
      <div className="overflow-x-auto rounded-lg border border-surface-200 shadow-soft bg-white">
        <div className="min-w-[720px]">
          <MuestraListHeader
            fieldList={COLUMN_CONFIG}
            sortKey={sortKey}
            sortDirection={sortDirection}
            onSort={handleSort}
          />
          {groupedItems.map(item =>
            (item as MuestraGroup).isGrouped === true ? (
              <MuestraGroupRow
                key={`group-${(item as MuestraGroup).key}`}
                group={item as MuestraGroup}
                onEdit={m => navigate(`/muestras/${m.id_muestra}/editar`)}
                onDelete={handleDelete}
                parentFieldSpans={COLUMN_CONFIG.map(col => col.span)}
              />
            ) : (
              <MuestraListDetail
                key={(item as Muestra).id_muestra}
                muestra={item as Muestra}
                onEdit={m => navigate(`/muestras/${m.id_muestra}/editar`)}
                onDelete={handleDelete}
                fieldSpans={COLUMN_CONFIG.map(col => col.span)}
              />
            )
          )}
        </div>
      </div>
    </ListPage>
  )
}

// fieldList: {
//   label: string
//   span: number
// }[]
