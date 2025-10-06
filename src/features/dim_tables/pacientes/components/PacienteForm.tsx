import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCreatePaciente, useUpdatePaciente } from '@/shared/hooks/useDim_tables'
import { Paciente } from '@/shared/interfaces/dim_tables.types'
import { useNavigate } from 'react-router-dom'
import { Save, X } from 'lucide-react'
import { useNotification } from '@/shared/components/Notification/NotificationContext'

const pacienteSchema = z.object({
  nombre: z.string().min(1, 'El nombre es obligatorio'),
  sip: z.string().optional(),
  direccion: z.string().optional()
})

type PacienteFormData = z.infer<typeof pacienteSchema>

interface PacienteFormProps {
  initialData?: Paciente
}

export const PacienteForm = ({ initialData }: PacienteFormProps) => {
  const navigate = useNavigate()
  const isEditMode = Boolean(initialData?.id)
  const { notify } = useNotification()

  const createMutation = useCreatePaciente()
  const updateMutation = useUpdatePaciente()

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty }
  } = useForm<PacienteFormData>({
    resolver: zodResolver(pacienteSchema),
    defaultValues: {
      nombre: initialData?.nombre || '',
      sip: initialData?.sip || '',
      direccion: initialData?.direccion || ''
    }
  })

  const onSubmit = async (data: PacienteFormData) => {
    try {
      if (isEditMode && initialData?.id) {
        await updateMutation.mutateAsync({
          id: initialData.id,
          data
        })
        notify('Paciente actualizado correctamente', 'success')
      } else {
        await createMutation.mutateAsync(data)
        notify('Paciente creado correctamente', 'success')
      }
      navigate('/pacientes')
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Error al guardar el paciente', 'error')
    }
  }

  const isLoading = createMutation.isPending || updateMutation.isPending

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="nombre" className="block text-sm font-medium text-foreground-primary mb-2">
          Nombre *
        </label>
        <input
          id="nombre"
          type="text"
          {...register('nombre')}
          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground-primary focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isLoading}
        />
        {errors.nombre && <p className="mt-1 text-sm text-estado-error">{errors.nombre.message}</p>}
      </div>

      <div>
        <label htmlFor="sip" className="block text-sm font-medium text-foreground-primary mb-2">
          SIP
        </label>
        <input
          id="sip"
          type="text"
          {...register('sip')}
          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground-primary focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isLoading}
        />
        {errors.sip && <p className="mt-1 text-sm text-estado-error">{errors.sip.message}</p>}
      </div>

      <div>
        <label
          htmlFor="direccion"
          className="block text-sm font-medium text-foreground-primary mb-2"
        >
          Dirección
        </label>
        <textarea
          id="direccion"
          {...register('direccion')}
          rows={3}
          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground-primary focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          disabled={isLoading}
        />
        {errors.direccion && (
          <p className="mt-1 text-sm text-estado-error">{errors.direccion.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-border">
        <button
          type="button"
          onClick={() => navigate('/pacientes')}
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
