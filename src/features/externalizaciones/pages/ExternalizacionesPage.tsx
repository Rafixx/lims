import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useExternalizaciones, useDeleteExternalizacion } from '../hooks/useExternalizaciones'
import { Externalizacion } from '../interfaces/externalizaciones.types'
import { ExternalizacionFilter } from '../components/ExternalizacionFilter'
import { ListPage } from '@/shared/components/organisms/ListPage'
import { useListFilters } from '@/shared/hooks/useListFilters'
import {
  createNumericExactFilter,
  createMultiFieldSearchFilter
} from '@/shared/utils/filterUtils'
import {
  ExternalizacionListHeader,
  type SortField,
  type SortDirection
} from '../components/ExternalizacionList/ExternalizacionListHeader'
import { ExternalizacionListDetail } from '../components/ExternalizacionList/ExternalizacionListDetail'
import { useConfirmation } from '@/shared/components/Confirmation/ConfirmationContext'
import { useNotification } from '@/shared/components/Notification/NotificationContext'

export const ExternalizacionesPage = () => {
  const { externalizaciones, isLoading, error, refetch } = useExternalizaciones()
  const deleteExternalizacionMutation = useDeleteExternalizacion()
  const navigate = useNavigate()
  const { confirm } = useConfirmation()
  const { notify } = useNotification()
  const [isDeleting, setIsDeleting] = useState(false)
  const [sortField, setSortField] = useState<SortField | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)

  const filterConfig = useMemo(
    () => ({
      busqueda: {
        type: 'search' as const,
        defaultValue: '',
        filterFn: createMultiFieldSearchFilter<Externalizacion>(ext => [
          ext.tecnica?.muestra?.codigo_epi,
          ext.tecnica?.muestra?.codigo_externo,
          ext.tecnica?.tecnica_proc?.tecnica_proc,
          ext.agencia,
          ext.servicio,
          ext.centro?.descripcion,
          ext.centro?.codigo
        ])
      },
      id_centro: {
        type: 'select' as const,
        defaultValue: null,
        filterFn: createNumericExactFilter<Externalizacion>(ext => ext.centro?.id)
      },
      soloPendientes: {
        type: 'toggle' as const,
        defaultValue: false,
        filterFn: (ext: Externalizacion) => !ext.f_recepcion
      },
      mayorCincoDias: {
        type: 'toggle' as const,
        defaultValue: false,
        filterFn: (ext: Externalizacion) => {
          if (!ext.f_envio) return false
          const envio = new Date(ext.f_envio)
          const hoy = new Date()
          const diffDays = Math.floor((hoy.getTime() - envio.getTime()) / (1000 * 60 * 60 * 24))
          return diffDays > 5
        }
      }
    }),
    []
  )

  const {
    filters,
    filteredItems: externalizacionesFiltradas,
    hasActiveFilters,
    updateFilter,
    clearFilters
  } = useListFilters(externalizaciones || [], filterConfig)

  // Función para manejar el ordenamiento
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Si ya está ordenado por este campo, cambiar dirección o quitar ordenamiento
      if (sortDirection === 'asc') {
        setSortDirection('desc')
      } else if (sortDirection === 'desc') {
        setSortField(null)
        setSortDirection(null)
      }
    } else {
      // Nuevo campo, ordenar ascendente
      setSortField(field)
      setSortDirection('asc')
    }
  }

  // Aplicar ordenamiento a las externalizaciones filtradas
  const externalizacionesOrdenadas = useMemo(() => {
    if (!sortField || !sortDirection) return externalizacionesFiltradas

    const sorted = [...externalizacionesFiltradas].sort((a, b) => {
      let valueA: string | number | undefined
      let valueB: string | number | undefined

      switch (sortField) {
        case 'muestra':
          valueA = a.tecnica?.muestra?.codigo_externo?.toLowerCase() || ''
          valueB = b.tecnica?.muestra?.codigo_externo?.toLowerCase() || ''
          break
        case 'tecnica':
          valueA = a.tecnica?.tecnica_proc?.tecnica_proc?.toLowerCase() || ''
          valueB = b.tecnica?.tecnica_proc?.tecnica_proc?.toLowerCase() || ''
          break
        case 'agencia':
          valueA = a.agencia?.toLowerCase() || ''
          valueB = b.agencia?.toLowerCase() || ''
          break
        case 'fecha':
          valueA = a.f_envio ? new Date(a.f_envio).getTime() : 0
          valueB = b.f_envio ? new Date(b.f_envio).getTime() : 0
          break
        case 'estado':
          // Ordenar por estado: Pendiente < Recibida < Con datos
          const getEstadoValue = (ext: Externalizacion) => {
            if (ext.f_recepcion_datos) return 3
            if (ext.f_recepcion) return 2
            return 1
          }
          valueA = getEstadoValue(a)
          valueB = getEstadoValue(b)
          break
      }

      if (valueA === valueB) return 0

      const comparison = valueA < valueB ? -1 : 1
      return sortDirection === 'asc' ? comparison : -comparison
    })

    return sorted
  }, [externalizacionesFiltradas, sortField, sortDirection])

  const handleDelete = async (externalizacion: Externalizacion) => {
    const confirmed = await confirm({
      title: 'Eliminar externalización',
      message: `¿Estás seguro de que deseas eliminar la externalización #${externalizacion.id_externalizacion}? Esta acción no se puede deshacer.`,
      confirmText: 'Sí, eliminar',
      cancelText: 'Cancelar',
      type: 'danger'
    })

    if (!confirmed) return

    setIsDeleting(true)
    try {
      await deleteExternalizacionMutation.mutateAsync(externalizacion.id_externalizacion)
      notify('Externalización eliminada correctamente', 'success')
    } catch (error) {
      console.error('Error eliminando externalización:', error)
      notify('Error al eliminar la externalización', 'error')
    } finally {
      setIsDeleting(false)
    }
  }

  const handlers = {
    onNew: () => navigate('/externalizaciones/nueva')
  }

  const renderFilters = () => (
    <ExternalizacionFilter
      filters={{
        busqueda: filters.busqueda as string,
        id_centro: filters.id_centro as number | null,
        soloPendientes: filters.soloPendientes as boolean,
        mayorCincoDias: filters.mayorCincoDias as boolean
      }}
      onFilterChange={updateFilter}
      onClearFilters={clearFilters}
      hasActiveFilters={hasActiveFilters}
    />
  )

  return (
    <ListPage
      title="Gestión de Externalizaciones"
      data={{
        items: externalizacionesOrdenadas,
        total: externalizaciones?.length,
        filtered: externalizacionesOrdenadas.length,
        isLoading: isLoading || isDeleting,
        error,
        refetch
      }}
      handlers={handlers}
      renderFilters={renderFilters}
      config={{
        newButtonText: 'Nueva Externalización',
        emptyStateMessage: 'No hay externalizaciones disponibles'
      }}
    >
      <div className="grid gap-2">
        <ExternalizacionListHeader
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
        />
        {externalizacionesOrdenadas.map((externalizacion: Externalizacion) => (
          <ExternalizacionListDetail
            key={externalizacion.id_externalizacion}
            externalizacion={externalizacion}
            onEdit={ext => navigate(`/externalizaciones/${ext.id_externalizacion}/editar`)}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </ListPage>
  )
}
