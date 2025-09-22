import { useParams, useNavigate } from 'react-router-dom'
import { useSolicitud } from '../hooks/useSolicitudes'
import { SolicitudForm } from '../components/solicitudForm/SolicitudForm'
import { useNotification } from '@/shared/components/Notification/NotificationContext'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/shared/components/molecules/Button'
import { DEFAULT_MUESTRA } from '../interfaces/defaults'
import type { SolicitudAPIResponse, Solicitud } from '../interfaces/solicitudes.types'

export const SolicitudFormPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { notify } = useNotification()
  const isEditing = Boolean(id)

  // Solo cargar datos si estamos editando
  const { data: solicitudData, isLoading } = useSolicitud(Number(id) || 0)

  const mapSolicitudToFormValues = (solicitud: SolicitudAPIResponse): Solicitud => {
    return {
      ...solicitud,
      // Asegurar que muestras siempre exista como array
      muestras: solicitud.muestras?.length > 0 ? solicitud.muestras : [DEFAULT_MUESTRA]
    }
  }

  const handleSuccess = () => {
    notify(
      isEditing ? 'Solicitud actualizada correctamente' : 'Solicitud creada correctamente',
      'success'
    )
    navigate('/solicitudes')
  }

  const handleCancel = () => {
    navigate('/solicitudes')
  }

  const initialFormValues: Solicitud | undefined =
    isEditing && solicitudData ? mapSolicitudToFormValues(solicitudData) : undefined

  if (isEditing && isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button onClick={() => navigate('/solicitudes')} variant="ghost" className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="animate-pulse h-8 w-48 bg-gray-200 rounded"></div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header con breadcrumb */}
      <div className="flex items-center gap-4">
        <Button
          onClick={() => navigate('/solicitudes')}
          variant="ghost"
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>

        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Editar Solicitud' : 'Nueva Solicitud'}
          </h1>
          <div className="text-sm text-gray-600 mt-1">
            <span
              className="hover:text-blue-600 cursor-pointer"
              onClick={() => navigate('/solicitudes')}
            >
              Solicitudes
            </span>
            <span className="mx-2">/</span>
            <span className="text-gray-900">
              {isEditing ? `Editar #${solicitudData?.num_solicitud}` : 'Nueva'}
            </span>
          </div>
        </div>
      </div>

      {/* Formulario */}
      <div className="bg-white rounded-lg shadow">
        <SolicitudForm
          initialValues={initialFormValues}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </div>
  )
}
