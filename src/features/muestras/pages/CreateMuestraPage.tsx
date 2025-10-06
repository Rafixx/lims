import { useNavigate, useParams } from 'react-router-dom'
import { Card } from '@/shared/components/molecules/Card'
import { MuestraForm } from '../components/MuestraForm/MuestraForm'
import { useNotification } from '@/shared/components/Notification/NotificationContext'
import { useMuestra } from '../hooks/useMuestras'

export const CreateMuestraPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const muestraId = id ? parseInt(id) : undefined
  const isEditing = Boolean(muestraId && muestraId > 0)

  const { notify } = useNotification()
  const { muestra, isLoading, error } = useMuestra(muestraId)

  const handleSuccess = () => {
    notify(isEditing ? 'Muestra actualizada con éxito' : 'Muestra creada con éxito', 'success')
    navigate('/muestras')
  }

  const handleCancel = () => {
    navigate('/muestras')
  }

  // Mostrar loading mientras se cargan los datos en modo edición
  if (isEditing && isLoading) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-surface-600">Cargando datos de la muestra...</p>
        </div>
      </div>
    )
  }

  // Mostrar error si falla la carga
  if (isEditing && error) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-danger-600 mb-4">Error al cargar la muestra</p>
          <button
            onClick={() => navigate('/muestras')}
            className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
          >
            Volver al listado
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface-50">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-surface-900">
                {isEditing ? 'Editar Muestra' : 'Nueva Muestra'}
              </h1>
              <p className="text-surface-600 mt-1">
                {isEditing
                  ? 'Modificar los datos de la muestra existente'
                  : 'Crear una nueva muestra en el sistema'}
              </p>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <Card className="bg-white shadow-sm">
          <div className="p-6">
            <MuestraForm
              key={muestraId || 'new'}
              initialValues={muestra}
              onSuccess={handleSuccess}
              onCancel={handleCancel}
            />
          </div>
        </Card>
      </div>
    </div>
  )
}
