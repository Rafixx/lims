import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCreatePipeta, useUpdatePipeta } from '@/shared/hooks/useDim_tables'
import { Pipeta } from '@/shared/interfaces/dim_tables.types'
import { useNavigate } from 'react-router-dom'
import { Save, X } from 'lucide-react'
import { useNotification } from '@/shared/components/Notification/NotificationContext'

const pipetaSchema = z.object({
  codigo: z.string().min(1, 'El código es obligatorio'),
  modelo: z.string().optional(),
  zona: z.string().optional()
})

type PipetaFormData = z.infer<typeof pipetaSchema>

interface PipetaFormProps {
  initialData?: Pipeta
}

export const PipetaForm = ({ initialData }: PipetaFormProps) => {
  const navigate = useNavigate()
  const isEditMode = Boolean(initialData?.id)
  const { notify } = useNotification()

  const createMutation = useCreatePipeta()
  const updateMutation = useUpdatePipeta()

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty }
  } = useForm<PipetaFormData>({
    resolver: zodResolver(pipetaSchema),
    defaultValues: {
      codigo: initialData?.codigo || '',
      modelo: initialData?.modelo || '',
      zona: initialData?.zona || ''
    }
  })

  const onSubmit = async (data: PipetaFormData) => {
    try {
      if (isEditMode && initialData?.id) {
        await updateMutation.mutateAsync({
          id: initialData.id,
          data
        })
        notify('Pipeta actualizada correctamente', 'success')
      } else {
        await createMutation.mutateAsync(data)
        notify('Pipeta creada correctamente', 'success')
      }
      navigate('/pipetas')
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Error al guardar la pipeta', 'error')
    }
  }

  const isLoading = createMutation.isPending || updateMutation.isPending

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="codigo" className="block text-sm font-medium text-foreground-primary mb-2">
          Código *
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
        <label htmlFor="modelo" className="block text-sm font-medium text-foreground-primary mb-2">
          Modelo
        </label>
        <input
          id="modelo"
          type="text"
          {...register('modelo')}
          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground-primary focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isLoading}
        />
        {errors.modelo && <p className="mt-1 text-sm text-estado-error">{errors.modelo.message}</p>}
      </div>

      <div>
        <label htmlFor="zona" className="block text-sm font-medium text-foreground-primary mb-2">
          Zona
        </label>
        <input
          id="zona"
          type="text"
          {...register('zona')}
          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground-primary focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isLoading}
        />
        {errors.zona && <p className="mt-1 text-sm text-estado-error">{errors.zona.message}</p>}
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-border">
        <button
          type="button"
          onClick={() => navigate('/pipetas')}
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
