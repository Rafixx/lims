import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCreateMaquina, useUpdateMaquina } from '@/shared/hooks/useDim_tables'
import { Maquina } from '@/shared/interfaces/dim_tables.types'
import { useNavigate } from 'react-router-dom'
import { Save, X } from 'lucide-react'
import { useNotification } from '@/shared/components/Notification/NotificationContext'

const maquinaSchema = z.object({
  codigo: z.string().min(1, 'El código es obligatorio'),
  maquina: z.string().optional(),
  perfil_termico: z.string().optional()
})

type MaquinaFormData = z.infer<typeof maquinaSchema>

interface MaquinaFormProps {
  initialData?: Maquina
}

export const MaquinaForm = ({ initialData }: MaquinaFormProps) => {
  const navigate = useNavigate()
  const isEditMode = Boolean(initialData?.id)
  const { notify } = useNotification()

  const createMutation = useCreateMaquina()
  const updateMutation = useUpdateMaquina()

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty }
  } = useForm<MaquinaFormData>({
    resolver: zodResolver(maquinaSchema),
    defaultValues: {
      codigo: initialData?.codigo || '',
      maquina: initialData?.maquina || '',
      perfil_termico: initialData?.perfil_termico || ''
    }
  })

  const onSubmit = async (data: MaquinaFormData) => {
    try {
      if (isEditMode && initialData?.id) {
        await updateMutation.mutateAsync({
          id: initialData.id,
          data
        })
        notify('Máquina actualizada correctamente', 'success')
      } else {
        await createMutation.mutateAsync(data)
        notify('Máquina creada correctamente', 'success')
      }
      navigate('/maquinas')
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Error al guardar la máquina', 'error')
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
        <label htmlFor="maquina" className="block text-sm font-medium text-foreground-primary mb-2">
          Máquina
        </label>
        <input
          id="maquina"
          type="text"
          {...register('maquina')}
          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground-primary focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isLoading}
        />
        {errors.maquina && (
          <p className="mt-1 text-sm text-estado-error">{errors.maquina.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="perfil_termico"
          className="block text-sm font-medium text-foreground-primary mb-2"
        >
          Perfil Térmico
        </label>
        <textarea
          id="perfil_termico"
          {...register('perfil_termico')}
          rows={3}
          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground-primary focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          disabled={isLoading}
        />
        {errors.perfil_termico && (
          <p className="mt-1 text-sm text-estado-error">{errors.perfil_termico.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-border">
        <button
          type="button"
          onClick={() => navigate('/maquinas')}
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
