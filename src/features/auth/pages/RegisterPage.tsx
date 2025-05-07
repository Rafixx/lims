import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { createUser } from '@/shared/services/userService'
import { Button } from '@/shared/components/molecules/Button'

// Validación de campos según backend
const schema = z.object({
  nombre: z.string().min(2, 'Nombre requerido'),
  username: z.string().min(2, 'Username requerido'),
  email: z.string().email({ message: 'Email inválido' }),
  password: z.string().min(6, 'Contraseña mínima de 6 caracteres'),
  id_rol: z.coerce.number().min(1, 'Rol obligatorio')
})

type RegisterFormValues = z.infer<typeof schema>

export const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(schema),
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
      alert('Usuario creado correctamente')
    } catch {
      alert('Error al crear usuario')
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md mx-auto mt-12 p-4 border rounded space-y-4 bg-white shadow"
    >
      <h2 className="text-xl font-bold text-center mb-4">Registro de Usuario</h2>

      <div>
        <input
          {...register('nombre')}
          placeholder="Nombre completo"
          className="w-full p-2 border rounded"
        />
        {errors.nombre && <p className="text-red-500 text-sm">{errors.nombre.message}</p>}
      </div>

      <div>
        <input
          {...register('username')}
          placeholder="Nombre de usuario"
          className="w-full p-2 border rounded"
        />
        {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
      </div>

      <div>
        <input {...register('email')} placeholder="Email" className="w-full p-2 border rounded" />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
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

      <div>
        <input
          {...register('id_rol')}
          type="number"
          placeholder="ID Rol (ej. 1)"
          className="w-full p-2 border rounded"
        />
        {errors.id_rol && <p className="text-red-500 text-sm">{errors.id_rol.message}</p>}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Registrando...' : 'Registrar'}
      </Button>
    </form>
  )
}
