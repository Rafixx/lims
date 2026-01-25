import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { X, Send, Loader2 } from 'lucide-react'
import { Button } from '@/shared/components/molecules/Button'
import { useNotification } from '@/shared/components/Notification/NotificationContext'
import { useCentros, useTecnicosLaboratorio } from '@/shared/hooks/useDim_tables'
import { useEnviarExternalizaciones } from '../hooks/useExternalizaciones'

interface EnviarExternalizacionesModalProps {
  externalizacionIds: number[]
  onClose: () => void
  onSuccess: () => void
}

interface EnvioFormData {
  servicio: string
  agencia: string
  id_centro: number | null
  id_tecnico_resp: number | null
  f_envio: string
  observaciones?: string
}

export const EnviarExternalizacionesModal = ({
  externalizacionIds,
  onClose,
  onSuccess
}: EnviarExternalizacionesModalProps) => {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<EnvioFormData>({
    defaultValues: {
      f_envio: new Date().toISOString().slice(0, 16) // Fecha y hora actual
    }
  })

  const { notify } = useNotification()
  const { data: centros = [] } = useCentros()
  const { data: tecnicosLaboratorio = [] } = useTecnicosLaboratorio()
  const enviarMutation = useEnviarExternalizaciones()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Helper para auto-completar fecha/hora actual si está vacío
  const handleDateTimeFocus = () => {
    const currentValue = watch('f_envio')
    if (!currentValue) {
      setValue('f_envio', new Date().toISOString().slice(0, 16))
    }
  }

  const onSubmit = async (data: EnvioFormData) => {
    setIsSubmitting(true)
    try {
      await enviarMutation.mutateAsync({
        externalizacionIds,
        data
      })
      notify(`${externalizacionIds.length} externalización(es) enviada(s) correctamente`, 'success')
      onSuccess()
    } catch (error) {
      console.error('Error enviando externalizaciones:', error)
      notify('Error al enviar las externalizaciones', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-strong max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-surface-200">
          <div>
            <h2 className="text-xl font-bold text-surface-900">
              Enviar Externalizaciones
            </h2>
            <p className="text-sm text-surface-600 mt-1">
              Se enviarán {externalizacionIds.length} externalización(es) seleccionada(s)
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
          {/* Servicio */}
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">
              Servicio <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('servicio', { required: 'El servicio es requerido' })}
              placeholder="ej: Secuenciación NGS"
              className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            {errors.servicio && (
              <span className="text-red-500 text-sm">{errors.servicio.message}</span>
            )}
          </div>

          {/* Agencia */}
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">
              Agencia <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('agencia', { required: 'La agencia es requerida' })}
              placeholder="ej: Laboratorio Externo A"
              className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            {errors.agencia && (
              <span className="text-red-500 text-sm">{errors.agencia.message}</span>
            )}
          </div>

          {/* Centro */}
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">
              Centro <span className="text-red-500">*</span>
            </label>
            <select
              {...register('id_centro', {
                required: 'El centro es requerido',
                setValueAs: v => (v === '' ? null : Number(v))
              })}
              className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Seleccionar centro</option>
              {centros.map((centro: { id: number; codigo: string; descripcion?: string }) => (
                <option key={centro.id} value={centro.id}>
                  {centro.descripcion || centro.codigo}
                </option>
              ))}
            </select>
            {errors.id_centro && (
              <span className="text-red-500 text-sm">{errors.id_centro.message}</span>
            )}
          </div>

          {/* Técnico Responsable */}
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">
              Técnico Responsable <span className="text-red-500">*</span>
            </label>
            <select
              {...register('id_tecnico_resp', {
                required: 'El técnico responsable es requerido',
                setValueAs: v => (v === '' ? null : Number(v))
              })}
              className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Seleccionar técnico</option>
              {tecnicosLaboratorio.map((tecnico: { id_usuario: number; nombre?: string }) => (
                <option key={tecnico.id_usuario} value={tecnico.id_usuario}>
                  {tecnico.nombre || `Usuario ${tecnico.id_usuario}`}
                </option>
              ))}
            </select>
            {errors.id_tecnico_resp && (
              <span className="text-red-500 text-sm">{errors.id_tecnico_resp.message}</span>
            )}
          </div>

          {/* Fecha de Envío */}
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">
              Fecha de Envío <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              {...register('f_envio', { required: 'La fecha de envío es requerida' })}
              onFocus={handleDateTimeFocus}
              className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            {errors.f_envio && (
              <span className="text-red-500 text-sm">{errors.f_envio.message}</span>
            )}
          </div>

          {/* Observaciones */}
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">
              Observaciones
            </label>
            <textarea
              {...register('observaciones')}
              rows={3}
              placeholder="Observaciones sobre el envío..."
              className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-surface-200">
            <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Enviar Externalizaciones
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
