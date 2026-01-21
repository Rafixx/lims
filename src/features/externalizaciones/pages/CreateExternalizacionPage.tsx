import { useNavigate } from 'react-router-dom'
import { ExternalizacionForm } from '../components/ExternalizacionForm/ExternalizacionForm'
import { ArrowLeft } from 'lucide-react'

export const CreateExternalizacionPage = () => {
  const navigate = useNavigate()

  const handleSuccess = () => {
    navigate('/externalizaciones')
  }

  const handleCancel = () => {
    navigate('/externalizaciones')
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
        <h1 className="text-3xl font-bold text-surface-900">Nueva Externalización</h1>
        <p className="text-surface-600 mt-2">Registra una nueva externalización de técnica</p>
      </div>

      <ExternalizacionForm onSuccess={handleSuccess} onCancel={handleCancel} />
    </div>
  )
}
