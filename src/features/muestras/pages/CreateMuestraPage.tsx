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
  const { muestra } = useMuestra(muestraId)

  const handleSuccess = () => {
    notify(isEditing ? 'Muestra actualizada con éxito' : 'Muestra creada con éxito', 'success')
    navigate('/muestras')
  }

  const handleCancel = () => {
    navigate('/muestras')
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
              initialValues={isEditing && muestra ? muestra : undefined}
              onSuccess={handleSuccess}
              onCancel={handleCancel}
            />
          </div>
        </Card>
      </div>
    </div>
  )
}
