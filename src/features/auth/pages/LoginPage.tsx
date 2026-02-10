import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, LogIn } from 'lucide-react'
import { login as loginApi } from '@/shared/services/authService'
import { useUser } from '@/shared/contexts/UserContext'
import { useNotification } from '@/shared/components/Notification/NotificationContext'
import { Button } from '@/shared/components/molecules/Button'
import { Input } from '@/shared/components/molecules/Input'
import { Label } from '@/shared/components/atoms/Label'
import { AuthLayout } from '../components/AuthLayout'

const loginSchema = z.object({
  username: z.string().min(2, 'Username requerido'),
  password: z.string().min(6, 'Contraseña mínima de 6 caracteres')
})

type LoginFormValues = z.infer<typeof loginSchema>

export const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const { login } = useUser()
  const { notify } = useNotification()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: 'demo', password: '123456' }
  })

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const { token } = await loginApi(data)
      login(token)
      navigate('/dashboard')
    } catch {
      notify('Credenciales inválidas', 'error')
    }
  }

  return (
    <AuthLayout
      title="Iniciar sesión"
      subtitle="Introduce tus credenciales para acceder al sistema."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Username */}
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

        {/* Password */}
        <div>
          <Label htmlFor="password">Contraseña</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Introduce tu contraseña"
              autoComplete="current-password"
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

        {/* Submit */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={isSubmitting}
          disabled={isSubmitting}
        >
          <LogIn className="w-4 h-4" />
          {isSubmitting ? 'Entrando...' : 'Entrar'}
        </Button>

        {/* Link a registro */}
        <p className="text-center text-sm text-surface-500">
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
            Regístrate
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}
