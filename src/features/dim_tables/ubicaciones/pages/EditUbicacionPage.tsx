import { Loader2 } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { useUbicacion } from '@/shared/hooks/useDim_tables'
import { UbicacionForm } from '../components/UbicacionForm'

export const EditUbicacionPage = () => {
  const { id } = useParams<{ id: string }>()
  const { data: ubicacion, isLoading, error } = useUbicacion(Number(id))

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !ubicacion) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-medium text-red-500">Error al cargar la ubicación</p>
          <p className="text-sm text-foreground-secondary">
            {error?.message || 'Ubicación no encontrada'}
          </p>
        </div>
      </div>
    )
  }

  return <UbicacionForm initialData={ubicacion} isEditMode />
}
