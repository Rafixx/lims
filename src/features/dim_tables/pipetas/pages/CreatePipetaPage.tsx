import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PipetaForm } from '../components/PipetaForm'

export const CreatePipetaPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/pipetas" className="p-2 hover:bg-background-hover rounded-md transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground-primary">Nueva Pipeta</h1>
          <p className="text-sm text-foreground-secondary mt-1">
            Completa el formulario para crear una nueva pipeta
          </p>
        </div>
      </div>

      <div className="bg-background-secondary rounded-lg shadow-sm border border-border p-6">
        <PipetaForm />
      </div>
    </div>
  )
}
