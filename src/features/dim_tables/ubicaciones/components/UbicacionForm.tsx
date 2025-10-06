import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Save, X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { useCreateUbicacion, useUpdateUbicacion } from '@/shared/hooks/useDim_tables'
import { Ubicacion } from '@/shared/interfaces/dim_tables.types'
import { useNotification } from '@/shared/components/Notification/NotificationContext'

const ubicacionSchema = z.object({
  codigo: z.string().min(1, 'El código de ubicación es obligatorio'),
  ubicacion: z.string().optional()
})

type UbicacionFormData = z.infer<typeof ubicacionSchema>

interface UbicacionFormProps {
  initialData?: Ubicacion
  isEditMode?: boolean
}

export const UbicacionForm = ({ initialData, isEditMode = false }: UbicacionFormProps) => {
  const navigate = useNavigate()
  const { notify } = useNotification()
  const createMutation = useCreateUbicacion()
  const updateMutation = useUpdateUbicacion()

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty }
  } = useForm<UbicacionFormData>({
    resolver: zodResolver(ubicacionSchema),
    defaultValues: {
      codigo: initialData?.codigo || '',
      ubicacion: initialData?.ubicacion || ''
    }
  })

  const onSubmit = async (data: UbicacionFormData) => {
    try {
      if (isEditMode && initialData?.id) {
        await updateMutation.mutateAsync({
          id: initialData.id,
          data
        })
        notify('Ubicación actualizada correctamente', 'success')
      } else {
        await createMutation.mutateAsync(data)
        notify('Ubicación creada correctamente', 'success')
      }
      navigate('/ubicaciones')
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Error al guardar la ubicación', 'error')
    }
  }

  const isLoading = createMutation.isPending || updateMutation.isPending

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/ubicaciones"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background text-foreground-secondary transition-colors hover:bg-background-secondary hover:text-foreground-primary"
            title="Volver a ubicaciones"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold text-foreground-primary">
            {isEditMode ? 'Editar Ubicación' : 'Nueva Ubicación'}
          </h1>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="rounded-lg border border-border bg-background p-6">
          <div className="space-y-4">
            {/* Código */}
            <div>
              <label
                htmlFor="codigo"
                className="mb-2 block text-sm font-medium text-foreground-primary"
              >
                Código de Ubicación <span className="text-red-500">*</span>
              </label>
              <input
                {...register('codigo')}
                type="text"
                id="codigo"
                placeholder="Ej: NEVERA-01, ARMARIO-A, SALA-PCR"
                className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground-primary placeholder:text-foreground-tertiary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              {errors.codigo && (
                <p className="mt-1 text-sm text-red-500">{errors.codigo.message}</p>
              )}
            </div>

            {/* Ubicación (Descripción) */}
            <div>
              <label
                htmlFor="ubicacion"
                className="mb-2 block text-sm font-medium text-foreground-primary"
              >
                Descripción de la Ubicación
              </label>
              <textarea
                {...register('ubicacion')}
                id="ubicacion"
                rows={3}
                placeholder="Descripción detallada de la ubicación (ej: Nevera principal laboratorio, Armario reactivos sala A, etc.)"
                className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground-primary placeholder:text-foreground-tertiary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              {errors.ubicacion && (
                <p className="mt-1 text-sm text-red-500">{errors.ubicacion.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <button
            type="button"
            onClick={() => navigate('/ubicaciones')}
            disabled={isLoading}
            className="px-4 py-2 border border-border rounded-md text-foreground-secondary hover:bg-background-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <X size={16} />
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading || (isEditMode && !isDirty)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Save size={16} />
            {isLoading ? 'Guardando...' : isEditMode ? 'Actualizar' : 'Crear'}
          </button>
        </div>
      </form>
    </div>
  )
}
