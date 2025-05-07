import { useState } from 'react'
import { Solicitud } from '@/features/solicitudes/interfaces/solicitud.interface'
import { MuestraItem } from './MuestraItem'
import { ChevronDown, Edit, Trash2 } from 'lucide-react'
import { IconButton } from '@/shared/components/molecules/IconButton'
import { Card } from '@/shared/components/molecules/Card'

interface Props {
  solicitud: Solicitud
  onEdit?: (s: Solicitud) => void
  onDelete?: (s: Solicitud) => void
}

export const SolicitudCard = ({ solicitud, onEdit, onDelete }: Props) => {
  const [expanded, setExpanded] = useState(false)

  const toggleExpand = () => setExpanded(prev => !prev)

  return (
    <Card>
      <div onClick={toggleExpand} className="flex justify-between items-start cursor-pointer">
        <div>
          <h3 className="text-lg font-semibold text-primary">
            Solicitud #{solicitud.num_solicitud}
          </h3>
          <p className="text-sm text-gray-600">Cliente: {solicitud.cliente?.nombre}</p>
          <p className="text-sm text-gray-600">Prueba: {solicitud.prueba?.prueba}</p>
        </div>

        <div className="flex items-center gap-4">
          {solicitud.muestra && solicitud.muestra.length > 0 && (
            <ChevronDown
              className={`w-4 h-4 transform transition-transform duration-200 ${
                expanded ? 'rotate-180' : ''
              }`}
            />
          )}

          {onEdit && (
            <IconButton
              onClick={e => {
                e.stopPropagation()
                onEdit(solicitud)
              }}
              title="Editar solicitud"
              icon={<Edit className="w-4 h-4 text-blue-600" />}
              effect="scale"
            />
          )}

          {onDelete && (
            <IconButton
              onClick={e => {
                e.stopPropagation()
                onDelete(solicitud)
              }}
              title="Eliminar solicitud"
              icon={<Trash2 className="w-4 h-4 text-red-600" />}
              effect="scale"
            />
          )}
        </div>
      </div>

      {expanded && solicitud.muestra && solicitud.muestra?.length > 0 && (
        <div className="mt-4 space-y-2 ml-4 border-l-2 pl-4 border-muted">
          {solicitud.muestra.map(m => (
            <MuestraItem key={m.id_muestra} muestra={m} />
          ))}
        </div>
      )}
    </Card>
  )
}
