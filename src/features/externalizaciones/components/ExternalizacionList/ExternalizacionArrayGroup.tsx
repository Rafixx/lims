import { useState } from 'react'
import {
  ChevronDown,
  ChevronRight,
  Grid3x3,
  Edit,
  Trash2,
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

type ExternalizacionArrayGroupProps = {
  externalizaciones: Externalizacion[]
  onEdit: (externalizacion: Externalizacion) => void
  onDelete: (externalizacion: Externalizacion) => void
  showCheckbox?: boolean
  selectedIds: Set<number>
  onSelectChange?: (ids: number[], checked: boolean) => void
}

export const ExternalizacionArrayGroup = ({
  externalizaciones,
  onEdit,
  onDelete,
  showCheckbox = false,
  selectedIds,
  onSelectChange
}: ExternalizacionArrayGroupProps) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showMarcarRecibidaModal, setShowMarcarRecibidaModal] = useState(false)
  const [selectedExternalizacion, setSelectedExternalizacion] = useState<Externalizacion | null>(
    null
  )

  if (externalizaciones.length === 0) return null

  const firstExt = externalizaciones[0]
  const muestra = firstExt.tecnica?.muestra
  const tecnicaProc = firstExt.tecnica?.tecnica_proc
  const codigoPlaca = firstExt.tecnica?.muestraArray?.codigo_placa

  const allIds = externalizaciones.map(ext => ext.id_externalizacion)
  const allSelected = allIds.every(id => selectedIds.has(id))
  const someSelected = allIds.some(id => selectedIds.has(id))
  const selectedCount = allIds.filter(id => selectedIds.has(id)).length

  const handleGroupCheckboxChange = (checked: boolean) => {
    onSelectChange?.(allIds, checked)
  }

  const handleMarcarRecibida = (externalizacion: Externalizacion) => {
    setSelectedExternalizacion(externalizacion)
    setShowMarcarRecibidaModal(true)
  }

  const handleMarcarRecibidaSuccess = () => {
    setShowMarcarRecibidaModal(false)
    setSelectedExternalizacion(null)
  }

  return (
    <div className="border border-primary-200 rounded-lg bg-primary-50/30 overflow-hidden">
      {/* Header colapsable */}
      <div className="flex items-center gap-3 p-4">
        {showCheckbox && (
          <input
            type="checkbox"
            checked={allSelected}
            ref={input => {
              if (input) {
                input.indeterminate = someSelected && !allSelected
              }
            }}
            onChange={e => handleGroupCheckboxChange(e.target.checked)}
            className="w-4 h-4 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
          />
        )}

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 flex-1 hover:opacity-80 transition-opacity text-left"
        >
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-primary-600 flex-shrink-0" />
          ) : (
            <ChevronRight className="w-4 h-4 text-primary-600 flex-shrink-0" />
          )}

          <Grid3x3 className="w-4 h-4 text-primary-600 flex-shrink-0" />

          <div className="flex-1 min-w-0">
            <div className="font-semibold text-surface-900 flex items-center gap-2 flex-wrap">
              <span className="bg-primary-100 text-primary-800 px-2 py-0.5 rounded text-xs font-medium">
                PLACA
              </span>
              <span>
                {muestra?.estudio} - {tecnicaProc?.tecnica_proc}
              </span>
            </div>
            <div className="text-sm text-surface-600 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
              {codigoPlaca && (
                <span className="font-mono bg-white px-2 py-0.5 rounded">{codigoPlaca}</span>
              )}
              <span>Código: {muestra?.codigo_epi || muestra?.codigo_externo}</span>
              <span>•</span>
              <span>{externalizaciones.length} posiciones</span>
              {selectedCount > 0 && (
                <>
                  <span>•</span>
                  <span className="text-primary-600 font-medium">
                    {selectedCount} seleccionada{selectedCount !== 1 ? 's' : ''}
                  </span>
                </>
              )}
              {/* Información adicional común */}
              {firstExt.agencia && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Building className="w-3 h-3" />
                    {firstExt.agencia}
                  </span>
                </>
              )}
              {firstExt.f_envio && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(firstExt.f_envio)}
                  </span>
                </>
              )}
            </div>
          </div>
        </button>
      </div>

      {/* Lista de externalizaciones individuales (expandida) */}
      {isExpanded && (
        <div className="border-t border-primary-200 bg-surface-50 p-3">
          <div className="space-y-2">
            {externalizaciones.map(externalizacion => (
              <div
                key={externalizacion.id_externalizacion}
                className={`bg-white rounded-lg border transition-all ${
                  selectedIds.has(externalizacion.id_externalizacion)
                    ? 'border-primary-400 shadow-sm'
                    : 'border-surface-200 hover:border-primary-300 hover:shadow-sm'
                }`}
              >
                <div className="p-3">
                  {/* Fila 1: Posición + Códigos + Checkbox + Acciones */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    {/* Izquierda: Checkbox + Posición + Códigos */}
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      {showCheckbox && (
                        <input
                          type="checkbox"
                          checked={selectedIds.has(externalizacion.id_externalizacion)}
                          onChange={e =>
                            onSelectChange?.([externalizacion.id_externalizacion], e.target.checked)
                          }
                          className="w-4 h-4 mt-1 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
                        />
                      )}

                      {/* Posición de la placa */}
                      <div className="flex-shrink-0">
                        <div className="font-mono text-base font-bold text-primary-700 bg-primary-50 px-3 py-1 rounded border border-primary-200">
                          {externalizacion.tecnica?.muestraArray?.posicion_placa || '-'}
                        </div>
                      </div>

                      {/* Códigos EPI y Externo */}
                      <div className="flex-1 min-w-0 space-y-1">
                        {externalizacion.tecnica?.muestraArray?.codigo_epi && (
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-surface-500 flex-shrink-0">
                              EPI:
                            </span>
                            <span className="font-mono text-sm text-surface-900 truncate">
                              {externalizacion.tecnica.muestraArray.codigo_epi}
                            </span>
                          </div>
                        )}
                        {externalizacion.tecnica?.muestraArray?.codigo_externo && (
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-surface-500 flex-shrink-0">
                              EXT:
                            </span>
                            <span className="font-mono text-sm text-surface-700 truncate">
                              {externalizacion.tecnica.muestraArray.codigo_externo}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Derecha: Estado + Acciones */}
                    <div className="flex items-start gap-2 flex-shrink-0">
                      {/* Estado */}
                      {externalizacion.tecnica?.estadoInfo && (
                        <div className="mt-1">
                          <IndicadorEstado
                            estado={externalizacion.tecnica.estadoInfo}
                            size="small"
                          />
                        </div>
                      )}

                      {/* Acciones */}
                      <div className="flex gap-1">
                        {externalizacion.tecnica?.id_estado === 17 && (
                          <button
                            onClick={() => handleMarcarRecibida(externalizacion)}
                            className="p-1.5 text-success-600 hover:bg-success-50 rounded transition-colors"
                            title="Marcar como recibida"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => onEdit(externalizacion)}
                          className="p-1.5 text-primary-600 hover:bg-primary-50 rounded transition-colors"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDelete(externalizacion)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Fila 2: Información adicional en grid */}
                  <div className="grid grid-cols-3 gap-3 pt-3 border-t border-surface-100">
                    {/* Volumen y Concentración */}
                    <div className="space-y-1">
                      {externalizacion.volumen && (
                        <div className="flex items-center gap-1.5 text-xs">
                          <Package className="w-3.5 h-3.5 text-surface-400" />
                          <span className="font-medium text-surface-600">Vol:</span>
                          <span className="text-surface-900">{externalizacion.volumen}</span>
                        </div>
                      )}
                      {externalizacion.concentracion && (
                        <div className="flex items-center gap-1.5 text-xs">
                          <Package className="w-3.5 h-3.5 text-surface-400" />
                          <span className="font-medium text-surface-600">Conc:</span>
                          <span className="text-surface-900">{externalizacion.concentracion}</span>
                        </div>
                      )}
                    </div>

                    {/* Servicio */}
                    <div>
                      {externalizacion.servicio && (
                        <div className="flex items-center gap-1.5 text-xs">
                          <Package className="w-3.5 h-3.5 text-surface-400" />
                          <span className="font-medium text-surface-600">Servicio:</span>
                          <span className="text-surface-900 truncate">
                            {externalizacion.servicio}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Técnico */}
                    <div>
                      {externalizacion.tecnico_resp && (
                        <div className="flex items-center gap-1.5 text-xs">
                          <User className="w-3.5 h-3.5 text-surface-400" />
                          <span className="font-medium text-surface-600">Técnico:</span>
                          <span className="text-surface-900 truncate">
                            {externalizacion.tecnico_resp.nombre}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Fila 3: Observaciones (si existen) */}
                  {externalizacion.observaciones && (
                    <div className="mt-3 pt-3 border-t border-surface-100">
                      <div className="text-xs text-surface-600">
                        <span className="font-medium text-surface-700">Observaciones:</span>{' '}
                        {externalizacion.observaciones}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal para marcar como recibida */}
      {showMarcarRecibidaModal && selectedExternalizacion && (
        <MarcarRecibidaModal
          externalizacion={selectedExternalizacion}
          onClose={() => {
            setShowMarcarRecibidaModal(false)
            setSelectedExternalizacion(null)
          }}
          onSuccess={handleMarcarRecibidaSuccess}
        />
      )}
    </div>
  )
}
