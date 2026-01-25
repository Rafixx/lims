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
        <div className="border-t border-primary-200">
          {externalizaciones.map((externalizacion, index) => (
            <div
              key={externalizacion.id_externalizacion}
              className={`px-4 py-3 ${
                index < externalizaciones.length - 1 ? 'border-b border-primary-100' : ''
              } ${
                selectedIds.has(externalizacion.id_externalizacion)
                  ? 'bg-primary-100/50'
                  : 'bg-white/50'
              } hover:bg-primary-100/30 transition-colors`}
            >
              <div className="grid grid-cols-12 gap-3 items-center">
                {/* Checkbox individual */}
                {showCheckbox && (
                  <div className="col-span-1">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(externalizacion.id_externalizacion)}
                      onChange={e =>
                        onSelectChange?.([externalizacion.id_externalizacion], e.target.checked)
                      }
                      className="w-4 h-4 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                )}

                {/* Posición en placa */}
                <div className={`${showCheckbox ? 'col-span-2' : 'col-span-3'}`}>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-semibold text-primary-700 bg-white px-2 py-0.5 rounded">
                      {externalizacion.tecnica?.muestraArray?.posicion_placa || '-'}
                    </span>
                  </div>
                </div>

                {/* Volumen y Concentración */}
                <div className="col-span-3">
                  <div className="text-xs space-y-0.5">
                    {externalizacion.volumen && (
                      <div className="text-surface-600">
                        <span className="font-medium">Vol:</span> {externalizacion.volumen}
                      </div>
                    )}
                    {externalizacion.concentracion && (
                      <div className="text-surface-600">
                        <span className="font-medium">Conc:</span> {externalizacion.concentracion}
                      </div>
                    )}
                  </div>
                </div>

                {/* Servicio */}
                <div className="col-span-2">
                  <div className="text-xs text-surface-600 truncate">
                    {externalizacion.servicio && (
                      <div className="flex items-center gap-1">
                        <Package className="w-3 h-3" />
                        <span className="truncate">{externalizacion.servicio}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Técnico */}
                <div className="col-span-2">
                  {externalizacion.tecnico_resp && (
                    <div className="flex items-center gap-1 text-xs text-surface-600">
                      <User className="w-3 h-3" />
                      <span className="truncate">{externalizacion.tecnico_resp.nombre}</span>
                    </div>
                  )}
                </div>

                {/* Estado */}
                <div className="col-span-1">
                  {externalizacion.tecnica?.estadoInfo && (
                    <IndicadorEstado estado={externalizacion.tecnica.estadoInfo} size="small" />
                  )}
                </div>

                {/* Acciones */}
                <div className="col-span-1 flex justify-end gap-1">
                  {externalizacion.tecnica?.id_estado === 17 && (
                    <button
                      onClick={() => handleMarcarRecibida(externalizacion)}
                      className="p-1 text-success-600 hover:bg-success-100 rounded transition-colors"
                      title="Marcar como recibida"
                    >
                      <CheckCircle className="w-3 h-3" />
                    </button>
                  )}
                  <button
                    onClick={() => onEdit(externalizacion)}
                    className="p-1 text-primary-600 hover:bg-primary-100 rounded transition-colors"
                    title="Editar"
                  >
                    <Edit className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => onDelete(externalizacion)}
                    className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Observaciones si existen */}
              {externalizacion.observaciones && (
                <div className="mt-2 pt-2 border-t border-primary-100">
                  <div className="text-xs text-surface-500">
                    <span className="font-medium">Obs:</span> {externalizacion.observaciones}
                  </div>
                </div>
              )}
            </div>
          ))}
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
