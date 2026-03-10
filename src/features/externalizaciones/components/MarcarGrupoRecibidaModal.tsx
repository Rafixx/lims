import { useForm } from 'react-hook-form'
import { X, CheckCircle, Loader2 } from 'lucide-react'
import { Button } from '@/shared/components/molecules/Button'
import { useNotification } from '@/shared/components/Notification/NotificationContext'
import { useMarcarGrupoComoRecibida } from '../hooks/useExternalizaciones'

interface MarcarGrupoRecibidaModalProps {
  ids: number[]
  descripcion: string
  onClose: () => void
  onSuccess: () => void
}

interface RecepcionFormData {
  f_recepcion: string
  observaciones?: string
}

export const MarcarGrupoRecibidaModal = ({
  ids,
  descripcion,
  onClose,
  onSuccess
}: MarcarGrupoRecibidaModalProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<RecepcionFormData>({
    defaultValues: {
      f_recepcion: new Date().toISOString().slice(0, 16)
    }
  })

  const { notify } = useNotification()
  const marcarGrupoMutation = useMarcarGrupoComoRecibida()

  const handleDateTimeFocus = () => {
    const currentValue = watch('f_recepcion')
    if (!currentValue) {
      setValue('f_recepcion', new Date().toISOString().slice(0, 16))
    }
  }

  const onSubmit = async (data: RecepcionFormData) => {
    try {
      const resultado = await marcarGrupoMutation.mutateAsync({ ids, data })
      if (resultado.ko > 0) {
        notify(
          `${resultado.ok} posiciones marcadas correctamente, ${resultado.ko} con error`,
          'warning'
        )
      } else {
        notify(`${resultado.ok} posiciones marcadas como recibidas`, 'success')
      }
      onSuccess()
    } catch (error) {
      console.error('Error marcando grupo como recibido:', error)
      notify('Error al marcar el grupo como recibido', 'error')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-strong max-w-lg w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-surface-200">
          <div>
            <h2 className="text-xl font-bold text-surface-900">Marcar placa como Recibida</h2>
            <p className="text-sm text-surface-600 mt-1">
              {descripcion} — {ids.length} posición{ids.length !== 1 ? 'es' : ''}
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
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={marcarGrupoMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="success"
              disabled={marcarGrupoMutation.isPending}
            >
              {marcarGrupoMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Procesando...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Marcar {ids.length} posición{ids.length !== 1 ? 'es' : ''} como Recibidas
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
