import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { X, CheckCircle, Loader2 } from 'lucide-react'
import { Button } from '@/shared/components/molecules/Button'
import { useNotification } from '@/shared/components/Notification/NotificationContext'
import { useMarcarComoRecibida } from '../hooks/useExternalizaciones'
import { Externalizacion } from '../interfaces/externalizaciones.types'

interface MarcarRecibidaModalProps {
  externalizacion: Externalizacion
  onClose: () => void
  onSuccess: () => void
}

interface RecepcionFormData {
  f_recepcion: string
  observaciones?: string
}

export const MarcarRecibidaModal = ({
  externalizacion,
  onClose,
  onSuccess
}: MarcarRecibidaModalProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<RecepcionFormData>({
    defaultValues: {
      f_recepcion: new Date().toISOString().slice(0, 16) // Fecha y hora actual
    }
  })

  const { notify } = useNotification()
  const marcarRecibidaMutation = useMarcarComoRecibida()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Helper para auto-completar fecha/hora actual si está vacío
  const handleDateTimeFocus = () => {
    const currentValue = watch('f_recepcion')
    if (!currentValue) {
      setValue('f_recepcion', new Date().toISOString().slice(0, 16))
    }
  }

  const onSubmit = async (data: RecepcionFormData) => {
    setIsSubmitting(true)
    try {
      await marcarRecibidaMutation.mutateAsync({
        id: externalizacion.id_externalizacion,
        data
      })
      notify('Externalización marcada como recibida correctamente', 'success')
      onSuccess()
    } catch (error) {
      console.error('Error marcando como recibida:', error)
      notify('Error al marcar la externalización como recibida', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-strong max-w-lg w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-surface-200">
          <div>
            <h2 className="text-xl font-bold text-surface-900">Marcar como Recibida</h2>
            <p className="text-sm text-surface-600 mt-1">
              Externalización #{externalizacion.id_externalizacion}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-100 rounded-lg transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5 text-surface-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {/* Información de la externalización */}
          <div className="bg-surface-50 p-4 rounded-lg space-y-2">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="font-medium text-surface-600">Muestra:</span>
                <div className="text-surface-900">
                  {externalizacion.tecnica?.muestra?.codigo_externo || '-'}
                </div>
              </div>
              <div>
                <span className="font-medium text-surface-600">Técnica:</span>
                <div className="text-surface-900">
                  {externalizacion.tecnica?.tecnica_proc?.tecnica_proc || '-'}
                </div>
              </div>
              <div>
                <span className="font-medium text-surface-600">Agencia:</span>
                <div className="text-surface-900">{externalizacion.agencia || '-'}</div>
              </div>
              <div>
                <span className="font-medium text-surface-600">Servicio:</span>
                <div className="text-surface-900">{externalizacion.servicio || '-'}</div>
              </div>
            </div>
          </div>

          {/* Fecha de Recepción */}
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">
              Fecha de Recepción <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              {...register('f_recepcion', { required: 'La fecha de recepción es requerida' })}
              onFocus={handleDateTimeFocus}
              className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            {errors.f_recepcion && (
              <span className="text-red-500 text-sm">{errors.f_recepcion.message}</span>
            )}
          </div>

          {/* Observaciones */}
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">Observaciones</label>
            <textarea
              {...register('observaciones')}
              rows={3}
              placeholder="Observaciones sobre la recepción..."
              className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-surface-200">
            <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" variant="success" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Procesando...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Marcar como Recibida
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
