import { useNavigate } from 'react-router-dom'
import { CriterioValidacionForm } from '../components/CriterioValidacionForm'
import { ArrowLeft } from 'lucide-react'

export const CreateCriterioValidacionPage = () => {
  const navigate = useNavigate()

  return (
    <div className="p-6">
      <div className="mb-6">
        <button
          onClick={() => navigate('/criterios-validacion')}
          className="flex items-center gap-2 text-foreground-secondary hover:text-foreground-primary transition-colors mb-4"
        >
          <ArrowLeft size={20} />
          Volver a criterios de validación
        </button>
        <h1 className="text-2xl font-bold text-foreground-primary">Nuevo Criterio de Validación</h1>
      </div>

      <div className="bg-background rounded-lg shadow-soft border border-border p-6">
        <CriterioValidacionForm />
      </div>
    </div>
  )
}
