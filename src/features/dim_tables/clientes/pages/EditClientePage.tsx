import { useNavigate, useParams } from 'react-router-dom'
import { ClienteForm } from '../components/ClienteForm'
import { useCliente } from '@/shared/hooks/useDim_tables'
import { ArrowLeft, Loader2 } from 'lucide-react'

export const EditClientePage = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const clienteId = id ? parseInt(id) : undefined

  const { data: cliente, isLoading, error } = useCliente(clienteId)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    )
  }

  if (error || !cliente) {
    return (
      <div className="p-6">
        <div className="bg-danger-50 border border-danger-200 rounded-lg p-4">
          <p className="text-danger-700">{error?.message || 'No se pudo cargar el cliente'}</p>
        </div>
      </div>
    )
  }

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
        <h1 className="text-2xl font-bold text-foreground-primary">Editar Cliente</h1>
        <p className="text-foreground-secondary mt-1">{cliente.nombre}</p>
      </div>

      <div className="bg-background rounded-lg shadow-soft border border-border p-6">
        <ClienteForm initialData={cliente} />
      </div>
    </div>
  )
}
