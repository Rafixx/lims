import { Edit, Trash2, KeyRound } from 'lucide-react'
import { ReactNode } from 'react'
import { ListDetail, ListDetailAction } from '@/shared/components/organisms/ListDetail'
import type { Usuario } from '../../interfaces/usuario.types'

interface UsuarioListDetailProps {
  usuario: Usuario
  onEdit: (usuario: Usuario) => void
  onDelete: (usuario: Usuario) => void
  onChangePassword: (usuario: Usuario) => void
  fieldSpans: number[]
}

const ROL_LABELS: Record<number, { label: string; className: string }> = {
  1: { label: 'Admin', className: 'bg-danger-100 text-danger-700' },
  2: { label: 'Técnico', className: 'bg-primary-100 text-primary-700' },
  3: { label: 'Visualizador', className: 'bg-surface-100 text-surface-600' }
}

export const UsuarioListDetail = ({
  usuario,
  onEdit,
  onDelete,
  onChangePassword,
  fieldSpans
}: UsuarioListDetailProps) => {
  const rolInfo = ROL_LABELS[usuario.id_rol] ?? {
    label: usuario.rol_name ?? `Rol ${usuario.id_rol}`,
    className: 'bg-surface-100 text-surface-600'
  }

  const renderFields = (): ReactNode[] => [
    <span key="nombre" className="font-medium text-surface-800">
      {usuario.nombre}
    </span>,
    <span key="username" className="font-mono text-sm text-surface-600">
      {usuario.username}
    </span>,
    <span key="email" className="text-sm text-surface-600 truncate">
      {usuario.email}
    </span>,
    <span
      key="rol"
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${rolInfo.className}`}
    >
      {rolInfo.label}
    </span>
  ]

  const actions: ListDetailAction[] = [
    {
      icon: <KeyRound className="w-4 h-4" />,
      onClick: () => onChangePassword(usuario),
      title: 'Cambiar contraseña',
      className: 'p-1 text-warning-600 hover:bg-warning-50 rounded transition-colors'
    },
    {
      icon: <Edit className="w-4 h-4" />,
      onClick: () => onEdit(usuario),
      title: 'Editar',
      className: 'p-1 text-primary-600 hover:bg-primary-50 rounded transition-colors'
    },
    {
      icon: <Trash2 className="w-4 h-4" />,
      onClick: () => onDelete(usuario),
      title: 'Eliminar',
      className: 'p-1 text-danger-600 hover:bg-danger-50 rounded transition-colors'
    }
  ]

  return (
    <ListDetail item={usuario} fieldSpans={fieldSpans} renderFields={renderFields} actions={actions} />
  )
}
