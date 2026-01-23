import { ReactNode, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Trash2, Loader2, Send } from 'lucide-react'
import { Tecnica } from '../../interfaces/muestras.types'
import { ListDetail } from '@/shared/components/organisms/ListDetail'
import { IndicadorEstado } from '@/shared/components/atoms/IndicadorEstado'
import { formatDate, isTecnicaInWorklist } from '@/shared/utils/helpers'
import { ResultadoInfo } from './ResultadoInfo'
import { useDeleteTecnica } from '../../hooks/useMuestras'
import { useConfirmation } from '@/shared/components/Confirmation/ConfirmationContext'
import { useNotification } from '@/shared/components/Notification/NotificationContext'
import { useExternalizarTecnicas } from '@/features/externalizaciones/hooks/useExternalizaciones'

interface TecnicaListDetailProps {
  tecnica: Tecnica
  fieldSpans: number[]
  showActions?: boolean
  hasResultados?: boolean // ✅ Nuevo prop para sincronizar con el padre
}

/**
 * Componente específico para renderizar el detalle de una Técnica
 * Wrapper sobre el componente genérico ListDetail
 */
export const TecnicaListDetail = ({
  tecnica,
  fieldSpans,
  showActions = false,
  hasResultados: hasResultadosProp
}: TecnicaListDetailProps) => {
  const navigate = useNavigate()
  const { confirm } = useConfirmation()
  const { notify } = useNotification()
  const deleteTecnicaMutation = useDeleteTecnica()
  const externalizarMutation = useExternalizarTecnicas()
  const [isDeleting, setIsDeleting] = useState(false)
  const [isExternalizing, setIsExternalizing] = useState(false)

  // Determinar si hay resultados para mostrar
  const hasResultadosLocal = Boolean(
    tecnica.resultados &&
      tecnica.resultados.length > 0 &&
      tecnica.resultados.some(
        resultado =>
          resultado.valor !== null ||
          resultado.valor_texto ||
          resultado.valor_fecha ||
          resultado.tipo_res
      )
  )

  // Usar prop si se pasa, sino usar cálculo local
  const hasResultados = hasResultadosProp !== undefined ? hasResultadosProp : hasResultadosLocal

  // Handler para navegar al worklist
  const handleWorklistClick = (worklistId: number) => {
    navigate(`/worklist/${worklistId}`)
  }

  // Handler para eliminar técnica
  const handleDeleteTecnica = async () => {
    const tecnicaNombre = tecnica.tecnica_proc?.tecnica_proc || 'esta técnica'

    const confirmed = await confirm({
      title: 'Cancelar técnica',
      message: `¿Estás seguro de que deseas cancelar la técnica "${tecnicaNombre}"? Esta acción cambiará el estado a CANCELADA y eliminará la técnica.`,
      confirmText: 'Sí, cancelar',
      cancelText: 'No',
      type: 'danger'
    })

    if (!confirmed) return

    setIsDeleting(true)
    try {
      await deleteTecnicaMutation.mutateAsync({
        tecnicaId: tecnica.id_tecnica,
        muestraId: tecnica.muestra.id_muestra
      })
      notify('Técnica cancelada correctamente', 'success')
    } catch (error) {
      console.error('Error cancelando técnica:', error)
      notify('Error al cancelar la técnica', 'error')
    } finally {
      setIsDeleting(false)
    }
  }

  // Handler para externalizar técnica
  const handleExternalizarTecnica = async () => {
    const tecnicaNombre = tecnica.tecnica_proc?.tecnica_proc || 'esta técnica'

    const confirmed = await confirm({
      title: 'Externalizar técnica',
      message: `¿Deseas externalizar la técnica "${tecnicaNombre}"? Se creará una externalización para esta técnica.`,
      confirmText: 'Sí, externalizar',
      cancelText: 'No',
      type: 'info'
    })

    if (!confirmed) return

    setIsExternalizing(true)
    try {
      await externalizarMutation.mutateAsync([tecnica.id_tecnica])
      notify('Técnica externalizada correctamente', 'success')
    } catch (error) {
      console.error('Error externalizando técnica:', error)
      notify('Error al externalizar la técnica', 'error')
    } finally {
      setIsExternalizing(false)
    }
  }

  // Verificar si la técnica puede ser eliminada o externalizada
  const isExternalized =
    tecnica.id_estado === 16 || tecnica.id_estado === 17 || tecnica.id_estado === 18
  const canDelete = !isTecnicaInWorklist(tecnica) && !isExternalized
  const canExternalize = !isTecnicaInWorklist(tecnica) && !isExternalized
  const isCancelled = tecnica.id_estado === 13

  // Definir los campos a renderizar
  const renderFields = (): ReactNode[] => {
    const baseFields: ReactNode[] = [
      // Fecha Estado
      <span
        key={`fecha-${tecnica.id_tecnica}`}
        className={`text-xs font-mono ${isCancelled ? 'text-surface-300 line-through' : 'text-surface-400'}`}
      >
        #{formatDate(tecnica.fecha_estado)}
      </span>,
      // Técnica
      <span
        key={`tecnica-${tecnica.id_tecnica}`}
        className={`font-medium ${isCancelled ? 'text-surface-400 line-through' : 'text-surface-800'}`}
      >
        {tecnica.tecnica_proc?.tecnica_proc || 'Sin técnica'}
      </span>,
      // Worklist
      <span key={`worklist-${tecnica.id_tecnica}`}>
        {tecnica.worklist ? (
          <button
            onClick={() => handleWorklistClick(tecnica.worklist!.id_worklist)}
            className={`flex items-center gap-1 hover:opacity-80 transition-opacity cursor-pointer ${isCancelled ? 'opacity-50' : ''}`}
            title={`Ver worklist: ${tecnica.worklist.nombre}`}
          >
            <span>📋</span>
            <span className="text-xs bg-info-100 text-info-700 rounded px-2 py-0.5 font-semibold hover:bg-info-200 transition-colors">
              {tecnica.worklist.nombre}
            </span>
          </button>
        ) : (
          <span className="text-xs text-surface-400">-</span>
        )}
      </span>,
      // Técnico Responsable
      <span key={`tecnico-${tecnica.id_tecnica}`}>
        {tecnica.tecnico_resp ? (
          <span
            className={`text-xs flex items-center gap-1 ${isCancelled ? 'text-surface-300 line-through' : 'text-surface-500'}`}
            title={tecnica.tecnico_resp.nombre || ''}
          >
            <span>👤</span>
            <span className="truncate">{tecnica.tecnico_resp.nombre}</span>
          </span>
        ) : (
          <span className="text-xs text-surface-400">-</span>
        )}
      </span>
    ]

    // Si hay resultados, agregar columna de resultados antes del estado
    if (hasResultados && tecnica.resultados && tecnica.resultados.length > 0) {
      baseFields.push(
        <div
          key={`resultado-${tecnica.id_tecnica}`}
          className={`space-y-1 ${isCancelled ? 'opacity-50' : ''}`}
        >
          {tecnica.resultados.map((resultado, index) => (
            <ResultadoInfo key={`resultado-${tecnica.id_tecnica}-${index}`} resultado={resultado} />
          ))}
        </div>
      )
    }

    // Estado
    baseFields.push(
      <IndicadorEstado
        key={`estado-${tecnica.id_tecnica}`}
        estado={tecnica.estadoInfo}
        size="small"
      />
    )

    // Columna de acciones (externalizar y eliminar)
    baseFields.push(
      <div key={`acciones-${tecnica.id_tecnica}`} className="flex justify-end items-center gap-2">
        {/* Botón de externalizar */}
        {canExternalize && !isCancelled ? (
          <button
            onClick={handleExternalizarTecnica}
            disabled={isExternalizing}
            className="p-1 text-primary-600 hover:bg-primary-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Externalizar técnica"
            aria-label={`Externalizar técnica ${tecnica.tecnica_proc?.tecnica_proc || ''}`}
          >
            {isExternalizing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        ) : (
          !isCancelled && <span className="text-xs text-surface-300">-</span>
        )}

        {/* Botón de eliminar */}
        {canDelete && !isCancelled ? (
          <button
            onClick={handleDeleteTecnica}
            disabled={isDeleting}
            className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Cancelar técnica"
            aria-label={`Cancelar técnica ${tecnica.tecnica_proc?.tecnica_proc || ''}`}
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
    )

    return baseFields
  }

  return (
    <ListDetail
      item={tecnica}
      fieldSpans={fieldSpans}
      renderFields={renderFields}
      actions={showActions ? [] : undefined}
      rowClassName={`grid grid-cols-12 gap-4 px-4 py-2 border rounded-lg shadow-soft transition-all items-center text-sm ${
        isCancelled
          ? 'border-surface-200 bg-surface-50 opacity-70'
          : 'border-surface-200 bg-white hover:shadow-medium'
      }`}
    />
  )
}
