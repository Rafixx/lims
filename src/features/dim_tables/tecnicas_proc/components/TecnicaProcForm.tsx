import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCreateTecnicaProc, useUpdateTecnicaProc, usePlantillasTecnicas } from '@/shared/hooks/useDim_tables'
import { TecnicaProc } from '@/shared/interfaces/dim_tables.types'
import { useNavigate } from 'react-router-dom'
import { Save, X } from 'lucide-react'
import { useNotification } from '@/shared/components/Notification/NotificationContext'

const tecnicaProcSchema = z.object({
  tecnica_proc: z.string().min(1, 'El nombre de la técnica es obligatorio'),
  orden: z.number().optional(),
  id_plantilla_tecnica: z.number().nullable().optional()
})

type TecnicaProcFormData = z.infer<typeof tecnicaProcSchema>

interface TecnicaProcFormProps {
  initialData?: TecnicaProc
}

export const TecnicaProcForm = ({ initialData }: TecnicaProcFormProps) => {
  const navigate = useNavigate()
  const isEditMode = Boolean(initialData?.id)
  const { notify } = useNotification()

  const createMutation = useCreateTecnicaProc()
  const updateMutation = useUpdateTecnicaProc()
  const { data: plantillas = [] } = usePlantillasTecnicas()

  const plantillasOrdenadas = [...plantillas].sort((a, b) =>
    (a.tecnica ?? '').localeCompare(b.tecnica ?? '')
  )

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty }
  } = useForm<TecnicaProcFormData>({
    resolver: zodResolver(tecnicaProcSchema),
    defaultValues: {
      tecnica_proc: initialData?.tecnica_proc || '',
      orden: initialData?.orden || undefined,
      id_plantilla_tecnica:
        initialData?.id_plantilla_tecnica ?? initialData?.plantillaTecnica?.id ?? null
    }
  })

  const onSubmit = async (data: TecnicaProcFormData) => {
    const payload = {
      ...data,
      id_plantilla_tecnica: data.id_plantilla_tecnica ?? null
    }
    try {
      if (isEditMode && initialData?.id) {
        await updateMutation.mutateAsync({ id: initialData.id, data: payload })
        notify('Técnica actualizada correctamente', 'success')
      } else {
        await createMutation.mutateAsync(payload)
        notify('Técnica creada correctamente', 'success')
      }
      navigate('/tecnicas-proc')
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Error al guardar la técnica', 'error')
    }
  }

  const isLoading = createMutation.isPending || updateMutation.isPending

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label
          htmlFor="tecnica_proc"
          className="block text-sm font-medium text-foreground-primary mb-2"
        >
          Nombre de la Técnica *
        </label>
        <input
          id="tecnica_proc"
          type="text"
          {...register('tecnica_proc')}
          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground-primary focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isLoading}
        />
        {errors.tecnica_proc && (
          <p className="mt-1 text-sm text-estado-error">{errors.tecnica_proc.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="orden" className="block text-sm font-medium text-foreground-primary mb-2">
          Orden
        </label>
        <input
          id="orden"
          type="number"
          {...register('orden', { valueAsNumber: true })}
          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground-primary focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isLoading}
        />
        {errors.orden && <p className="mt-1 text-sm text-estado-error">{errors.orden.message}</p>}
      </div>

      <div>
        <label
          htmlFor="id_plantilla_tecnica"
          className="block text-sm font-medium text-foreground-primary mb-2"
        >
          Plantilla técnica
        </label>
        <select
          id="id_plantilla_tecnica"
          {...register('id_plantilla_tecnica', { setValueAs: v => (v === '' ? null : Number(v)) })}
          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground-primary focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isLoading}
        >
          <option value="">Sin plantilla</option>
          {plantillasOrdenadas.map(p => (
            <option key={p.id} value={p.id}>
              {p.tecnica} ({p.cod_plantilla_tecnica})
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-border">
        <button
          type="button"
          onClick={() => navigate('/tecnicas-proc')}
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
