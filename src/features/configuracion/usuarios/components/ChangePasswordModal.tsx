import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { Eye, EyeOff, KeyRound } from 'lucide-react'
import { useChangePassword } from '../hooks/useUsuarios'
import { useNotification } from '@/shared/components/Notification/NotificationContext'
import { getErrorMessage } from '@/shared/utils/errorUtils'
import { Modal } from '@/shared/components/molecules/Modal'
import { Button } from '@/shared/components/molecules/Button'
import type { Usuario } from '../interfaces/usuario.types'

const schema = z
  .object({
    currentPassword: z.string().min(1, 'Contraseña actual requerida'),
    newPassword: z
      .string()
      .min(8, 'Mínimo 8 caracteres')
      .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
      .regex(/[a-z]/, 'Debe contener al menos una minúscula')
      .regex(/[0-9]/, 'Debe contener al menos un número'),
    confirmPassword: z.string().min(1, 'Confirmación requerida')
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword']
  })

type FormData = z.infer<typeof schema>

interface ChangePasswordModalProps {
  usuario: Usuario | null
  onClose: () => void
}

export const ChangePasswordModal = ({ usuario, onClose }: ChangePasswordModalProps) => {
  const { notify } = useNotification()
  const changePasswordMutation = useChangePassword()
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const handleClose = () => {
    reset()
    onClose()
  }

  const onSubmit = async (data: FormData) => {
    if (!usuario) return
    try {
      await changePasswordMutation.mutateAsync({
        id: usuario.id_usuario,
        data: {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword
        }
      })
      notify('Contraseña actualizada correctamente', 'success')
      handleClose()
    } catch (error) {
      notify(getErrorMessage(error, 'Error al cambiar la contraseña'), 'error')
    }
  }

  const fieldClass =
    'w-full px-3 py-2 border border-surface-200 rounded-md bg-white text-surface-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm pr-10'
  const labelClass = 'block text-sm font-medium text-surface-700 mb-1'
  const errorClass = 'mt-1 text-xs text-danger-600'

  return (
    <Modal
      isOpen={!!usuario}
      title={`Cambiar contraseña — ${usuario?.nombre ?? ''}`}
      onClose={handleClose}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="currentPassword" className={labelClass}>
            Contraseña actual *
          </label>
          <div className="relative">
            <input
              id="currentPassword"
              type={showCurrent ? 'text' : 'password'}
              {...register('currentPassword')}
              className={fieldClass}
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600"
              tabIndex={-1}
            >
              {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.currentPassword && (
            <p className={errorClass}>{errors.currentPassword.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="newPassword" className={labelClass}>
            Nueva contraseña *
          </label>
          <div className="relative">
            <input
              id="newPassword"
              type={showNew ? 'text' : 'password'}
              {...register('newPassword')}
              className={fieldClass}
              placeholder="Mín. 8 caracteres, mayúscula, número"
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600"
              tabIndex={-1}
            >
              {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.newPassword && <p className={errorClass}>{errors.newPassword.message}</p>}
        </div>

        <div>
          <label htmlFor="confirmPassword" className={labelClass}>
            Confirmar nueva contraseña *
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showNew ? 'text' : 'password'}
              {...register('confirmPassword')}
              className={fieldClass}
            />
          </div>
          {errors.confirmPassword && (
            <p className={errorClass}>{errors.confirmPassword.message}</p>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="warning" loading={isSubmitting} disabled={isSubmitting}>
            <KeyRound className="w-4 h-4" />
            {isSubmitting ? 'Guardando...' : 'Cambiar contraseña'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
