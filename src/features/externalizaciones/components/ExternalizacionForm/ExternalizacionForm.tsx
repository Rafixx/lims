import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { useNotification } from '@/shared/components/Notification/NotificationContext'
import { Button } from '@/shared/components/molecules/Button'
import { SendIcon } from 'lucide-react'
import { ExternalizacionFormData } from '../../interfaces/externalizaciones.types'
import {
  useCreateExternalizacion,
  useUpdateExternalizacion
} from '../../hooks/useExternalizaciones'
import { useCentros, useTecnicosLaboratorio } from '@/shared/hooks/useDim_tables'

interface Props {
  initialValues?: ExternalizacionFormData
  onSuccess?: () => void
  onCancel?: () => void
  externalizacionId?: number
  tecnicaNombre?: string // Nombre de la técnica para mostrar en modo edición
}

const DEFAULT_EXTERNALIZACION: ExternalizacionFormData = {
  id_tecnica: 0,
  volumen: null,
  concentracion: null,
  servicio: null,
  f_envio: null,
  f_recepcion: null,
  f_recepcion_datos: null,
  agencia: null,
  observaciones: null,
  id_centro: null,
  id_tecnico_resp: null
}

export const ExternalizacionForm = ({
  initialValues,
  onSuccess,
  onCancel,
  externalizacionId,
  tecnicaNombre
}: Props) => {
  const isEditMode = !!externalizacionId
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ExternalizacionFormData>({
    defaultValues: initialValues || DEFAULT_EXTERNALIZACION
  })

  const createMutation = useCreateExternalizacion()
  const updateMutation = useUpdateExternalizacion()
  const { notify } = useNotification()
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const { data: centros = [] } = useCentros()
  const { data: tecnicosLaboratorio = [] } = useTecnicosLaboratorio()

  const onSubmit = async (data: ExternalizacionFormData) => {
    setIsSubmitting(true)
    try {
      if (externalizacionId) {
        await updateMutation.mutateAsync({ id: externalizacionId, data })
        notify('Externalización actualizada correctamente', 'success')
      } else {
        await createMutation.mutateAsync(data)
        notify('Externalización creada correctamente', 'success')
      }
      onSuccess?.()
    } catch (error) {
      console.error('Error al guardar externalización:', error)
      notify('Error al guardar la externalización', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-soft space-y-4">
        <h3 className="text-lg font-semibold text-surface-800">Datos de la Externalización</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Técnica (solo lectura en modo edición) */}
          {isEditMode && tecnicaNombre ? (
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">Técnica</label>
              <div className="w-full px-3 py-2 border border-surface-200 rounded-lg bg-surface-50 text-surface-700">
                {tecnicaNombre}
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">
                ID Técnica <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                {...register('id_tecnica', { required: 'ID de técnica es requerido', min: 1 })}
                className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              {errors.id_tecnica && (
                <span className="text-red-500 text-sm">{errors.id_tecnica.message}</span>
              )}
            </div>
          )}

          {/* Volumen */}
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">Volumen</label>
            <input
              type="text"
              {...register('volumen')}
              placeholder="ej: 500µL"
              className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Concentración */}
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">
              Concentración
            </label>
            <input
              type="text"
              {...register('concentracion')}
              placeholder="ej: 50ng/µL"
              className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Servicio */}
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">Servicio</label>
            <input
              type="text"
              {...register('servicio')}
              placeholder="ej: Secuenciación NGS"
              className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Agencia */}
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">Agencia</label>
            <input
              type="text"
              {...register('agencia')}
              placeholder="ej: Laboratorio Externo A"
              className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Centro */}
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">Centro</label>
            <select
              {...register('id_centro')}
              className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Seleccionar centro</option>
              {centros.map((centro: { id: number; codigo: string; descripcion?: string }) => (
                <option key={centro.id} value={centro.id}>
                  {centro.descripcion || centro.codigo}
                </option>
              ))}
            </select>
          </div>

          {/* Técnico Responsable */}
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">
              Técnico Responsable
            </label>
            <select
              {...register('id_tecnico_resp')}
              className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Seleccionar técnico</option>
              {tecnicosLaboratorio.map((tecnico: { id_usuario: number; nombre?: string }) => (
                <option key={tecnico.id_usuario} value={tecnico.id_usuario}>
                  {tecnico.nombre || `Usuario ${tecnico.id_usuario}`}
                </option>
              ))}
            </select>
          </div>

          {/* Fecha de Envío */}
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">
              Fecha de Envío
            </label>
            <input
              type="datetime-local"
              {...register('f_envio')}
              className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Fecha de Recepción */}
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">
              Fecha de Recepción
            </label>
            <input
              type="datetime-local"
              {...register('f_recepcion')}
              className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Fecha de Recepción de Datos */}
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">
              Fecha de Recepción de Datos
            </label>
            <input
              type="datetime-local"
              {...register('f_recepcion_datos')}
              className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Observaciones */}
        <div>
          <label className="block text-sm font-medium text-surface-700 mb-1">Observaciones</label>
          <textarea
            {...register('observaciones')}
            rows={3}
            className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex justify-end gap-3">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          <SendIcon className="w-4 h-4" />
          {isSubmitting
            ? 'Guardando...'
            : externalizacionId
              ? 'Actualizar Externalización'
              : 'Crear Externalización'}
        </Button>
      </div>
    </form>
  )
}
