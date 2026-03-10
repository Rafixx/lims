import { useParams, useNavigate } from 'react-router-dom'
import { useUsuario } from '../hooks/useUsuarios'
import { UsuarioForm } from '../components/UsuarioForm'
import { ArrowLeft } from 'lucide-react'

export const CreateUsuarioPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEditMode = Boolean(id)

  const { data: usuario, isLoading, error } = useUsuario(id ? parseInt(id) : undefined)

  const backBtn = (
    <button
      onClick={() => navigate('/usuarios')}
      className="mb-6 flex items-center gap-2 text-surface-500 hover:text-surface-700 transition-colors text-sm"
    >
      <ArrowLeft className="w-4 h-4" />
      Volver a Usuarios
    </button>
  )

  if (isEditMode && isLoading) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        {backBtn}
        <div className="rounded-lg border border-surface-200 bg-white p-8 text-center text-surface-500">
          Cargando...
        </div>
      </div>
    )
  }

  if (isEditMode && error) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        {backBtn}
        <div className="rounded-lg border border-surface-200 bg-white p-8 text-center text-danger-600">
          Error al cargar el usuario
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {backBtn}
      <div className="rounded-lg border border-surface-200 bg-white p-8">
        <h1 className="text-xl font-bold text-surface-900 mb-6">
          {isEditMode ? 'Editar usuario' : 'Nuevo usuario'}
        </h1>
        <UsuarioForm initialData={isEditMode ? usuario : undefined} />
      </div>
    </div>
  )
}
