import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCreatePrueba, useUpdatePrueba } from '@/shared/hooks/useDim_tables'
import { Prueba } from '@/shared/interfaces/dim_tables.types'
import { useNavigate } from 'react-router-dom'
import { Save, X } from 'lucide-react'
import { useNotification } from '@/shared/components/Notification/NotificationContext'
import { usePruebaTecnicasCreate, usePruebaTecnicasEdit } from '../hooks/usePruebaTecnicas'
import { PruebaTecnicasCreate, PruebaTecnicasEdit } from './PruebaTecnicasList'

const pruebaSchema = z.object({
  cod_prueba: z.string().min(1, 'El código de prueba es obligatorio'),
  prueba: z.string().optional()
})

type PruebaFormData = z.infer<typeof pruebaSchema>

interface PruebaFormProps {
  initialData?: Prueba
}

// Sub-componente para técnicas en modo edit, separado para que use el hook con pruebaId real
const TecnicasEditSection = ({ pruebaId }: { pruebaId: number }) => {
  const { notify } = useNotification()
  const { activas, inactivas, isLoading, addTecnica, removeTecnica, reactivateTecnica, reorder } =
    usePruebaTecnicasEdit(pruebaId)

  const handleAdd = async (nombre: string) => {
    await addTecnica(nombre)
    notify('Técnica añadida', 'success')
  }

  const handleRemove = async (id: number) => {
    try {
      await removeTecnica(id)
      notify('Técnica desactivada', 'success')
    } catch {
      notify('Error al desactivar la técnica', 'error')
    }
  }

  const handleReactivate = async (id: number) => {
    try {
      await reactivateTecnica(id)
      notify('Técnica reactivada', 'success')
    } catch {
      notify('Error al reactivar la técnica', 'error')
    }
  }

  const handleReorder = async (newList: typeof activas) => {
    try {
      await reorder(newList)
    } catch {
      notify('Error al reordenar las técnicas', 'error')
    }
  }

  return (
    <PruebaTecnicasEdit
      activas={activas}
      inactivas={inactivas}
      isLoading={isLoading}
      onAdd={handleAdd}
      onRemove={handleRemove}
      onReactivate={handleReactivate}
      onReorder={handleReorder}
    />
  )
}

export const PruebaForm = ({ initialData }: PruebaFormProps) => {
  const navigate = useNavigate()
  const isEditMode = Boolean(initialData?.id)
  const { notify } = useNotification()

  const createMutation = useCreatePrueba()
  const updateMutation = useUpdatePrueba()

  // Hook de técnicas para create (solo se usa en modo crear)
  const tecnicasCreate = usePruebaTecnicasCreate()

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
        const nuevaPrueba = await createMutation.mutateAsync(data)
        if (tecnicasCreate.tecnicas.length > 0) {
          await tecnicasCreate.persistAll(nuevaPrueba.id)
        }
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

      <div className="border-t border-border pt-4">
        {isEditMode && initialData?.id ? (
          <TecnicasEditSection pruebaId={initialData.id} />
        ) : (
          <PruebaTecnicasCreate
            tecnicas={tecnicasCreate.tecnicas}
            onAdd={tecnicasCreate.addTecnica}
            onRemove={tecnicasCreate.removeTecnica}
            onReorder={tecnicasCreate.reorder}
          />
        )}
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
          disabled={isLoading || (!isDirty && !isEditMode)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Save size={16} />
          {isLoading ? 'Guardando...' : isEditMode ? 'Actualizar' : 'Crear'}
        </button>
      </div>
    </form>
  )
}
