import { format, isValid, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { Solicitud } from '@/features/solicitudes/interfaces/solicitud.interface'

interface Props {
  solicitud: Solicitud
  onEdit: (solicitud: Solicitud) => void
  onDelete: (solicitud: Solicitud) => void
}

export const SolicitudCard = ({ solicitud, onEdit, onDelete }: Props) => {
  const parsedDate = solicitud.f_creacion ? parseISO(solicitud.f_creacion) : null
  const formattedDate =
    parsedDate && isValid(parsedDate)
      ? format(parsedDate, 'PP', { locale: es })
      : 'Fecha no disponible'

  return (
    <div className="bg-white shadow rounded p-4 border hover:ring-2 hover:ring-blue-200 transition">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-gray-800">
          Solicitud #{solicitud.num_solicitud}
        </h3>
        <span className="text-sm text-gray-500">{formattedDate}</span>
      </div>

      <p className="text-sm text-gray-600 mb-1">
        Estado: <span className="font-medium">{solicitud.estado_solicitud}</span>
      </p>

      <p className="text-sm text-gray-600 mb-1">
        Cliente: <span className="font-medium">{solicitud.cliente?.nombre ?? 'No disponible'}</span>
      </p>

      <p className="text-sm text-gray-600 mb-1">
        Prueba: <span className="font-medium">{solicitud.prueba?.prueba ?? 'No disponible'}</span>
      </p>
      <p className="text-sm text-gray-600 mb-1">
        Fecha de entrada:{' '}
        <span className="font-medium">
          {solicitud.f_entrada
            ? isValid(parseISO(solicitud.f_entrada))
              ? format(parseISO(solicitud.f_entrada), 'PP', { locale: es })
              : 'Fecha no válida'
            : 'No disponible'}
        </span>
      </p>
      <div className="flex justify-end gap-3 mt-4">
        <button
          onClick={() => onEdit(solicitud)}
          className="text-sm px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          Editar
        </button>
        <button
          onClick={() => onDelete(solicitud)}
          className="text-sm px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Eliminar
        </button>
      </div>
    </div>
  )
}
