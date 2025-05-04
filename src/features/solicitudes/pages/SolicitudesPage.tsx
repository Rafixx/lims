import { useState } from 'react'
import { useSolicitudes, useDeleteSolicitud } from '@/features/solicitudes/hooks/useSolicitudes'
import { Solicitud } from '@/features/solicitudes/interfaces/solicitud.interface'
import { SolicitudCard } from '@/features/solicitudes/components/SolicitudCard'
import { useNotification } from '@/shared/components/Notification/NotificationContext'
import { Modal } from '@/shared/components/molecules/Modal'
import { SolicitudForm } from '@/features/solicitudes/components/SolicitudForm'

export const SolicitudesPage = () => {
  const { data: solicitudes, isLoading, isError } = useSolicitudes()
  const deleteSolicitud = useDeleteSolicitud()
  const { notify } = useNotification()

  const [showModal, setShowModal] = useState(false)
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState<Solicitud | null>(null)

  const handleNuevaSolicitud = () => {
    setSolicitudSeleccionada(null)
    setShowModal(true)
  }

  const handleEditarSolicitud = (solicitud: Solicitud) => {
    setSolicitudSeleccionada(solicitud)
    setShowModal(true)
  }

  const handleEliminarSolicitud = (solicitud: Solicitud) => {
    const confirmado = confirm(`¿Eliminar la solicitud #${solicitud.num_solicitud}?`)
    if (confirmado) {
      deleteSolicitud.mutate(solicitud.id_solicitud, {
        onSuccess: () => notify(`Solicitud #${solicitud.num_solicitud} eliminada`, 'success'),
        onError: () => notify('Error al eliminar la solicitud', 'error')
      })
    }
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Listado de Solicitudes</h2>
        <button
          onClick={handleNuevaSolicitud}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Nueva Solicitud
        </button>
      </div>

      {isLoading && <p>Cargando solicitudes...</p>}
      {isError && <p>Error al cargar las solicitudes.</p>}
      {solicitudes?.length === 0 && <p>No hay solicitudes registradas.</p>}

      {solicitudes?.map(solicitud => (
        <SolicitudCard
          key={solicitud.id_solicitud}
          solicitud={solicitud}
          onEdit={handleEditarSolicitud}
          onDelete={handleEliminarSolicitud}
        />
      ))}

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={solicitudSeleccionada ? 'Editar Solicitud' : 'Nueva Solicitud'}
      >
        <SolicitudForm solicitud={solicitudSeleccionada} onClose={() => setShowModal(false)} />
      </Modal>
    </div>
  )
}
