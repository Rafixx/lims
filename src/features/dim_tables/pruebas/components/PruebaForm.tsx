import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCreatePrueba, useUpdatePrueba } from '@/shared/hooks/useDim_tables'
import { Prueba } from '@/shared/interfaces/dim_tables.types'
import { useNavigate } from 'react-router-dom'
import { Save, X } from 'lucide-react'
import { useNotification } from '@/shared/components/Notification/NotificationContext'

const pruebaSchema = z.object({
  cod_prueba: z.string().min(1, 'El código de prueba es obligatorio'),
  prueba: z.string().optional()
})

type PruebaFormData = z.infer<typeof pruebaSchema>

interface PruebaFormProps {
  initialData?: Prueba
}

export const PruebaForm = ({ initialData }: PruebaFormProps) => {
  const navigate = useNavigate()
  const isEditMode = Boolean(initialData?.id)
  const { notify } = useNotification()

  const createMutation = useCreatePrueba()
  const updateMutation = useUpdatePrueba()

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty }
  } = useForm<PruebaFormData>({
    resolver: zodResolver(pruebaSchema),
    defaultValues: {
      cod_prueba: initialData?.cod_prueba || '',
      prueba: initialData?.prueba || ''
    }
  })

  const onSubmit = async (data: PruebaFormData) => {
    try {
      if (isEditMode && initialData?.id) {
        await updateMutation.mutateAsync({
          id: initialData.id,
          data
        })
        notify('Prueba actualizada correctamente', 'success')
      } else {
        await createMutation.mutateAsync(data)
        notify('Prueba creada correctamente', 'success')
      }
      navigate('/pruebas')
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Error al guardar la prueba', 'error')
    }
  }

  const isLoading = createMutation.isPending || updateMutation.isPending

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label
          htmlFor="cod_prueba"
          className="block text-sm font-medium text-foreground-primary mb-2"
        >
          Código de Prueba *
        </label>
        <input
          id="cod_prueba"
          type="text"
          {...register('cod_prueba')}
          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground-primary focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isLoading}
        />
        {errors.cod_prueba && (
          <p className="mt-1 text-sm text-estado-error">{errors.cod_prueba.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="prueba" className="block text-sm font-medium text-foreground-primary mb-2">
          Descripción de la Prueba
        </label>
        <textarea
          id="prueba"
          {...register('prueba')}
          rows={3}
          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground-primary focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          disabled={isLoading}
        />
        {errors.prueba && <p className="mt-1 text-sm text-estado-error">{errors.prueba.message}</p>}
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-border">
        <button
          type="button"
          onClick={() => navigate('/pruebas')}
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
