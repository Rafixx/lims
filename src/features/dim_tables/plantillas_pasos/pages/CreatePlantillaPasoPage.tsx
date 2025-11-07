import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PlantillaPasoForm } from '../components/PlantillaPasoForm'

export const CreatePlantillaPasoPage = () => {
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
          <h1 className="text-3xl font-bold text-foreground-primary mb-2">
            Crear paso de plantilla
          </h1>
          <p className="text-foreground-secondary">
            Complete el formulario para crear un nuevo paso de plantilla técnica.
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border border-border p-6">
          <PlantillaPasoForm />
        </div>
      </div>
    </div>
  )
}
