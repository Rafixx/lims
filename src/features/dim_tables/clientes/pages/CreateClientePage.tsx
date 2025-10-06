import { useNavigate } from 'react-router-dom'
import { ClienteForm } from '../components/ClienteForm'
import { ArrowLeft } from 'lucide-react'

export const CreateClientePage = () => {
  const navigate = useNavigate()

  return (
    <div className="p-6">
      <div className="mb-6">
        <button
          onClick={() => navigate('/clientes')}
          className="flex items-center gap-2 text-foreground-secondary hover:text-foreground-primary transition-colors mb-4"
        >
          <ArrowLeft size={20} />
          Volver a clientes
        </button>
        <h1 className="text-2xl font-bold text-foreground-primary">Nuevo Cliente</h1>
      </div>

      <div className="bg-background rounded-lg shadow-soft border border-border p-6">
        <ClienteForm />
      </div>
    </div>
  )
}
