import { useNavigate, useParams } from 'react-router-dom'
import { ExternalizacionForm } from '../components/ExternalizacionForm/ExternalizacionForm'
import { useExternalizacion } from '../hooks/useExternalizaciones'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { ExternalizacionFormData } from '../interfaces/externalizaciones.types'

/**
 * Convierte una fecha ISO a formato datetime-local (YYYY-MM-DDTHH:mm)
 * Los inputs datetime-local no aceptan el formato ISO completo con zona horaria
 */
const formatDateForInput = (isoDate: string | null | undefined): string | null => {
  if (!isoDate) return null
  try {
    // Convertir a fecha local y formatear sin zona horaria
    const date = new Date(isoDate)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${day}T${hours}:${minutes}`
  } catch (error) {
    console.error('Error formateando fecha:', error)
    return null
  }
}

export const EditExternalizacionPage = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const externalizacionId = id ? parseInt(id) : undefined

  const { externalizacion, isLoading, error } = useExternalizacion(externalizacionId)

  const handleSuccess = () => {
    navigate('/externalizaciones')
  }

  const handleCancel = () => {
    navigate('/externalizaciones')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    )
  }

  if (error || !externalizacion) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error al cargar la externalización</p>
        </div>
      </div>
    )
  }

  const formData: ExternalizacionFormData = {
    id_tecnica: externalizacion.id_tecnica,
    volumen: externalizacion.volumen,
    concentracion: externalizacion.concentracion,
    servicio: externalizacion.servicio,
    f_envio: formatDateForInput(externalizacion.f_envio),
    f_recepcion: formatDateForInput(externalizacion.f_recepcion),
    f_recepcion_datos: formatDateForInput(externalizacion.f_recepcion_datos),
    agencia: externalizacion.agencia,
    observaciones: externalizacion.observaciones,
    id_centro: externalizacion.centro?.id || null,
    id_tecnico_resp: externalizacion.tecnico_resp?.id_usuario || null
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="mb-6">
        <button
          onClick={() => navigate('/externalizaciones')}
          className="flex items-center gap-2 text-surface-600 hover:text-surface-800 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a Externalizaciones
        </button>
        <h1 className="text-3xl font-bold text-surface-900">Editar Externalización</h1>
        <p className="text-surface-600 mt-2">
          Externalización #{externalizacion.id_externalizacion}
        </p>
      </div>

      <ExternalizacionForm
        initialValues={formData}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        externalizacionId={externalizacionId}
        tecnicaNombre={externalizacion.tecnica?.tecnica_proc?.tecnica_proc}
      />
    </div>
  )
}
