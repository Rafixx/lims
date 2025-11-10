import { ArrowLeft } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { PlantillaPasoForm } from '../components/PlantillaPasoForm'
import { usePlantillaPaso } from '@/shared/hooks/useDim_tables'

export const EditPlantillaPasoPage = () => {
  const { id } = useParams<{ id: string }>()
  const pasoId = parseInt(id || '0')

  const { data: paso, isLoading, error } = usePlantillaPaso(pasoId)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="text-foreground-secondary">Cargando paso...</div>
      </div>
    )
  }

  if (error || !paso) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <Link
              to="/plantillas-pasos"
              className="inline-flex items-center text-sm text-foreground-secondary hover:text-foreground-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Volver a pasos
            </Link>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-border p-6 text-center">
            <p className="text-estado-error">Error al cargar el paso</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-3xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            to="/plantillas-pasos"
            className="inline-flex items-center text-sm text-foreground-secondary hover:text-foreground-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Volver a pasos
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground-primary mb-2">Editar paso</h1>
          <p className="text-foreground-secondary">
            Modifique los datos del paso de plantilla técnica.
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border border-border p-6">
          <PlantillaPasoForm initialData={paso} />
        </div>
      </div>
    </div>
  )
}
