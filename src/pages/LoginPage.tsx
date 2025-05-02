import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useNavigate } from 'react-router-dom'
import { login as loginApi } from '../shared/services/authService'
import { useUser } from '../shared/contexts/UserContext'

// Esquema de validación
const loginSchema = z.object({
  username: z.string().min(2, 'Username requerido'),
  password: z.string().min(6, 'Contraseña mínima de 6 caracteres')
})

type LoginFormValues = z.infer<typeof loginSchema>

export const LoginPage = () => {
  const navigate = useNavigate()
  const { login } = useUser()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    // Por esto:
    defaultValues: { username: 'demo', password: '123456' }
  })

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const { token } = await loginApi(data)
      login(token) // actualiza el contexto de usuario
      navigate('/dashboard')
    } catch {
      alert('Credenciales inválidas')
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md mx-auto mt-24 p-6 bg-white shadow rounded space-y-4"
    >
      <h2 className="text-2xl font-bold text-center">Iniciar sesión</h2>

      <div>
        <input
          {...register('username')}
          placeholder="Nombre de usuario"
          className="w-full p-2 border rounded"
        />
        {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
      </div>

      <div>
        <input
          {...register('password')}
          type="password"
          placeholder="Contraseña"
          className="w-full p-2 border rounded"
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {isSubmitting ? 'Entrando...' : 'Entrar'}
      </button>
    </form>
  )
}
