import { ReactNode } from 'react'
import { Trash2, Clock, BarChart3, CheckCircle, Edit } from 'lucide-react'
import type { Worklist } from '../../interfaces/worklist.types'
import { ListDetail, ListDetailAction } from '@/shared/components/organisms/ListDetail'
import { formatDateShort } from '@/shared/utils/helpers'
import { IndicadorEstado } from '@/shared/components/atoms/IndicadorEstado'
import { ESTADO_TECNICA } from '@/shared/interfaces/estados.types'

interface WorkListListDetailProps {
  worklist: Worklist
  onEdit: (worklist: Worklist) => void
  onDelete: (id: number, nombre: string) => void
  // onView: () => void
  fieldSpans: number[]
}

/**
 * Componente específico para renderizar el detalle de un WorkList
 * Wrapper sobre el componente genérico ListDetail
 */
export const WorkListListDetail = ({
  worklist,
  onEdit,
  onDelete,
  // onView,
  fieldSpans
}: WorkListListDetailProps) => {
  const completadas =
    worklist.tecnicas.filter(tecnica => tecnica.id_estado === ESTADO_TECNICA.COMPLETADA_TECNICA)
      .length || 0
  const total = worklist.tecnicas.length || 0
  const completionPercentage = total > 0 ? Math.round((completadas / total) * 100) : 0

  // Definir los campos a renderizar
  const renderFields = (): ReactNode[] => [
    // Nombre del WorkList
    <div
      key={worklist.id_worklist}
      className="flex items-center gap-2"
      //  onClick={onView}
    >
      <span className="text-gray-700">{worklist.nombre}</span>
    </div>,
    // Técnica/Proceso
    <span key={worklist.id_worklist} className="text-gray-700">
      {worklist.tecnica_proc || '-'}
    </span>,
    // Total de muestras con icono
    <div key={worklist.id_worklist} className="flex items-center gap-2">
      <BarChart3 size={16} className="text-gray-500" />
      <span className="font-medium">{total}</span>
    </div>,
    // Completadas con icono
    <div key={worklist.id_worklist} className="flex items-center gap-2">
      <CheckCircle size={16} className="text-green-600" />
      <span className="font-medium text-green-700">{completadas}</span>
    </div>,
    // Barra de progreso
    <div key={worklist.id_worklist} className="space-y-1">
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-green-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${completionPercentage}%` }}
        />
      </div>
      <div className="text-xs text-gray-500 text-center">{completionPercentage}%</div>
    </div>,
    // Fecha de creación con icono
    <div key={worklist.id_worklist} className="flex items-center gap-1 text-sm text-gray-500">
      <Clock size={14} />
      <span>{formatDateShort(worklist.create_dt)}</span>
    </div>
  ]

  // Definir las acciones
  const actions: ListDetailAction[] = [
    {
      icon: <Edit className="w-4 h-4" />,
      onClick: () => onEdit(worklist),
      title: 'Editar',
      className: 'p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors'
    },

    {
      icon: <Trash2 className="w-4 h-4" />,
      onClick: () => onDelete(worklist.id_worklist, worklist.nombre),
      title: 'Eliminar',
      className: 'p-1 text-red-600 hover:bg-red-50 rounded transition-colors'
    }
  ]

  // Contenido expandido con las técnicas
  const expandedContent = (
    <div className="space-y-2">
      {worklist.tecnicas && worklist.tecnicas.length > 0 ? (
        <div className="space-y-1">
          <h4 className="font-semibold text-sm text-gray-700 mb-2">
            Técnicas ({worklist.tecnicas.length})
          </h4>
          {worklist.tecnicas.map((tecnica, index) => (
            <div
              key={index}
              className="flex items-center justify-between px-3 py-2 bg-white border border-gray-200 rounded text-sm"
            >
              <div className="flex items-center gap-3">
                <span className="text-gray-500 font-mono text-xs">#{index + 1}</span>
                <span className="font-medium">
                  {tecnica.muestra?.codigo_epi || tecnica.muestra?.codigo_externo || 'Sin código'}
                </span>
                {tecnica.tecnico_resp && (
                  <span className="text-xs text-gray-500">👤 {tecnica.tecnico_resp.nombre}</span>
                )}
              </div>
              <div>
                {tecnica.estadoInfo && <IndicadorEstado estado={tecnica.estadoInfo} size="small" />}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-600">No hay técnicas asociadas a este worklist.</p>
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
    />
  )
}
