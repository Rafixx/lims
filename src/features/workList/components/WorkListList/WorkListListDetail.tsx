import { ReactNode } from 'react'
import { Trash2, Clock, Edit } from 'lucide-react'
import type { Worklist } from '../../interfaces/worklist.types'
import { ListDetail, ListDetailAction } from '@/shared/components/organisms/ListDetail'
import { formatDateShort } from '@/shared/utils/helpers'
import { IndicadorEstado } from '@/shared/components/atoms/IndicadorEstado'
import { ESTADO_TECNICA } from '@/shared/interfaces/estados.types'
import { Badge } from '@/shared/components/molecules/Badge'
import { useLotesPendientes } from '@/features/tecnicasReactivos/hooks/useTecnicasReactivos'

interface WorkListListDetailProps {
  worklist: Worklist
  onEdit: (worklist: Worklist) => void
  onDelete: (id: number, nombre: string) => void
  fieldSpans: number[]
  isLast?: boolean
}

export const WorkListListDetail = ({
  worklist,
  onEdit,
  onDelete,
  fieldSpans,
  isLast = false
}: WorkListListDetailProps) => {
  const completadas =
    worklist.tecnicas.filter(t => t.id_estado === ESTADO_TECNICA.COMPLETADA_TECNICA).length || 0
  const total = worklist.tecnicas.length || 0
  const pct = total > 0 ? Math.round((completadas / total) * 100) : 0

  const { data: lotesPendientesData } = useLotesPendientes(worklist.id_worklist)
  const lotesPendientes = lotesPendientesData?.pendientes || 0

  // Borde izquierdo según estado del worklist
  const leftBorder =
    lotesPendientes > 0
      ? 'border-l-warning-400'
      : pct === 100
        ? 'border-l-success-500'
        : pct > 0
          ? 'border-l-primary-400'
          : 'border-l-surface-200'

  // Color de la barra de progreso
  const barColor =
    lotesPendientes > 0
      ? 'bg-warning-400'
      : pct === 100
        ? 'bg-success-500'
        : 'bg-primary-500'

  const rowClassName = [
    'group grid grid-cols-12 gap-2 pl-3 pr-3 py-3 border-l-4 transition-colors items-center text-sm',
    leftBorder,
    isLast ? '' : 'border-b border-surface-100',
    'hover:bg-surface-50'
  ].join(' ')

  const renderFields = (): ReactNode[] => [
    // 1. Nombre — acción primaria de navegación
    <div key="nombre" className="min-w-0">
      <button
        onClick={() => onEdit(worklist)}
        className="font-medium text-surface-900 hover:text-primary-700 hover:underline text-left leading-snug w-full truncate transition-colors"
        title={`Abrir "${worklist.nombre}"`}
      >
        {worklist.nombre}
      </button>
      {lotesPendientes > 0 && (
        <div className="mt-0.5">
          <Badge variant="warning" size="sm">
            {lotesPendientes} lote{lotesPendientes !== 1 ? 's' : ''} pendiente{lotesPendientes !== 1 ? 's' : ''}
          </Badge>
        </div>
      )}
    </div>,

    // 2. Técnica / Proceso
    <span key="tecnica" className="text-surface-600 truncate text-xs leading-relaxed">
      {worklist.tecnica_proc ?? <span className="text-surface-300">—</span>}
    </span>,

    // 3. Avance: "X / Y" + barra
    <div key="avance" className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-sm font-semibold text-surface-700 tabular-nums">
          {completadas}
          <span className="font-normal text-surface-400"> / {total}</span>
        </span>
        <span className="text-xs text-surface-400 tabular-nums">{pct}%</span>
      </div>
      <div className="w-full bg-surface-100 rounded-full h-1.5 overflow-hidden">
        <div
          className={`${barColor} h-1.5 rounded-full transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>,

    // 4. Fecha
    <div key="fecha" className="flex items-center gap-1 text-xs text-surface-400">
      <Clock size={12} className="flex-shrink-0" />
      <span className="truncate">{formatDateShort(worklist.create_dt)}</span>
    </div>
  ]

  const actions: ListDetailAction[] = [
    {
      icon: <Edit className="w-3.5 h-3.5" />,
      onClick: () => onEdit(worklist),
      title: 'Editar lista',
      className:
        'p-1.5 text-surface-300 group-hover:text-surface-500 hover:!text-primary-600 hover:bg-primary-50 rounded transition-colors'
    },
    {
      icon: <Trash2 className="w-3.5 h-3.5" />,
      onClick: () => onDelete(worklist.id_worklist, worklist.nombre),
      title: 'Eliminar lista',
      className:
        'p-1.5 text-surface-300 group-hover:text-surface-500 hover:!text-danger-600 hover:bg-danger-50 rounded transition-colors'
    }
  ]

  const expandedContent = (
    <div className="space-y-1">
      {worklist.tecnicas && worklist.tecnicas.length > 0 ? (
        <>
          <p className="text-xs font-semibold text-surface-500 mb-2 uppercase tracking-wide">
            Técnicas ({worklist.tecnicas.length})
          </p>
          {worklist.tecnicas.map((tecnica, index) => (
            <div
              key={index}
              className="flex items-center justify-between px-3 py-2 bg-white border border-surface-100 rounded-lg text-sm"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-surface-300 font-mono text-xs w-6 shrink-0 text-right">
                  {index + 1}
                </span>
                <span className="font-medium text-surface-800 truncate">
                  {tecnica.muestra?.codigo_epi || tecnica.muestra?.codigo_externo || 'Sin código'}
                </span>
                {tecnica.tecnico_resp && (
                  <span className="text-xs text-surface-400 shrink-0">
                    {tecnica.tecnico_resp.nombre}
                  </span>
                )}
              </div>
              {tecnica.estadoInfo && (
                <IndicadorEstado estado={tecnica.estadoInfo} size="small" />
              )}
            </div>
          ))}
        </>
      ) : (
        <p className="text-sm text-surface-400">No hay técnicas asociadas a esta lista.</p>
      )}
    </div>
  )

  return (
    <ListDetail
      item={worklist}
      fieldSpans={fieldSpans}
      renderFields={renderFields}
      actions={actions}
      expandedContent={expandedContent}
      rowClassName={rowClassName}
    />
  )
}
