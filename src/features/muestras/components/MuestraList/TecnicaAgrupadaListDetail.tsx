import { ReactNode, useState } from 'react'
import { Send, Loader2, Trash2 } from 'lucide-react'
import { TecnicaAgrupada } from '../../interfaces/muestras.types'
import { ListDetail } from '@/shared/components/organisms/ListDetail'
import { IndicadorEstado } from '@/shared/components/atoms/IndicadorEstado'
import { useConfirmation } from '@/shared/components/Confirmation/ConfirmationContext'
import { useNotification } from '@/shared/components/Notification/NotificationContext'
import { useExternalizarTecnicas } from '@/features/externalizaciones/hooks/useExternalizaciones'
import { useDeleteTecnica } from '../../hooks/useMuestras'
import tecnicaService from '../../services/tecnica.service'

interface TecnicaAgrupadaListDetailProps {
  tecnicaAgrupada: TecnicaAgrupada
  fieldSpans: number[]
  muestraId: number
}

/**
 * Componente para renderizar el detalle de una Técnica Agrupada (muestras tipo array)
 */
export const TecnicaAgrupadaListDetail = ({
  tecnicaAgrupada,
  fieldSpans,
  muestraId
}: TecnicaAgrupadaListDetailProps) => {
  const { confirm } = useConfirmation()
  const { notify } = useNotification()
  const externalizarMutation = useExternalizarTecnicas()
  const deleteTecnicaMutation = useDeleteTecnica()
  const [isExternalizing, setIsExternalizing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Verificar si alguna técnica está asignada a un worklist o si no hay técnicas pendientes
  const hasWorklistAssigned = tecnicaAgrupada.asignadas > 0 || tecnicaAgrupada.en_proceso > 0
  const hasPendingTechniques = tecnicaAgrupada.pendientes > 0
  const canExternalize = !hasWorklistAssigned && hasPendingTechniques
  const canDelete = !hasWorklistAssigned && hasPendingTechniques

  // Handler para externalizar grupo de técnicas
  const handleExternalizarGrupo = async () => {
    if (!canExternalize) {
      notify(
        'No se pueden externalizar técnicas que ya están asignadas a un worklist o externalizadas',
        'warning'
      )
      return
    }

    const confirmed = await confirm({
      title: 'Externalizar grupo de técnicas',
      message: `¿Deseas externalizar todas las técnicas del proceso "${tecnicaAgrupada.proceso_nombre}"? Se crearán ${tecnicaAgrupada.pendientes} externalizaciones.`,
      confirmText: 'Sí, externalizar',
      cancelText: 'No',
      type: 'info'
    })

    if (!confirmed) return

    setIsExternalizing(true)
    try {
      // Obtener los IDs de todas las técnicas del grupo
      const tecnicaIds = await tecnicaService.getTecnicaIdsFromGroup(
        tecnicaAgrupada.primera_tecnica_id
      )
      await externalizarMutation.mutateAsync(tecnicaIds)
      notify(`${tecnicaIds.length} técnicas externalizadas correctamente`, 'success')
    } catch (error) {
      console.error('Error externalizando grupo de técnicas:', error)
      notify('Error al externalizar el grupo de técnicas', 'error')
    } finally {
      setIsExternalizing(false)
    }
  }

  // Handler para eliminar/cancelar grupo de técnicas
  const handleDeleteGrupo = async () => {
    if (!canDelete) {
      notify(
        'No se pueden eliminar técnicas que ya están asignadas a un worklist o externalizadas',
        'warning'
      )
      return
    }

    const confirmed = await confirm({
      title: 'Cancelar grupo de técnicas',
      message: `¿Estás seguro de que deseas cancelar todas las técnicas del proceso "${tecnicaAgrupada.proceso_nombre}"? Esta acción cambiará el estado a CANCELADA y eliminará ${tecnicaAgrupada.pendientes} técnicas.`,
      confirmText: 'Sí, cancelar',
      cancelText: 'No',
      type: 'danger'
    })

    if (!confirmed) return

    setIsDeleting(true)
    try {
      // Obtener los IDs de todas las técnicas del grupo
      const tecnicaIds = await tecnicaService.getTecnicaIdsFromGroup(
        tecnicaAgrupada.primera_tecnica_id
      )

      // Eliminar cada técnica del grupo
      const deletePromises = tecnicaIds.map(tecnicaId =>
        deleteTecnicaMutation.mutateAsync({
          tecnicaId,
          muestraId
        })
      )

      await Promise.all(deletePromises)
      notify(`${tecnicaIds.length} técnicas canceladas correctamente`, 'success')
    } catch (error) {
      console.error('Error cancelando grupo de técnicas:', error)
      notify('Error al cancelar el grupo de técnicas', 'error')
    } finally {
      setIsDeleting(false)
    }
  }

  // Definir los campos a renderizar según las columnas específicas para técnicas agrupadas
  const renderFields = (): ReactNode[] => [
    // Proceso/Técnica
    <span
      key={`proceso-${tecnicaAgrupada.proceso_nombre}`}
      className="font-medium text-surface-800"
    >
      {tecnicaAgrupada.proceso_nombre}
    </span>,

    // Total Posiciones
    <span key={`total-${tecnicaAgrupada.proceso_nombre}`} className="text-sm text-surface-700">
      <span className="font-semibold">{tecnicaAgrupada.total_posiciones}</span> posiciones
    </span>,

    // Contadores de Estados
    <div
      key={`contadores-${tecnicaAgrupada.proceso_nombre}`}
      className="flex gap-2 flex-wrap text-xs"
    >
      {tecnicaAgrupada.pendientes > 0 && (
        <span className="bg-surface-100 text-surface-700 px-2 py-0.5 rounded">
          {tecnicaAgrupada.pendientes} pendientes
        </span>
      )}
      {tecnicaAgrupada.asignadas > 0 && (
        <span className="bg-info-100 text-info-700 px-2 py-0.5 rounded">
          {tecnicaAgrupada.asignadas} asignadas
        </span>
      )}
      {tecnicaAgrupada.en_proceso > 0 && (
        <span className="bg-warning-100 text-warning-700 px-2 py-0.5 rounded">
          {tecnicaAgrupada.en_proceso} en proceso
        </span>
      )}
      {tecnicaAgrupada.completadas > 0 && (
        <span className="bg-success-100 text-success-700 px-2 py-0.5 rounded">
          {tecnicaAgrupada.completadas} completadas
        </span>
      )}
      {tecnicaAgrupada.resultado_erroneo > 0 && (
        <span className="bg-danger-100 text-danger-700 px-2 py-0.5 rounded">
          {tecnicaAgrupada.resultado_erroneo} erróneas
        </span>
      )}
    </div>,

    // Técnico Responsable
    <span key={`tecnico-${tecnicaAgrupada.proceso_nombre}`}>
      {tecnicaAgrupada.tecnico_resp ? (
        <span className="text-xs flex items-center gap-1 text-surface-500">
          <span>👤</span>
          <span className="truncate">{tecnicaAgrupada.tecnico_resp.nombre}</span>
        </span>
      ) : (
        <span className="text-xs text-surface-400">-</span>
      )}
    </span>,

    // Estado (si aplica - mostrar el estado más común o general)
    <IndicadorEstado
      key={`estado-${tecnicaAgrupada.proceso_nombre}`}
      estado={tecnicaAgrupada.estadoInfo}
      size="small"
    />,

    // Acciones - Externalizar y Eliminar
    <div
      key={`accion-${tecnicaAgrupada.proceso_nombre}`}
      className="flex justify-end items-center gap-2"
    >
      {/* Botón de externalizar */}
      {canExternalize ? (
        <button
          onClick={handleExternalizarGrupo}
          disabled={isExternalizing}
          className="p-1 text-primary-600 hover:bg-primary-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Externalizar grupo de técnicas"
          aria-label={`Externalizar grupo ${tecnicaAgrupada.proceso_nombre}`}
        >
          {isExternalizing ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      ) : (
        <span className="text-xs text-surface-300">-</span>
      )}

      {/* Botón de eliminar */}
      {canDelete ? (
        <button
          onClick={handleDeleteGrupo}
          disabled={isDeleting}
          className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Cancelar grupo de técnicas"
          aria-label={`Cancelar grupo ${tecnicaAgrupada.proceso_nombre}`}
        >
          {isDeleting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Trash2 className="w-4 h-4" />
          )}
        </button>
      ) : (
        <span className="text-xs text-surface-300">-</span>
      )}
    </div>
  ]

  return (
    <ListDetail
      item={tecnicaAgrupada}
      fieldSpans={fieldSpans}
      renderFields={renderFields}
      actions={undefined}
      rowClassName="grid grid-cols-12 gap-4 px-4 py-2 border rounded-lg shadow-soft transition-all items-center text-sm border-primary-200 bg-primary-50/30 hover:shadow-medium"
    />
  )
}
