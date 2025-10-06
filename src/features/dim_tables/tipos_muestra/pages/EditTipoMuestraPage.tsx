import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { TipoMuestraForm } from '../components/TipoMuestraForm'
import { useTipoMuestra } from '@/shared/hooks/useDim_tables'

export const EditTipoMuestraPage = () => {
  const { id } = useParams<{ id: string }>()
  const { data: tipoMuestra, isLoading, error } = useTipoMuestra(Number(id))

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (error || !tipoMuestra) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link
            to="/tipos-muestra"
            className="p-2 hover:bg-background-hover rounded-md transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-foreground-primary">Editar Tipo de Muestra</h1>
        </div>
        <div className="bg-estado-error-light border border-estado-error rounded-lg p-4">
          <p className="text-estado-error">
            {error?.message || 'No se pudo cargar el tipo de muestra'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          to="/tipos-muestra"
          className="p-2 hover:bg-background-hover rounded-md transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-foreground-primary">Editar Tipo de Muestra</h1>
      </div>

      <div className="bg-background border border-border rounded-lg p-6">
        <TipoMuestraForm initialData={tipoMuestra} />
      </div>
    </div>
  )
}
