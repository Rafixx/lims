import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { formatISO } from 'date-fns'
import {
  CreateSolicitudDTO,
  Solicitud
} from '@/features/solicitudes/interfaces/solicitud.interface'
import { useCreateSolicitud, useUpdateSolicitud } from '@/features/solicitudes/hooks/useSolicitudes'
import { useNotification } from '@/shared/components/Notification/NotificationContext'
import { EntitySelect } from '@/shared/components/molecules/EntitySelect'
import { apiClient } from '@/shared/services/apiClient'

interface Props {
  solicitud?: Solicitud | null
  onClose: () => void
}

export const SolicitudForm = ({ solicitud, onClose }: Props) => {
  const { register, handleSubmit, reset, formState, control } = useForm<CreateSolicitudDTO>({
    defaultValues: {
      num_solicitud: '',
      id_cliente: undefined,
      id_prueba: undefined,
      f_entrada: ''
    }
  })
  const createSolicitud = useCreateSolicitud()
  const updateSolicitud = useUpdateSolicitud()
  const { notify } = useNotification()

  const fetchClientes = () =>
    apiClient.get<{ id: number; nombre: string }[]>('/clientes').then(res => res.data)

  const fetchPruebas = () =>
    apiClient.get<{ id: number; prueba: string }[]>('/pruebas').then(res => res.data)

  useEffect(() => {
    if (solicitud) {
      reset({
        num_solicitud: solicitud.num_solicitud,
        id_cliente: solicitud.cliente?.id,
        id_prueba: solicitud.prueba?.id,
        f_entrada: solicitud.f_entrada ? solicitud.f_entrada.split('T')[0] : ''
      })
    }
  }, [solicitud, reset])

  const onSubmit = async (data: CreateSolicitudDTO) => {
    try {
      const payload = {
        ...data,
        f_entrada: formatISO(new Date(data.f_entrada))
      }

      if (solicitud) {
        await updateSolicitud.mutateAsync({ id: solicitud.id_solicitud, data: payload })
        notify('Solicitud actualizada', 'success')
      } else {
        await createSolicitud.mutateAsync(payload)
        notify('Solicitud creada con éxito', 'success')
      }
      onClose()
    } catch (error) {
      notify('Error al guardar la solicitud', 'error')
      console.error('Error al guardar la solicitud:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="num_solicitud" className="block text-sm font-medium text-gray-700">
          Nº Solicitud
        </label>
        <input
          id="num_solicitud"
          type="text"
          {...register('num_solicitud', { required: true })}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Cliente</label>
        <EntitySelect
          name="id_cliente"
          label="Cliente"
          fetchFn={fetchClientes}
          getValue={item => item.id}
          getLabel={item => item.nombre}
          required
          control={control}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Prueba</label>
        <EntitySelect
          name="id_prueba"
          label="Prueba"
          fetchFn={fetchPruebas}
          getValue={item => item.id}
          getLabel={item => item.prueba}
          required
          control={control}
        />
      </div>

      <div>
        <label htmlFor="f_entrada" className="block text-sm font-medium text-gray-700">
          Fecha de entrada
        </label>
        <input
          id="f_entrada"
          type="date"
          {...register('f_entrada', { required: true })}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="flex justify-end gap-2">
        <button type="button" onClick={onClose} className="text-sm text-gray-500 hover:underline">
          Cancelar
        </button>
        <button
          type="submit"
          disabled={formState.isSubmitting}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Guardar
        </button>
      </div>
    </form>
  )
}
