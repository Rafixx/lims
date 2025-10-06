import { ArrowLeft, Loader2 } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { PacienteForm } from '../components/PacienteForm'
import { usePaciente } from '@/shared/hooks/useDim_tables'

export const EditPacientePage = () => {
  const { id } = useParams<{ id: string }>()
  const { data: paciente, isLoading, error } = usePaciente(Number(id))

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-blue-500" size={32} />
      </div>
    )
  }

  if (error || !paciente) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link
            to="/pacientes"
            className="p-2 hover:bg-background-hover rounded-md transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-foreground-primary">Editar Paciente</h1>
        </div>
        <div className="bg-estado-error/10 border border-estado-error rounded-lg p-4">
          <p className="text-estado-error">
            {error instanceof Error ? error.message : 'No se pudo cargar el paciente'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          to="/pacientes"
          className="p-2 hover:bg-background-hover rounded-md transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground-primary">Editar Paciente</h1>
          <p className="text-sm text-foreground-secondary mt-1">
            Modificando: <span className="font-medium">{paciente.nombre}</span>
          </p>
        </div>
      </div>

      <div className="bg-background-secondary rounded-lg shadow-sm border border-border p-6">
        <PacienteForm initialData={paciente} />
      </div>
    </div>
  )
}
