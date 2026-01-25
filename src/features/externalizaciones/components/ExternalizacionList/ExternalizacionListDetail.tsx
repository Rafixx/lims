import { useState } from 'react'
import {
  Edit,
  Trash2,
  ChevronDown,
  ChevronRight,
  Calendar,
  User,
  Building,
  Package,
  CheckCircle
} from 'lucide-react'
import { Externalizacion } from '../../interfaces/externalizaciones.types'
import { formatDate } from '@/shared/utils/helpers'
import { IndicadorEstado } from '@/shared/components/atoms/IndicadorEstado'
import { MarcarRecibidaModal } from '../MarcarRecibidaModal'

type ExternalizacionListDetailProps = {
  externalizacion: Externalizacion
  onEdit: (externalizacion: Externalizacion) => void
  onDelete: (externalizacion: Externalizacion) => void
  fieldSpans?: number[]
  showCheckbox?: boolean
  isSelected?: boolean
  onSelectChange?: (checked: boolean) => void
}

export const ExternalizacionListDetail = ({
  externalizacion,
  onEdit,
  onDelete,
  showCheckbox = false,
  isSelected = false,
  onSelectChange
}: ExternalizacionListDetailProps) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showMarcarRecibidaModal, setShowMarcarRecibidaModal] = useState(false)

  // Estado ENVIADA_EXT (id_estado = 17) permite marcar como recibida
  const esEnviada = externalizacion.tecnica?.id_estado === 17

  return (
    <div
      className={`border rounded-lg shadow-soft hover:shadow-medium transition-all ${
        isSelected ? 'border-primary-400 bg-primary-50' : 'border-surface-200 bg-white'
      }`}
    >
      {/* Fila principal compacta */}
      <div className="grid grid-cols-12 gap-3 px-4 py-3 items-center">
        {/* Checkbox o Botón expandir */}
        <div className="col-span-1 flex items-center gap-2">
          {showCheckbox && (
            <input
              type="checkbox"
              checked={isSelected}
              onChange={e => onSelectChange?.(e.target.checked)}
              className="w-4 h-4 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
            />
          )}
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

        {/* Estado de Técnica y Externalización */}
        <div className="col-span-2">
          <div className="space-y-1">
            {/* Estado de la Técnica */}
            {externalizacion.tecnica?.estadoInfo && (
              <IndicadorEstado estado={externalizacion.tecnica.estadoInfo} size="small" />
            )}
            {/* Estado de la Externalización */}
            {/* <span
              className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full border ${getEstadoColor()}`}
            >
              {getEstadoText()}
            </span> */}
          </div>
        </div>

        {/* Acciones */}
        <div className="col-span-1 flex justify-end gap-1">
          {esEnviada && (
            <button
              onClick={() => setShowMarcarRecibidaModal(true)}
              className="p-1.5 text-success-600 hover:bg-success-50 rounded transition-colors"
              title="Marcar como recibida"
              aria-label={`Marcar externalización ${externalizacion.id_externalizacion} como recibida`}
            >
              <CheckCircle className="w-4 h-4" />
            </button>
          )}
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

      {/* Modal para marcar como recibida */}
      {showMarcarRecibidaModal && (
        <MarcarRecibidaModal
          externalizacion={externalizacion}
          onClose={() => setShowMarcarRecibidaModal(false)}
          onSuccess={() => setShowMarcarRecibidaModal(false)}
        />
      )}
    </div>
  )
}
