import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, UserPlus } from 'lucide-react'
import { createUser } from '@/shared/services/userUser'
import { useNotification } from '@/shared/components/Notification/NotificationContext'
import { Button } from '@/shared/components/molecules/Button'
import { Input } from '@/shared/components/molecules/Input'
import { Label } from '@/shared/components/atoms/Label'
import { AuthLayout } from '../components/AuthLayout'

const registerSchema = z.object({
  nombre: z.string().min(2, 'Nombre requerido'),
  username: z.string().min(2, 'Username requerido'),
  email: z.string().email({ message: 'Email inválido' }),
  password: z.string().min(6, 'Contraseña mínima de 6 caracteres'),
  id_rol: z.coerce.number().min(1, 'Rol obligatorio')
})

type RegisterFormValues = z.infer<typeof registerSchema>

export const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const { notify } = useNotification()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      nombre: 'Demo Admin',
      username: 'demo',
      email: 'demo@lims.com',
      password: '123456',
      id_rol: 1
    }
  })

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      await createUser(data)
      notify('Usuario creado correctamente', 'success')
      navigate('/login')
    } catch {
      notify('Error al crear usuario', 'error')
    }
  }

  return (
    <AuthLayout title="Crear cuenta" subtitle="Registra un nuevo usuario en el sistema.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Nombre y Username en 2 columnas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="nombre">Nombre completo</Label>
            <Input
              id="nombre"
              placeholder="Nombre completo"
              autoComplete="name"
              {...register('nombre')}
            />
            {errors.nombre && (
              <p className="text-xs text-danger-600 mt-1">{errors.nombre.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="username">Usuario</Label>
            <Input
              id="username"
              placeholder="Nombre de usuario"
              autoComplete="username"
              {...register('username')}
            />
            {errors.username && (
              <p className="text-xs text-danger-600 mt-1">{errors.username.message}</p>
            )}
          </div>
        </div>

        {/* Email */}
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="correo@ejemplo.com"
            autoComplete="email"
            {...register('email')}
          />
          {errors.email && (
            <p className="text-xs text-danger-600 mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <Label htmlFor="password">Contraseña</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Mínimo 6 caracteres"
              autoComplete="new-password"
              className="pr-10"
              {...register('password')}
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
          {errors.password && (
            <p className="text-xs text-danger-600 mt-1">{errors.password.message}</p>
          )}
        </div>

        {/* Rol */}
        <div>
          <Label htmlFor="id_rol">Rol</Label>
          <Input
            id="id_rol"
            type="number"
            placeholder="ID del rol (ej. 1)"
            {...register('id_rol')}
          />
          {errors.id_rol && (
            <p className="text-xs text-danger-600 mt-1">{errors.id_rol.message}</p>
          )}
        </div>

        {/* Submit */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={isSubmitting}
          disabled={isSubmitting}
        >
          <UserPlus className="w-4 h-4" />
          {isSubmitting ? 'Registrando...' : 'Crear cuenta'}
        </Button>

        {/* Link a login */}
        <p className="text-center text-sm text-surface-500">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
            Inicia sesión
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}
