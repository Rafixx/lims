import { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { Tecnica } from '../../interfaces/muestras.types'
import { ListDetail } from '@/shared/components/organisms/ListDetail'
import { IndicadorEstado } from '@/shared/components/atoms/IndicadorEstado'
import { formatDate } from '@/shared/utils/helpers'
import { ResultadoInfo } from './ResultadoInfo'

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

  // Determinar si hay resultados para mostrar
  const hasResultadosLocal = Boolean(
    tecnica.resultados &&
      (tecnica.resultados.valor !== null ||
        tecnica.resultados.valor_texto ||
        tecnica.resultados.valor_fecha ||
        tecnica.resultados.tipo_res)
  )

  // Usar prop si se pasa, sino usar cálculo local
  const hasResultados = hasResultadosProp !== undefined ? hasResultadosProp : hasResultadosLocal

  // Handler para navegar al worklist
  const handleWorklistClick = (worklistId: number) => {
    navigate(`/worklist/${worklistId}`)
  }

  // Definir los campos a renderizar
  const renderFields = (): ReactNode[] => {
    const baseFields: ReactNode[] = [
      // Fecha Estado
      <span key={`fecha-${tecnica.id_tecnica}`} className="text-xs text-surface-400 font-mono">
        #{formatDate(tecnica.fecha_estado)}
      </span>,
      // Técnica
      <span key={`tecnica-${tecnica.id_tecnica}`} className="font-medium text-surface-800">
        {tecnica.tecnica_proc?.tecnica_proc || 'Sin técnica'}
      </span>,
      // Worklist
      <span key={`worklist-${tecnica.id_tecnica}`}>
        {tecnica.worklist ? (
          <button
            onClick={() => handleWorklistClick(tecnica.worklist!.id_worklist)}
            className="flex items-center gap-1 hover:opacity-80 transition-opacity cursor-pointer"
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
            className="text-xs text-surface-500 flex items-center gap-1"
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
    if (hasResultados) {
      baseFields.push(
        <ResultadoInfo key={`resultado-${tecnica.id_tecnica}`} resultado={tecnica.resultados} />
      )
    }

    // Estado siempre al final
    baseFields.push(
      <IndicadorEstado
        key={`estado-${tecnica.id_tecnica}`}
        estado={tecnica.estadoInfo}
        size="small"
      />
    )

    return baseFields
  }

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
