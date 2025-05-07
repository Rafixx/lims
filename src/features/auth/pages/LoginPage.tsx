import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
// import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login as loginApi } from '@/shared/services/authService'
import { useUser } from '@/shared/contexts/UserContext'
import { useNotification } from '@/shared/components/Notification/NotificationContext'
import { Button } from '@/shared/components/molecules/Button'

// Esquema de validación
const loginSchema = z.object({
  username: z.string().min(2, 'Username requerido'),
  password: z.string().min(6, 'Contraseña mínima de 6 caracteres')
})

type LoginFormValues = z.infer<typeof loginSchema>

export const LoginPage = () => {
  // const [loginError, setLoginError] = useState('')
  const navigate = useNavigate()
  const { login } = useUser()
  const { notify } = useNotification()

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
      // setLoginError('Credenciales inválidas')
      notify('Credenciales inválidas', 'error')
    }
  }

  // const onChange = () => {
  //   if (loginError) {
  //     setLoginError('')
  //   }
  // }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      // onChange={onChange}
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

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Entrando...' : 'Entrar'}
      </Button>
      {/* {loginError && <p className="text-red-600 text-sm mt-2">{loginError}</p>} */}
    </form>
  )
}
