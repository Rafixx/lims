import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCreateTipoMuestra, useUpdateTipoMuestra } from '@/shared/hooks/useDim_tables'
import { TipoMuestra } from '@/shared/interfaces/dim_tables.types'
import { useNavigate } from 'react-router-dom'
import { Save, X } from 'lucide-react'
import { useNotification } from '@/shared/components/Notification/NotificationContext'

const tipoMuestraSchema = z.object({
  cod_tipo_muestra: z.string().min(1, 'El código de tipo de muestra es obligatorio'),
  tipo_muestra: z.string().optional()
})

type TipoMuestraFormData = z.infer<typeof tipoMuestraSchema>

interface TipoMuestraFormProps {
  initialData?: TipoMuestra
}

export const TipoMuestraForm = ({ initialData }: TipoMuestraFormProps) => {
  const navigate = useNavigate()
  const isEditMode = Boolean(initialData?.id)
  const { notify } = useNotification()

  const createMutation = useCreateTipoMuestra()
  const updateMutation = useUpdateTipoMuestra()

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty }
  } = useForm<TipoMuestraFormData>({
    resolver: zodResolver(tipoMuestraSchema),
    defaultValues: {
      cod_tipo_muestra: initialData?.cod_tipo_muestra || '',
      tipo_muestra: initialData?.tipo_muestra || ''
    }
  })

  const onSubmit = async (data: TipoMuestraFormData) => {
    try {
      if (isEditMode && initialData?.id) {
        await updateMutation.mutateAsync({
          id: initialData.id,
          data
        })
        notify('Tipo de muestra actualizado correctamente', 'success')
      } else {
        await createMutation.mutateAsync(data)
        notify('Tipo de muestra creado correctamente', 'success')
      }
      navigate('/tipos-muestra')
    } catch (error) {
      notify(
        error instanceof Error ? error.message : 'Error al guardar el tipo de muestra',
        'error'
      )
    }
  }

  const isLoading = createMutation.isPending || updateMutation.isPending

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label
          htmlFor="cod_tipo_muestra"
          className="block text-sm font-medium text-foreground-primary mb-2"
        >
          Código de Tipo de Muestra *
        </label>
        <input
          id="cod_tipo_muestra"
          type="text"
          {...register('cod_tipo_muestra')}
          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground-primary focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isLoading}
        />
        {errors.cod_tipo_muestra && (
          <p className="mt-1 text-sm text-estado-error">{errors.cod_tipo_muestra.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="tipo_muestra"
          className="block text-sm font-medium text-foreground-primary mb-2"
        >
          Descripción del Tipo de Muestra
        </label>
        <textarea
          id="tipo_muestra"
          {...register('tipo_muestra')}
          rows={3}
          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground-primary focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
          disabled={isLoading}
          placeholder="Descripción detallada del tipo de muestra (ej: Sangre total, Suero, etc.)"
        />
        {errors.tipo_muestra && (
          <p className="mt-1 text-sm text-estado-error">{errors.tipo_muestra.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-border">
        <button
          type="button"
          onClick={() => navigate('/tipos-muestra')}
          disabled={isLoading}
          className="px-4 py-2 border border-border rounded-md text-foreground-secondary hover:bg-background-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <X size={16} />
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isLoading || !isDirty}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Save size={16} />
          {isLoading ? 'Guardando...' : isEditMode ? 'Actualizar' : 'Crear'}
        </button>
      </div>
    </form>
  )
}
