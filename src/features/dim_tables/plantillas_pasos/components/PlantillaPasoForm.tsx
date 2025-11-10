import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCreatePlantillaPaso, useUpdatePlantillaPaso } from '@/shared/hooks/useDim_tables'
import { PlantillaPasos } from '@/shared/interfaces/dim_tables.types'
import { useNavigate } from 'react-router-dom'
import { Save, X } from 'lucide-react'
import { useNotification } from '@/shared/components/Notification/NotificationContext'

const plantillaPasoSchema = z.object({
  codigo: z.string().optional(),
  descripcion: z.string().optional(),
  orden: z.coerce.number().optional()
})

type PlantillaPasoFormData = z.infer<typeof plantillaPasoSchema>

interface PlantillaPasoFormProps {
  initialData?: PlantillaPasos
}

export const PlantillaPasoForm = ({ initialData }: PlantillaPasoFormProps) => {
  const navigate = useNavigate()
  const isEditMode = Boolean(initialData?.id)
  const { notify } = useNotification()

  const createMutation = useCreatePlantillaPaso()
  const updateMutation = useUpdatePlantillaPaso()

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty }
  } = useForm<PlantillaPasoFormData>({
    resolver: zodResolver(plantillaPasoSchema),
    defaultValues: {
      codigo: initialData?.codigo || '',
      descripcion: initialData?.descripcion || '',
      orden: initialData?.orden || 0
    }
  })

  const onSubmit = async (data: PlantillaPasoFormData) => {
    try {
      if (isEditMode && initialData?.id) {
        await updateMutation.mutateAsync({
          id: initialData.id,
          data
        })
        notify('Paso de plantilla actualizado correctamente', 'success')
      } else {
        await createMutation.mutateAsync(data)
        notify('Paso de plantilla creado correctamente', 'success')
      }
      navigate('/plantillas-pasos')
    } catch (error) {
      notify(
        error instanceof Error ? error.message : 'Error al guardar el paso de plantilla',
        'error'
      )
    }
  }

  const isLoading = createMutation.isPending || updateMutation.isPending

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="codigo" className="block text-sm font-medium text-foreground-primary mb-2">
          Código
        </label>
        <input
          id="codigo"
          type="text"
          {...register('codigo')}
          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground-primary focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isLoading}
        />
        {errors.codigo && <p className="mt-1 text-sm text-estado-error">{errors.codigo.message}</p>}
      </div>

      <div>
        <label
          htmlFor="descripcion"
          className="block text-sm font-medium text-foreground-primary mb-2"
        >
          Descripción
        </label>
        <textarea
          id="descripcion"
          rows={4}
          {...register('descripcion')}
          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground-primary focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
          disabled={isLoading}
        />
        {errors.descripcion && (
          <p className="mt-1 text-sm text-estado-error">{errors.descripcion.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="orden" className="block text-sm font-medium text-foreground-primary mb-2">
          Orden
        </label>
        <input
          id="orden"
          type="number"
          {...register('orden')}
          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground-primary focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isLoading}
        />
        {errors.orden && <p className="mt-1 text-sm text-estado-error">{errors.orden.message}</p>}
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-border">
        <button
          type="button"
          onClick={() => navigate('/plantillas-pasos')}
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
