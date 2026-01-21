import { useState } from 'react'
import {
  Edit,
  Trash2,
  ChevronDown,
  ChevronRight,
  Calendar,
  User,
  Building,
  Package
} from 'lucide-react'
import { Externalizacion } from '../../interfaces/externalizaciones.types'
import { formatDate } from '@/shared/utils/helpers'

type ExternalizacionListDetailProps = {
  externalizacion: Externalizacion
  onEdit: (externalizacion: Externalizacion) => void
  onDelete: (externalizacion: Externalizacion) => void
  fieldSpans?: number[]
}

export const ExternalizacionListDetail = ({
  externalizacion,
  onEdit,
  onDelete
}: ExternalizacionListDetailProps) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const isPendiente = !externalizacion.f_recepcion
  const tieneRecepcionDatos = !!externalizacion.f_recepcion_datos

  const getEstadoColor = () => {
    if (tieneRecepcionDatos) return 'bg-success-100 text-success-700 border-success-300'
    if (!isPendiente) return 'bg-info-100 text-info-700 border-info-300'
    return 'bg-warning-100 text-warning-700 border-warning-300'
  }

  const getEstadoText = () => {
    if (tieneRecepcionDatos) return 'Con datos'
    if (!isPendiente) return 'Recibida'
    return 'Pendiente'
  }

  return (
    <div className="border border-surface-200 bg-white rounded-lg shadow-soft hover:shadow-medium transition-all">
      {/* Fila principal compacta */}
      <div className="grid grid-cols-12 gap-3 px-4 py-3 items-center">
        {/* Botón expandir */}
        <div className="col-span-1 flex items-center">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-surface-100 rounded transition-colors"
            aria-label="Expandir detalles"
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-surface-600" />
            ) : (
              <ChevronRight className="w-4 h-4 text-surface-600" />
            )}
          </button>
        </div>

        {/* Códigos */}
        <div className="col-span-2">
          <div className="text-sm font-semibold text-surface-800">
            {externalizacion.tecnica?.muestra?.codigo_externo || '-'}
          </div>
          <div className="text-xs text-surface-500">
            {externalizacion.tecnica?.muestra?.codigo_epi || '-'}
          </div>
        </div>

        {/* Técnica */}
        <div className="col-span-2">
          <div className="text-sm text-surface-700 truncate">
            {externalizacion.tecnica?.tecnica_proc?.tecnica_proc || '-'}
          </div>
        </div>

        {/* Agencia y Centro */}
        <div className="col-span-2">
          <div className="text-sm text-surface-700 truncate font-medium">
            {externalizacion.agencia || '-'}
          </div>
          <div className="text-xs text-surface-500 truncate">
            {externalizacion.centro?.descripcion || externalizacion.centro?.codigo || '-'}
          </div>
        </div>

        {/* Fecha de envío */}
        <div className="col-span-2">
          <div className="flex items-center gap-1 text-sm text-surface-700">
            <Calendar className="w-3 h-3 text-surface-400" />
            {formatDate(externalizacion.f_envio || undefined) || '-'}
          </div>
        </div>

        {/* Estado */}
        <div className="col-span-2">
          <span
            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getEstadoColor()}`}
          >
            {getEstadoText()}
          </span>
        </div>

        {/* Acciones */}
        <div className="col-span-1 flex justify-end gap-1">
          <button
            onClick={() => onEdit(externalizacion)}
            className="p-1.5 text-primary-600 hover:bg-primary-50 rounded transition-colors"
            title="Editar externalización"
            aria-label={`Editar externalización ${externalizacion.id_externalizacion}`}
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(externalizacion)}
            className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
            title="Eliminar externalización"
            aria-label={`Eliminar externalización ${externalizacion.id_externalizacion}`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Detalles expandidos */}
      {isExpanded && (
        <div className="px-4 pb-3 pt-0 border-t border-surface-100 bg-surface-50/50">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-3">
            {/* Volumen */}
            {externalizacion.volumen && (
              <div>
                <div className="text-xs font-medium text-surface-500 mb-1">Volumen</div>
                <div className="text-sm text-surface-700">{externalizacion.volumen}</div>
              </div>
            )}

            {/* Concentración */}
            {externalizacion.concentracion && (
              <div>
                <div className="text-xs font-medium text-surface-500 mb-1">Concentración</div>
                <div className="text-sm text-surface-700">{externalizacion.concentracion}</div>
              </div>
            )}

            {/* Servicio */}
            {externalizacion.servicio && (
              <div>
                <div className="text-xs font-medium text-surface-500 mb-1 flex items-center gap-1">
                  <Package className="w-3 h-3" />
                  Servicio
                </div>
                <div className="text-sm text-surface-700">{externalizacion.servicio}</div>
              </div>
            )}

            {/* Técnico Responsable */}
            {externalizacion.tecnico_resp && (
              <div>
                <div className="text-xs font-medium text-surface-500 mb-1 flex items-center gap-1">
                  <User className="w-3 h-3" />
                  Técnico Responsable
                </div>
                <div className="text-sm text-surface-700">
                  {externalizacion.tecnico_resp.nombre}
                </div>
              </div>
            )}

            {/* Fecha Recepción */}
            {externalizacion.f_recepcion && (
              <div>
                <div className="text-xs font-medium text-surface-500 mb-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Fecha Recepción
                </div>
                <div className="text-sm text-surface-700">
                  {formatDate(externalizacion.f_recepcion || undefined)}
                </div>
              </div>
            )}

            {/* Fecha Recepción Datos */}
            {externalizacion.f_recepcion_datos && (
              <div>
                <div className="text-xs font-medium text-surface-500 mb-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Fecha Rec. Datos
                </div>
                <div className="text-sm text-surface-700">
                  {formatDate(externalizacion.f_recepcion_datos || undefined)}
                </div>
              </div>
            )}
          </div>

          {/* Observaciones */}
          {externalizacion.observaciones && (
            <div className="mt-3 pt-3 border-t border-surface-200">
              <div className="text-xs font-medium text-surface-500 mb-1">Observaciones</div>
              <div className="text-sm text-surface-700">{externalizacion.observaciones}</div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
