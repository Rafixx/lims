import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCreateCentro, useUpdateCentro } from '@/shared/hooks/useDim_tables'
import { Centro } from '@/shared/interfaces/dim_tables.types'
import { useNavigate } from 'react-router-dom'
import { Save, X } from 'lucide-react'
import { useNotification } from '@/shared/components/Notification/NotificationContext'

const centroSchema = z.object({
  codigo: z.string().min(1, 'El código es obligatorio'),
  descripcion: z.string().optional()
})

type CentroFormData = z.infer<typeof centroSchema>

interface CentroFormProps {
  initialData?: Centro
}

export const CentroForm = ({ initialData }: CentroFormProps) => {
  const navigate = useNavigate()
  const isEditMode = Boolean(initialData?.id)
  const { notify } = useNotification()

  const createMutation = useCreateCentro()
  const updateMutation = useUpdateCentro()

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty }
  } = useForm<CentroFormData>({
    resolver: zodResolver(centroSchema),
    defaultValues: {
      codigo: initialData?.codigo || '',
      descripcion: initialData?.descripcion || ''
    }
  })

  const onSubmit = async (data: CentroFormData) => {
    try {
      if (isEditMode && initialData?.id) {
        await updateMutation.mutateAsync({
          id: initialData.id,
          data
        })
        notify('Centro actualizado correctamente', 'success')
      } else {
        await createMutation.mutateAsync(data)
        notify('Centro creado correctamente', 'success')
      }
      navigate('/centros')
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Error al guardar el centro', 'error')
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
        <label
          htmlFor="descripcion"
          className="block text-sm font-medium text-foreground-primary mb-2"
        >
          Descripción
        </label>
        <textarea
          id="descripcion"
          {...register('descripcion')}
          rows={3}
          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground-primary focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          disabled={isLoading}
        />
        {errors.descripcion && (
          <p className="mt-1 text-sm text-estado-error">{errors.descripcion.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-border">
        <button
          type="button"
          onClick={() => navigate('/centros')}
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
