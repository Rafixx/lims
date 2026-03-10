import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { Eye, EyeOff, Save, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useCreateUsuario, useUpdateUsuario, useRoles } from '../hooks/useUsuarios'
import { useNotification } from '@/shared/components/Notification/NotificationContext'
import { getErrorMessage } from '@/shared/utils/errorUtils'
import { Button } from '@/shared/components/molecules/Button'
import type { Usuario } from '../interfaces/usuario.types'

const passwordSchema = z
  .string()
  .min(8, 'Mínimo 8 caracteres')
  .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
  .regex(/[a-z]/, 'Debe contener al menos una minúscula')
  .regex(/[0-9]/, 'Debe contener al menos un número')

const createSchema = z.object({
  nombre: z.string().min(2, 'Nombre requerido'),
  username: z.string().min(2, 'Usuario requerido'),
  email: z.string().email('Email inválido'),
  id_rol: z.coerce.number().min(1, 'Rol obligatorio'),
  password: passwordSchema
})

const editSchema = z.object({
  nombre: z.string().min(2, 'Nombre requerido'),
  username: z.string().min(2, 'Usuario requerido'),
  email: z.string().email('Email inválido'),
  id_rol: z.coerce.number().min(1, 'Rol obligatorio')
})

type CreateFormData = z.infer<typeof createSchema>
type EditFormData = z.infer<typeof editSchema>

interface UsuarioFormProps {
  initialData?: Usuario
}

const FALLBACK_ROLES = [
  { id_rol: 1, name: 'Administrador' },
  { id_rol: 2, name: 'Técnico' },
  { id_rol: 3, name: 'Visualizador' }
]

export const UsuarioForm = ({ initialData }: UsuarioFormProps) => {
  const navigate = useNavigate()
  const isEditMode = Boolean(initialData?.id_usuario)
  const { notify } = useNotification()
  const [showPassword, setShowPassword] = useState(false)

  const createMutation = useCreateUsuario()
  const updateMutation = useUpdateUsuario()
  const { data: roles } = useRoles()
  const roleList = roles && roles.length > 0 ? roles : FALLBACK_ROLES

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting }
  } = useForm<CreateFormData | EditFormData>({
    resolver: zodResolver(isEditMode ? editSchema : createSchema),
    defaultValues: isEditMode
      ? {
          nombre: initialData?.nombre ?? '',
          username: initialData?.username ?? '',
          email: initialData?.email ?? '',
          id_rol: initialData?.id_rol ?? 1
        }
      : {
          nombre: '',
          username: '',
          email: '',
          id_rol: 1,
          password: ''
        }
  })

  const onSubmit = async (data: CreateFormData | EditFormData) => {
    try {
      if (isEditMode && initialData?.id_usuario) {
        await updateMutation.mutateAsync({ id: initialData.id_usuario, data })
        notify('Usuario actualizado correctamente', 'success')
      } else {
        await createMutation.mutateAsync(data as CreateFormData)
        notify('Usuario creado correctamente', 'success')
      }
      navigate('/usuarios')
    } catch (error) {
      notify(getErrorMessage(error, 'Error al guardar el usuario'), 'error')
    }
  }

  const fieldClass =
    'w-full px-3 py-2 border border-surface-200 rounded-md bg-white text-surface-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm disabled:opacity-50'
  const labelClass = 'block text-sm font-medium text-surface-700 mb-1'
  const errorClass = 'mt-1 text-xs text-danger-600'

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="nombre" className={labelClass}>
            Nombre completo *
          </label>
          <input id="nombre" type="text" {...register('nombre')} className={fieldClass} />
          {errors.nombre && <p className={errorClass}>{errors.nombre.message}</p>}
        </div>

        <div>
          <label htmlFor="username" className={labelClass}>
            Usuario *
          </label>
          <input id="username" type="text" {...register('username')} className={fieldClass} />
          {errors.username && <p className={errorClass}>{errors.username.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="email" className={labelClass}>
            Email *
          </label>
          <input id="email" type="email" {...register('email')} className={fieldClass} />
          {errors.email && <p className={errorClass}>{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="id_rol" className={labelClass}>
            Rol *
          </label>
          <select id="id_rol" {...register('id_rol')} className={fieldClass}>
            {roleList.map(rol => (
              <option key={rol.id_rol} value={rol.id_rol}>
                {rol.name}
              </option>
            ))}
          </select>
          {errors.id_rol && <p className={errorClass}>{errors.id_rol.message}</p>}
        </div>
      </div>

      {!isEditMode && (
        <div>
          <label htmlFor="password" className={labelClass}>
            Contraseña *
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              {...register('password' as keyof CreateFormData)}
              className={`${fieldClass} pr-10`}
              placeholder="Mín. 8 caracteres, mayúscula, número"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {'password' in errors && errors.password && (
            <p className={errorClass}>{errors.password.message}</p>
          )}
        </div>
      )}

      <div className="flex justify-end gap-3 pt-4 border-t border-surface-100">
        <Button type="button" variant="secondary" onClick={() => navigate('/usuarios')}>
          <X className="w-4 h-4" />
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="primary"
          loading={isSubmitting}
          disabled={isSubmitting || (isEditMode && !isDirty)}
        >
          <Save className="w-4 h-4" />
          {isSubmitting ? 'Guardando...' : isEditMode ? 'Actualizar' : 'Crear usuario'}
        </Button>
      </div>
    </form>
  )
}
