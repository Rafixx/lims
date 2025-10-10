import { ReactNode } from 'react'
import { Trash2, Clock, BarChart3, CheckCircle } from 'lucide-react'
import type { Worklist } from '../../interfaces/worklist.types'
import { ListDetail, ListDetailAction } from '@/shared/components/organisms/ListDetail'
import { APP_STATES } from '@/shared/states'
import { formatDateShort } from '@/shared/utils/helpers'

interface WorkListListDetailProps {
  worklist: Worklist
  onDelete: (id: number, nombre: string) => void
  onView: () => void
  fieldSpans: number[]
}

/**
 * Componente específico para renderizar el detalle de un WorkList
 * Wrapper sobre el componente genérico ListDetail
 */
export const WorkListListDetail = ({
  worklist,
  onDelete,
  onView,
  fieldSpans
}: WorkListListDetailProps) => {
  const completadas =
    worklist.tecnicas.filter(tecnica => tecnica.estado === APP_STATES.TECNICA.COMPLETADA).length ||
    0
  const total = worklist.tecnicas.length || 0
  const completionPercentage = total > 0 ? Math.round((completadas / total) * 100) : 0

  // Definir los campos a renderizar
  const renderFields = (): ReactNode[] => [
    // Nombre del WorkList
    <div key={worklist.id_worklist} className="cursor-pointer" onClick={onView}>
      <span className="font-semibold text-blue-600 hover:text-blue-800">{worklist.nombre}</span>
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
                {tecnica.estado && (
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      tecnica.estado === APP_STATES.TECNICA.COMPLETADA
                        ? 'bg-green-100 text-green-800'
                        : tecnica.estado === APP_STATES.TECNICA.EN_PROGRESO
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {tecnica.estado}
                  </span>
                )}
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
