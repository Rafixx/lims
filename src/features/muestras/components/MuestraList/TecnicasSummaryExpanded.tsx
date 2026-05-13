// src/features/muestras/components/MuestraList/TecnicasSummaryExpanded.tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, ChevronRight, Grid3x3, Loader2, Trash2 } from 'lucide-react'
import { Tecnica, TecnicaAgrupada } from '../../interfaces/muestras.types'
import { IndicadorEstado } from '@/shared/components/atoms/IndicadorEstado'
import { isTecnicaInWorklist } from '@/shared/utils/helpers'
import { useDeleteTecnica, useCancelarGrupoTecnicas, useTecnicasFromGroup } from '../../hooks/useMuestras'
import { useConfirmation } from '@/shared/components/Confirmation/ConfirmationContext'
import { useNotification } from '@/shared/components/Notification/NotificationContext'
import { TecnicaStateCounts } from '../../utils/aggregateTecnicaStates'

// ── Chips de estado reutilizables ──────────────────────────────────────────────

const CHIP_DEFS: { key: keyof TecnicaStateCounts; label: string; cls: string }[] = [
  { key: 'pendientes',       label: 'pend',  cls: 'bg-surface-100 text-surface-700' },
  { key: 'asignadas',        label: 'asign', cls: 'bg-info-100 text-info-700' },
  { key: 'en_proceso',       label: 'proc',  cls: 'bg-warning-100 text-warning-700' },
  { key: 'completadas',      label: 'ok',    cls: 'bg-success-100 text-success-700' },
  { key: 'resultado_erroneo',label: 'err',   cls: 'bg-danger-100 text-danger-700' }
]

export const TecnicaStateChips = ({ counts }: { counts: TecnicaStateCounts }) => {
  const visible = CHIP_DEFS.filter(d => counts[d.key] > 0)
  if (visible.length === 0) return <span className="text-xs text-surface-400">—</span>
  return (
    <div className="flex flex-wrap gap-0.5">
      {visible.map(d => (
        <span key={d.key} className={`text-xs px-1 py-0.5 rounded font-medium ${d.cls}`}>
          {counts[d.key]} {d.label}
        </span>
      ))}
    </div>
  )
}

// ── Componente principal ───────────────────────────────────────────────────────

interface Props {
  tecnicas: Tecnica[] | TecnicaAgrupada[]
  muestraId: number
  isLoading: boolean
}

export const TecnicasSummaryExpanded = ({ tecnicas, muestraId, isLoading }: Props) => {
  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-surface-500 py-2 px-4">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Cargando técnicas...</span>
      </div>
    )
  }

  if (!tecnicas || tecnicas.length === 0) {
    return (
      <p className="text-sm text-surface-600 py-2 px-4">
        No hay técnicas asociadas a esta muestra.
      </p>
    )
  }

  const isTecnicaAgrupadaType = 'proceso_nombre' in tecnicas[0]

  return (
    <div className="space-y-0">
      {/* Header de columnas */}
      <div className="grid grid-cols-12 gap-2 px-3 py-1.5 text-xs font-medium text-surface-500 bg-surface-50 border-b border-surface-200">
        <div className="col-span-3">Técnica / Proceso</div>
        <div className="col-span-2">Worklist</div>
        <div className="col-span-2">Técnico</div>
        <div className="col-span-3">Estado</div>
        <div className="col-span-2 text-right">Acciones</div>
      </div>

      {isTecnicaAgrupadaType
        ? (tecnicas as TecnicaAgrupada[]).map(t => (
            <TecnicaAgrupadaRow
              key={t.primera_tecnica_id}
              tecnica={t}
              muestraId={muestraId}
            />
          ))
        : (tecnicas as Tecnica[]).map(t => (
            <TecnicaTuboRow key={t.id_tecnica} tecnica={t} muestraId={muestraId} />
          ))}
    </div>
  )
}

// ── Fila para técnica individual (tubos) ──────────────────────────────────────

const TecnicaTuboRow = ({
  tecnica,
  muestraId
}: {
  tecnica: Tecnica
  muestraId: number
}) => {
  const navigate = useNavigate()
  const { confirm } = useConfirmation()
  const { notify } = useNotification()
  const deleteMutation = useDeleteTecnica()
  const [isDeleting, setIsDeleting] = useState(false)

  const isCancelled = tecnica.id_estado === 13
  const isExternalized = [16, 17, 18].includes(tecnica.id_estado ?? -1)
  const canDelete = !isTecnicaInWorklist(tecnica) && !isExternalized && !isCancelled

  const handleDelete = async () => {
    const confirmed = await confirm({
      title: 'Cancelar técnica',
      message: `¿Cancelar la técnica "${tecnica.tecnica_proc?.tecnica_proc || 'esta técnica'}"? El estado cambiará a CANCELADA.`,
      confirmText: 'Sí, cancelar',
      cancelText: 'No',
      type: 'danger'
    })
    if (!confirmed) return
    setIsDeleting(true)
    try {
      await deleteMutation.mutateAsync({ tecnicaId: tecnica.id_tecnica, muestraId })
      notify('Técnica cancelada correctamente', 'success')
    } catch {
      notify('Error al cancelar la técnica', 'error')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div
      className={`grid grid-cols-12 gap-2 px-3 py-2 items-center text-sm border-b border-surface-100 hover:bg-surface-50 transition-colors ${isCancelled ? 'opacity-60' : ''}`}
    >
      <div className="col-span-3">
        <span
          className={`font-medium ${isCancelled ? 'line-through text-surface-400' : 'text-surface-800'}`}
        >
          {tecnica.tecnica_proc?.tecnica_proc || 'Sin técnica'}
        </span>
      </div>
      <div className="col-span-2">
        {tecnica.worklist ? (
          <button
            onClick={() => navigate(`/worklist/${tecnica.worklist!.id_worklist}`)}
            className="text-xs bg-info-100 text-info-700 rounded px-2 py-0.5 font-semibold hover:bg-info-200 transition-colors"
          >
            {tecnica.worklist.nombre}
          </button>
        ) : (
          <span className="text-xs text-surface-400">—</span>
        )}
      </div>
      <div className="col-span-2">
        <span className="text-xs text-surface-600 truncate block">
          {tecnica.tecnico_resp?.nombre || '—'}
        </span>
      </div>
      <div className="col-span-3">
        <IndicadorEstado estado={tecnica.estadoInfo} size="small" />
      </div>
      <div className="col-span-2 flex justify-end">
        {canDelete ? (
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-1 text-danger-600 hover:bg-danger-50 rounded transition-colors disabled:opacity-50"
            title="Cancelar técnica"
          >
            {isDeleting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </button>
        ) : (
          <span className="text-xs text-surface-300">—</span>
        )}
      </div>
    </div>
  )
}

// ── Fila para técnica agrupada (placas) ──────────────────────────────────────

const TecnicaAgrupadaRow = ({
  tecnica,
  muestraId
}: {
  tecnica: TecnicaAgrupada
  muestraId: number
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const { confirm } = useConfirmation()
  const { notify } = useNotification()
  const cancelarGrupoMutation = useCancelarGrupoTecnicas()
  const { tecnicas: tecnicasIndividuales, isLoading } = useTecnicasFromGroup(
    tecnica.primera_tecnica_id,
    isExpanded
  )

  const canDelete =
    tecnica.asignadas === 0 && tecnica.en_proceso === 0 && tecnica.pendientes > 0

  const handleDelete = async () => {
    const confirmed = await confirm({
      title: 'Cancelar grupo de técnicas',
      message: `¿Cancelar todas las técnicas del proceso "${tecnica.proceso_nombre}"? Se cancelarán ${tecnica.pendientes} técnicas.`,
      confirmText: 'Sí, cancelar',
      cancelText: 'No',
      type: 'danger'
    })
    if (!confirmed) return
    try {
      const resultado = await cancelarGrupoMutation.mutateAsync({
        primeraTecnicaId: tecnica.primera_tecnica_id,
        muestraId
      })
      notify(`${resultado.canceladas} técnicas canceladas correctamente`, 'success')
    } catch {
      notify('Error al cancelar el grupo', 'error')
    }
  }

  const counts: TecnicaStateCounts = {
    pendientes: tecnica.pendientes,
    asignadas: tecnica.asignadas,
    en_proceso: tecnica.en_proceso,
    completadas: tecnica.completadas,
    resultado_erroneo: tecnica.resultado_erroneo
  }

  return (
    <div>
      <div className="grid grid-cols-12 gap-2 px-3 py-2 items-center text-sm border-b border-surface-100 hover:bg-surface-50 transition-colors">
        <div className="col-span-3 flex items-center gap-1.5">
          <button
            onClick={() => setIsExpanded(v => !v)}
            className="flex items-center gap-1 hover:opacity-70 transition-opacity shrink-0"
            title={isExpanded ? 'Contraer posiciones' : 'Expandir posiciones'}
          >
            {isExpanded ? (
              <ChevronDown className="w-3.5 h-3.5 text-primary-600" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-primary-600" />
            )}
            <Grid3x3 className="w-3.5 h-3.5 text-primary-600" />
          </button>
          <span className="font-medium text-surface-800 truncate">{tecnica.proceso_nombre}</span>
        </div>
        <div className="col-span-2 text-xs text-surface-400">—</div>
        <div className="col-span-2">
          <span className="text-xs text-surface-600 truncate block">
            {tecnica.tecnico_resp?.nombre || '—'}
          </span>
        </div>
        <div className="col-span-3">
          <TecnicaStateChips counts={counts} />
        </div>
        <div className="col-span-2 flex justify-end">
          {canDelete ? (
            <button
              onClick={handleDelete}
              disabled={cancelarGrupoMutation.isPending}
              className="p-1 text-danger-600 hover:bg-danger-50 rounded transition-colors disabled:opacity-50"
              title="Cancelar grupo"
            >
              {cancelarGrupoMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </button>
          ) : (
            <span className="text-xs text-surface-300">—</span>
          )}
        </div>
      </div>

      {/* Sub-expansión: posiciones individuales de la placa */}
      {isExpanded && (
        <div className="ml-8 border-l-2 border-primary-200 pl-4 py-2">
          {isLoading ? (
            <div className="flex items-center gap-2 text-sm text-surface-500">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Cargando posiciones...</span>
            </div>
          ) : tecnicasIndividuales.length === 0 ? (
            <div className="text-sm text-surface-500">No hay posiciones disponibles</div>
          ) : (
            <div className="space-y-1">
              <div className="grid grid-cols-12 gap-2 px-3 py-1.5 text-xs font-medium text-surface-600 bg-surface-50 rounded border border-surface-200">
                <div className="col-span-2">Posición</div>
                <div className="col-span-3">Cód EPI</div>
                <div className="col-span-3">Cód Externo</div>
                <div className="col-span-2">Técnico</div>
                <div className="col-span-2">Estado</div>
              </div>
              {tecnicasIndividuales.map(t => (
                <div
                  key={t.id_tecnica}
                  className="grid grid-cols-12 gap-2 px-3 py-2 text-sm bg-white rounded border border-surface-200 hover:border-primary-300 transition-colors"
                >
                  <div className="col-span-2">
                    <span className="font-mono font-semibold text-primary-700 bg-primary-50 px-2 py-0.5 rounded text-xs">
                      {t.muestraArray?.posicion_placa || '—'}
                    </span>
                  </div>
                  <div className="col-span-3">
                    <span className="font-mono text-xs text-surface-900 truncate block">
                      {t.muestraArray?.codigo_epi || '—'}
                    </span>
                  </div>
                  <div className="col-span-3">
                    <span className="font-mono text-xs text-surface-700 truncate block">
                      {t.muestraArray?.codigo_externo || '—'}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-xs text-surface-600 truncate block">
                      {t.tecnico_resp?.nombre || '—'}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <IndicadorEstado estado={t.estadoInfo} size="small" />
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
