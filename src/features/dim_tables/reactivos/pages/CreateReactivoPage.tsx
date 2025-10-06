import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { ReactivoForm } from '../components/ReactivoForm'

export const CreateReactivoPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          to="/reactivos"
          className="p-2 hover:bg-background-hover rounded-md transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-foreground-primary">Nuevo Reactivo</h1>
      </div>

      <div className="bg-background border border-border rounded-lg p-6">
        <ReactivoForm />
      </div>
    </div>
  )
}
