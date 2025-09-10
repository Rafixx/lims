import { useState } from 'react'
import { ChevronDown, ChevronUp, Edit, Trash2, Calendar, User } from 'lucide-react'
import type { SolicitudAPIResponse } from '../interfaces/solicitudes.types'
import { IconButton } from '@/shared/components/molecules/IconButton'
import { SolicitudBadge } from '@/shared/states'

interface Props {
  solicitud: SolicitudAPIResponse
  onEdit: (solicitud: SolicitudAPIResponse) => void
  onDelete: (solicitud: SolicitudAPIResponse) => void
}

const formatDate = (dateString?: string | null): string => {
  if (!dateString) return 'N/A'

  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'N/A'

    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return 'N/A'
  }
}

export const SolicitudCard = ({ solicitud, onEdit, onDelete }: Props) => {
  const [expanded, setExpanded] = useState(false)

  const toggleExpanded = () => setExpanded(!expanded)

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  {solicitud.num_solicitud || `SOL-${solicitud.id_solicitud}`}
                </h3>
                <SolicitudBadge estado={solicitud.estado_solicitud || 'PENDIENTE'} />
              </div>

              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>{solicitud.cliente?.nombre || 'N/A'}</span>
                </div>

                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>{solicitud.muestras?.length || 0} muestra(s)</span>
                </div>

                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Creada: {formatDate(solicitud.f_creacion)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <IconButton
              icon={<Edit className="w-4 h-4" />}
              title="Editar solicitud"
              onClick={() => onEdit(solicitud)}
              className="text-blue-600 hover:text-blue-800"
            />

            <IconButton
              icon={<Trash2 className="w-4 h-4" />}
              title="Eliminar solicitud"
              onClick={() => onDelete(solicitud)}
              className="text-red-600 hover:text-red-800"
            />

            <IconButton
              icon={
                expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
              }
              title={expanded ? 'Contraer' : 'Expandir'}
              onClick={toggleExpanded}
              className="text-gray-600 hover:text-gray-800"
            />
          </div>
        </div>
      </div>

      {/* Contenido expandido */}
      {expanded && (
        <div className="px-4 pb-4 border-t bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {/* Fechas importantes */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Fechas</h4>
              <div className="space-y-1 text-sm">
                <div>
                  <strong>Compromiso:</strong> {formatDate(solicitud.f_compromiso)}
                </div>
                <div>
                  <strong>Entrega:</strong> {formatDate(solicitud.f_entrega)}
                </div>
              </div>
            </div>

            {/* Información adicional */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Detalles</h4>
              <div className="space-y-1 text-sm">
                <div>
                  <strong>ID Cliente:</strong> {solicitud.id_cliente}
                </div>
                {solicitud.observaciones && (
                  <div>
                    <strong>Observaciones:</strong> {solicitud.observaciones}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Muestras */}
          {solicitud.muestras && solicitud.muestras.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium text-gray-900 mb-2">Muestras</h4>
              <div className="space-y-2">
                {solicitud.muestras.map((muestra, index) => (
                  <div key={muestra.id_muestra || index} className="bg-white p-3 rounded border">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                      <div>
                        <strong>Código:</strong> {muestra.codigo_muestra || 'N/A'}
                      </div>
                      <div>
                        <strong>Paciente:</strong> {muestra.paciente?.nombre || 'N/A'}
                      </div>
                      <div>
                        <strong>Prueba:</strong> {muestra.prueba?.prueba || 'N/A'}
                      </div>
                    </div>

                    {muestra.observaciones_muestra && (
                      <div className="mt-2 text-sm">
                        <strong>Observaciones:</strong> {muestra.observaciones_muestra}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
