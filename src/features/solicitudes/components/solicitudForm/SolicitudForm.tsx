import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useNotification } from '@/shared/components/Notification/NotificationContext'
import { useUser } from '@/shared/contexts/UserContext'
import { useCreateSolicitud } from '../../hooks/useSolicitudes'
import { SolicitudAsidePreview } from './SolicitudAsidePreview'
import { DatosGeneralesSection } from './DatosGeneralesSection'
import {
  CreateSolicitudDTO,
  Solicitud,
  Tecnica,
  Tecnica_proc
} from '../../interfaces/solicitud.interface'
import { Tabs } from '@/shared/components/molecules/Tabs'
import { DatosMuestraSection } from './DatosMuestraSection'
import { Button } from '@/shared/components/molecules/Button'
import { SendIcon } from 'lucide-react'

interface SolicitudFormProps {
  solicitud?: Solicitud | null
  onClose: () => void
}

export const SolicitudForm = ({ solicitud, onClose }: SolicitudFormProps) => {
  const queryClient = useQueryClient()
  const { user } = useUser()
  const createSolicitud = useCreateSolicitud()

  const [asideVisible, setAsideVisible] = useState(false)
  const { control, register, handleSubmit, setValue, reset } = useForm<CreateSolicitudDTO>()
  const [idPruebaSeleccionada, setIdPruebaSeleccionada] = useState<number | undefined>()
  const [idClienteSeleccionado, setIdClienteSeleccionado] = useState<number | undefined>()
  const [idPacienteSeleccionado, setIdPacienteSeleccionado] = useState<number | undefined>()
  const { notify } = useNotification()

  useEffect(() => {
    if (solicitud) {
      reset({
        num_solicitud: solicitud.num_solicitud,
        id_paciente: solicitud.id_paciente,
        id_cliente: solicitud.id_cliente,
        id_prueba: solicitud.id_prueba,
        id_tipo_muestra: solicitud.id_tipo_muestra,
        condiciones_envio: solicitud.condiciones_envio,
        tiempo_hielo: solicitud.tiempo_hielo,
        id_ubicacion: solicitud.id_ubicacion,
        id_centro_externo: solicitud.id_centro_externo,
        id_criterio_val: solicitud.id_criterio_val,
        f_entrada: solicitud.f_entrada,
        f_compromiso: solicitud.f_compromiso,
        f_entrega: solicitud.f_entrega,
        f_resultado: solicitud.f_resultado,
        f_toma: solicitud.f_toma,
        f_recepcion: solicitud.f_recepcion,
        f_destruccion: solicitud.f_destruccion,
        f_devolucion: solicitud.f_devolucion
      })
      setIdPruebaSeleccionada(solicitud.id_prueba)
      setIdClienteSeleccionado(solicitud.id_cliente)
      setIdPacienteSeleccionado(solicitud.id_paciente)
    }
  }, [solicitud, reset])

  const onSubmit = async (data: CreateSolicitudDTO) => {
    const currentTecnicas =
      queryClient.getQueryData<Tecnica[]>(['tecnicasPorPrueba', idPruebaSeleccionada]) ?? []

    const payload: CreateSolicitudDTO = {
      ...data,
      tecnicas: currentTecnicas,
      created_by: user?.id
    }

    try {
      await createSolicitud.mutateAsync(payload)
      notify('Solicitud creada con éxito', 'success')
      onClose()
    } catch (error) {
      notify('Error al crear la solicitud', 'error')
      console.error(error)
    }
  }

  useEffect(() => {
    if (idClienteSeleccionado || idPruebaSeleccionada || idPacienteSeleccionado) {
      setAsideVisible(true)
    } else {
      setAsideVisible(false)
    }
  }, [idClienteSeleccionado, idPruebaSeleccionada, idPacienteSeleccionado])

  return (
    <div className="relative flex w-full transition-all duration-300 ease-in-out">
      <div
        className={`transition-all duration-300 ease-in-out w-full ${asideVisible ? 'md:w-2/3' : ''}`}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-4xl">
          <Tabs
            tabs={[
              {
                id: 'general',
                label: 'Datos generales',
                content: (
                  <DatosGeneralesSection
                    register={register}
                    control={control}
                    onClienteChange={id => setIdClienteSeleccionado(id)}
                    onPruebaChange={id => setIdPruebaSeleccionada(id)}
                    onPacienteChange={id => setIdPacienteSeleccionado(id)}
                  />
                )
              },
              {
                id: 'muestra',
                label: 'Datos muestra',
                content: <DatosMuestraSection register={register} />
              }
            ]}
          />
          <div className="flex justify-between items-center">
            <Button type="submit">
              <SendIcon />
            </Button>
          </div>
        </form>
      </div>

      {/* Aside */}
      {asideVisible && (
        <aside className="hidden md:block md:w-1/3 pr-4">
          <SolicitudAsidePreview
            id_cliente={idClienteSeleccionado}
            id_prueba={idPruebaSeleccionada}
            id_paciente={idPacienteSeleccionado}
            id_solicitud={solicitud?.id_solicitud}
          />
        </aside>
      )}
    </div>
  )
}
