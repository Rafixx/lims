import { useNavigate } from 'react-router-dom'
import { RegistroMasivoWizard } from '../components/RegistroMasivo/RegistroMasivoWizard'
import { LayersIcon } from 'lucide-react'

export const RegistroMasivoPage = () => {
  const navigate = useNavigate()

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="p-2 bg-primary-100 rounded-lg">
          <LayersIcon className="w-6 h-6 text-primary-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-surface-900">
            Registro masivo de muestras
          </h1>
          <p className="text-sm text-surface-500">
            Crea múltiples placas con sus muestras automáticamente
          </p>
        </div>
      </div>
      <RegistroMasivoWizard onFinish={() => navigate('/muestras')} />
    </div>
  )
}
