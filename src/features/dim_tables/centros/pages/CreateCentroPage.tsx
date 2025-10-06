import { useParams, useNavigate } from 'react-router-dom'
import { useCentro } from '@/shared/hooks/useDim_tables'
import { CentroForm } from '../components/CentroForm'
import { ArrowLeft } from 'lucide-react'

export const CreateCentroPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEditMode = Boolean(id)

  const { data: centro, isLoading, error } = useCentro(id ? parseInt(id) : 0)

  if (isEditMode && isLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="mx-auto max-w-2xl">
          <button
            onClick={() => navigate('/centros')}
            className="mb-6 flex items-center gap-2 text-foreground-secondary hover:text-foreground-primary transition-colors"
          >
            <ArrowLeft size={20} />
            Volver a Centros
          </button>
          <div className="rounded-lg border border-border bg-card p-8">
            <div className="flex items-center justify-center">
              <div className="text-foreground-secondary">Cargando...</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (isEditMode && error) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="mx-auto max-w-2xl">
          <button
            onClick={() => navigate('/centros')}
            className="mb-6 flex items-center gap-2 text-foreground-secondary hover:text-foreground-primary transition-colors"
          >
            <ArrowLeft size={20} />
            Volver a Centros
          </button>
          <div className="rounded-lg border border-border bg-card p-8">
            <div className="text-center">
              <p className="text-estado-error">Error al cargar el centro</p>
              <p className="text-sm text-foreground-secondary mt-2">
                {error instanceof Error ? error.message : 'Error desconocido'}
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-2xl">
        <button
          onClick={() => navigate('/centros')}
          className="mb-6 flex items-center gap-2 text-foreground-secondary hover:text-foreground-primary transition-colors"
        >
          <ArrowLeft size={20} />
          Volver a Centros
        </button>
        <div className="rounded-lg border border-border bg-card p-8">
          <h1 className="text-2xl font-bold text-foreground-primary mb-6">
            {isEditMode ? 'Editar Centro' : 'Nuevo Centro'}
          </h1>
          <CentroForm initialData={centro} />
        </div>
      </div>
    </div>
  )
}
