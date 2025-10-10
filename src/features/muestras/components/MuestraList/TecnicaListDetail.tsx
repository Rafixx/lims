import { ReactNode } from 'react'
import { Tecnica } from '../../interfaces/muestras.types'
import { ListDetail } from '@/shared/components/organisms/ListDetail'
import { IndicadorEstado } from '@/shared/components/atoms/IndicadorEstado'
import { formatDate } from '@/shared/utils/helpers'

interface TecnicaListDetailProps {
  tecnica: Tecnica
  fieldSpans: number[]
  showActions?: boolean
}

/**
 * Componente específico para renderizar el detalle de una Técnica
 * Wrapper sobre el componente genérico ListDetail
 */
export const TecnicaListDetail = ({
  tecnica,
  fieldSpans,
  showActions = false
}: TecnicaListDetailProps) => {
  // Definir los campos a renderizar
  const renderFields = (): ReactNode[] => [
    // Fecha Estado
    <span key={tecnica.id_tecnica} className="text-xs text-surface-400 font-mono">
      #{formatDate(tecnica.fecha_estado)}
    </span>,
    // Técnica
    <span key={tecnica.id_tecnica} className="font-medium text-surface-800">
      {tecnica.tecnica_proc?.tecnica_proc || 'Sin técnica'}
    </span>,
    // Worklist
    tecnica.worklist ? (
      <span className="flex items-center gap-1">
        <span>📋</span>
        <span className="text-xs bg-info-100 text-info-700 rounded px-2 py-0.5 font-semibold">
          {tecnica.worklist.nombre}
        </span>
      </span>
    ) : (
      <span className="text-xs text-surface-400">-</span>
    ),
    // Técnico Responsable
    tecnica.tecnico_resp ? (
      <span
        className="text-xs text-surface-500 flex items-center gap-1"
        title={tecnica.tecnico_resp.nombre || ''}
      >
        <span>👤</span>
        <span className="truncate">{tecnica.tecnico_resp.nombre}</span>
      </span>
    ) : (
      <span className="text-xs text-surface-400">-</span>
    ),
    // Estado
    <IndicadorEstado key={tecnica.id_tecnica} estado={tecnica.estadoInfo} size="small" />
  ]

  return (
    <ListDetail
      item={tecnica}
      fieldSpans={fieldSpans}
      renderFields={renderFields}
      actions={showActions ? [] : undefined}
      rowClassName="grid grid-cols-12 gap-4 px-4 py-2 border border-surface-200 rounded-lg shadow-soft bg-white hover:shadow-medium transition-all items-center text-sm"
    />
  )
}
