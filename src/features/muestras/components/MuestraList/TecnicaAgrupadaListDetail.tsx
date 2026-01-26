import { ReactNode, useState } from 'react'
import { Loader2, Trash2, ChevronDown, ChevronRight, Grid3x3 } from 'lucide-react'
import { TecnicaAgrupada } from '../../interfaces/muestras.types'
import { ListDetail } from '@/shared/components/organisms/ListDetail'
import { IndicadorEstado } from '@/shared/components/atoms/IndicadorEstado'
import { useConfirmation } from '@/shared/components/Confirmation/ConfirmationContext'
import { useNotification } from '@/shared/components/Notification/NotificationContext'
import { useDeleteTecnica, useTecnicasFromGroup } from '../../hooks/useMuestras'
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
  const deleteTecnicaMutation = useDeleteTecnica()
  const [isDeleting, setIsDeleting] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  // Cargar técnicas del grupo solo cuando está expandido
  const { tecnicas, isLoading: isLoadingTecnicas, error: errorTecnicas } = useTecnicasFromGroup(
    tecnicaAgrupada.primera_tecnica_id,
    isExpanded
  )

  // Log para debugging
  if (isExpanded) {
    console.log('[TecnicaAgrupadaListDetail] Expandido:', {
      primera_tecnica_id: tecnicaAgrupada.primera_tecnica_id,
      isLoading: isLoadingTecnicas,
      tecnicas: tecnicas.length,
      error: errorTecnicas
    })
  }

  // Verificar si alguna técnica está asignada a un worklist o si no hay técnicas pendientes
  const hasWorklistAssigned = tecnicaAgrupada.asignadas > 0 || tecnicaAgrupada.en_proceso > 0
  const hasPendingTechniques = tecnicaAgrupada.pendientes > 0
  const canDelete = !hasWorklistAssigned && hasPendingTechniques

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
    // Proceso/Técnica con botón de expansión
    <div key={`proceso-${tecnicaAgrupada.proceso_nombre}`} className="flex items-center gap-2">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-1 hover:opacity-80 transition-opacity"
        title={isExpanded ? 'Contraer' : 'Expandir técnicas individuales'}
      >
        {isExpanded ? (
          <ChevronDown className="w-4 h-4 text-primary-600 flex-shrink-0" />
        ) : (
          <ChevronRight className="w-4 h-4 text-primary-600 flex-shrink-0" />
        )}
        <Grid3x3 className="w-4 h-4 text-primary-600 flex-shrink-0" />
      </button>
      <span className="font-medium text-surface-800">{tecnicaAgrupada.proceso_nombre}</span>
    </div>,

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

    // Acciones - Eliminar
    <div
      key={`accion-${tecnicaAgrupada.proceso_nombre}`}
      className="flex justify-end items-center gap-2"
    >
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
    <div>
      <ListDetail
        item={tecnicaAgrupada}
        fieldSpans={fieldSpans}
        renderFields={renderFields}
        actions={undefined}
        rowClassName="grid grid-cols-12 gap-4 px-4 py-2 border rounded-lg shadow-soft transition-all items-center text-sm border-primary-200 bg-primary-50/30 hover:shadow-medium"
      />

      {/* Lista expandible de técnicas individuales */}
      {isExpanded && (
        <div className="mt-2 ml-8 border-l-2 border-primary-200 pl-4">
          {isLoadingTecnicas ? (
            <div className="flex items-center gap-2 text-sm text-surface-500 py-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Cargando técnicas...</span>
            </div>
          ) : errorTecnicas ? (
            <div className="text-sm text-red-600 py-2">
              Error al cargar técnicas: {errorTecnicas.message}
            </div>
          ) : tecnicas.length === 0 ? (
            <div className="text-sm text-surface-500 py-2">No hay técnicas disponibles</div>
          ) : (
            <div className="space-y-1">
              {/* Header de la tabla */}
              <div className="grid grid-cols-12 gap-2 px-3 py-2 text-xs font-medium text-surface-600 bg-surface-50 rounded border border-surface-200">
                <div className="col-span-2">Posición</div>
                <div className="col-span-3">Código EPI</div>
                <div className="col-span-3">Código Externo</div>
                <div className="col-span-2">Técnico</div>
                <div className="col-span-2">Estado</div>
              </div>

              {/* Filas de técnicas */}
              {tecnicas.map(tecnica => (
                <div
                  key={tecnica.id_tecnica}
                  className="grid grid-cols-12 gap-2 px-3 py-2 text-sm bg-white rounded border border-surface-200 hover:border-primary-300 hover:shadow-sm transition-all"
                >
                  {/* Posición de la placa */}
                  <div className="col-span-2">
                    <span className="font-mono font-semibold text-primary-700 bg-primary-50 px-2 py-0.5 rounded text-xs">
                      {tecnica.muestraArray?.posicion_placa || '-'}
                    </span>
                  </div>

                  {/* Código EPI */}
                  <div className="col-span-3">
                    <span className="font-mono text-xs text-surface-900 truncate block">
                      {tecnica.muestraArray?.codigo_epi || '-'}
                    </span>
                  </div>

                  {/* Código Externo */}
                  <div className="col-span-3">
                    <span className="font-mono text-xs text-surface-700 truncate block">
                      {tecnica.muestraArray?.codigo_externo || '-'}
                    </span>
                  </div>

                  {/* Técnico */}
                  <div className="col-span-2">
                    {tecnica.tecnico_resp ? (
                      <span className="text-xs text-surface-600 truncate block">
                        {tecnica.tecnico_resp.nombre}
                      </span>
                    ) : (
                      <span className="text-xs text-surface-400">-</span>
                    )}
                  </div>

                  {/* Estado */}
                  <div className="col-span-2">
                    {tecnica.estadoInfo ? (
                      <IndicadorEstado estado={tecnica.estadoInfo} size="small" />
                    ) : (
                      <span className="text-xs text-surface-400">-</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
