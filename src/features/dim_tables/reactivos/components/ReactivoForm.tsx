import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCreateReactivo, useUpdateReactivo } from '@/shared/hooks/useDim_tables'
import { Reactivo } from '@/shared/interfaces/dim_tables.types'
import { useNavigate } from 'react-router-dom'
import { Save, X } from 'lucide-react'
import { useNotification } from '@/shared/components/Notification/NotificationContext'

const reactivoSchema = z.object({
  num_referencia: z.string().optional(),
  reactivo: z.string().optional(),
  lote: z.string().optional(),
  volumen_formula: z.string().optional()
})

type ReactivoFormData = z.infer<typeof reactivoSchema>

interface ReactivoFormProps {
  initialData?: Reactivo
}

export const ReactivoForm = ({ initialData }: ReactivoFormProps) => {
  const navigate = useNavigate()
  const isEditMode = Boolean(initialData?.id)
  const { notify } = useNotification()

  const createMutation = useCreateReactivo()
  const updateMutation = useUpdateReactivo()

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty }
  } = useForm<ReactivoFormData>({
    resolver: zodResolver(reactivoSchema),
    defaultValues: {
      num_referencia: initialData?.num_referencia || '',
      reactivo: initialData?.reactivo || '',
      lote: initialData?.lote || '',
      volumen_formula: initialData?.volumen_formula || ''
    }
  })

  const onSubmit = async (data: ReactivoFormData) => {
    try {
      if (isEditMode && initialData?.id) {
        await updateMutation.mutateAsync({
          id: initialData.id,
          data
        })
        notify('Reactivo actualizado correctamente', 'success')
      } else {
        await createMutation.mutateAsync(data)
        notify('Reactivo creado correctamente', 'success')
      }
      navigate('/reactivos')
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Error al guardar el reactivo', 'error')
    }
  }

  const isLoading = createMutation.isPending || updateMutation.isPending

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label
          htmlFor="num_referencia"
          className="block text-sm font-medium text-foreground-primary mb-2"
        >
          Número de Referencia
        </label>
        <input
          id="num_referencia"
          type="text"
          {...register('num_referencia')}
          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground-primary focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isLoading}
        />
        {errors.num_referencia && (
          <p className="mt-1 text-sm text-estado-error">{errors.num_referencia.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="reactivo"
          className="block text-sm font-medium text-foreground-primary mb-2"
        >
          Reactivo
        </label>
        <input
          id="reactivo"
          type="text"
          {...register('reactivo')}
          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground-primary focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isLoading}
        />
        {errors.reactivo && (
          <p className="mt-1 text-sm text-estado-error">{errors.reactivo.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="lote" className="block text-sm font-medium text-foreground-primary mb-2">
          Lote
        </label>
        <input
          id="lote"
          type="text"
          {...register('lote')}
          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground-primary focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isLoading}
        />
        {errors.lote && <p className="mt-1 text-sm text-estado-error">{errors.lote.message}</p>}
      </div>

      <div>
        <label
          htmlFor="volumen_formula"
          className="block text-sm font-medium text-foreground-primary mb-2"
        >
          Volumen/Fórmula
        </label>
        <input
          id="volumen_formula"
          type="text"
          {...register('volumen_formula')}
          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground-primary focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isLoading}
          placeholder="Ej: 500ml, 1L"
        />
        {errors.volumen_formula && (
          <p className="mt-1 text-sm text-estado-error">{errors.volumen_formula.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-border">
        <button
          type="button"
          onClick={() => navigate('/reactivos')}
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
