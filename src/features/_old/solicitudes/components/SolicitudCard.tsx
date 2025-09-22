import { useState } from 'react'
import { formatDate } from '@/shared/utils/helpers'
import { ChevronDown, ChevronUp, Edit, Trash2, Calendar, User } from 'lucide-react'
import type { SolicitudAPIResponse } from '../interfaces/solicitudes.types'
import { IconButton } from '@/shared/components/molecules/IconButton'
import { SolicitudBadge } from '@/shared/states'

interface Props {
  solicitud: SolicitudAPIResponse
  onEdit: (solicitud: SolicitudAPIResponse) => void
  onDelete: (solicitud: SolicitudAPIResponse) => void
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
                  {solicitud.num_solicitud || `SOL-ID-${solicitud.id_solicitud}`}
                </h3>
                <SolicitudBadge estado={solicitud.estado_solicitud || 'SIN ESTADO'} />
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
          {/* Muestras */}
          {solicitud.muestras && solicitud.muestras.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium text-gray-900 mb-2">Muestras</h4>
              <div className="space-y-2">
                {solicitud.muestras.map((muestra, index) => (
                  <div key={muestra.id_muestra || index} className="bg-white p-3 rounded border">
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-2 text-sm">
                      <div>
                        <strong>Cod. Epidisease:</strong> {muestra.codigo_epi || 'N/A'}
                      </div>
                      <div>
                        <strong>Cod. Externo:</strong> {muestra.codigo_externo || 'N/A'}
                      </div>
                      <div>
                        <strong>Centro:</strong> {muestra.centro?.descripcion || 'N/A'}
                      </div>
                      <div>
                        <strong>Paciente:</strong> {muestra.paciente?.nombre || 'N/A'}
                      </div>
                      <div>
                        <strong>Prueba:</strong> {muestra.prueba?.prueba || 'N/A'}
                      </div>
                      <div>
                        <SolicitudBadge estado={muestra.estado_muestra || 'SIN ESTADO'} />
                        {/* <strong>Estado:</strong> {muestra.estado_muestra || 'N/A'} */}
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
