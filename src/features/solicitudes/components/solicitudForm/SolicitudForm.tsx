import { useForm, FormProvider } from 'react-hook-form'
import { useEffect } from 'react'
import { useNotification } from '@/shared/components/Notification/NotificationContext'
import { useUser } from '@/shared/contexts/UserContext'
import { useCreateSolicitud } from '../../hooks/useSolicitudes'
import { SolicitudAsidePreview } from './SolicitudAsidePreview'
import { DatosGeneralesSection } from './DatosGeneralesSection'
import { CreateSolicitudDTO } from '../../interfaces/solicitud.interface'
import { Tabs } from '@/shared/components/molecules/Tabs'
import { DatosMuestraSection } from './DatosMuestraSection'
import { Button } from '@/shared/components/molecules/Button'
import { SendIcon } from 'lucide-react'
import { useTecnicas } from '../../hooks/useTecnicas'
import { EMPTY_FORM_VALUES } from '../../constants'

interface Props {
  initialValues?: Partial<FormValues>
  onClose: () => void
}

export interface FormValues {
  num_solicitud: string
  id_paciente: number
  id_cliente: number
  id_prueba: number
  id_tipo_muestra: number
  condiciones_envio: string
  tiempo_hielo: string
  id_ubicacion: number
  id_centro_externo: number
  id_criterio_val: number
  f_entrada: string
  f_compromiso: string
  f_entrega: string
  f_resultado: string
  f_toma: string
  f_recepcion: string
  f_destruccion: string
  f_devolucion: string
}

export const SolicitudForm = ({ initialValues, onClose }: Props) => {
  const methods = useForm<FormValues>({
    defaultValues: initialValues || EMPTY_FORM_VALUES
  })

  const { user } = useUser()
  const createSolicitud = useCreateSolicitud()

  const { notify } = useNotification()

  const clienteId = methods.watch('id_cliente')
  const pruebaId = methods.watch('id_prueba')
  const pacienteId = methods.watch('id_paciente')
  const asideVisible = Boolean(clienteId || pruebaId || pacienteId)

  useEffect(() => {
    if (initialValues) {
      methods.reset(initialValues)
    }
  }, [initialValues, methods])

  const { tecnicas: currentTecnicas = [] } = useTecnicas(pruebaId)

  // const handlePruebaChange = (id: number) => {
  //   setIdPruebaSeleccionada(id)
  //   setIdSolicitudFiltrarTecnicas(undefined)
  // }

  const onSubmit = async (data: CreateSolicitudDTO) => {
    // const currentTecnicas =
    //   queryClient.getQueryData<Tecnica[]>(['tecnicasPorPrueba', idPruebaSeleccionada]) ?? []
    const tecnicasIds = currentTecnicas.map(t => ({ id: t.id }))

    const payload: CreateSolicitudDTO = {
      ...data,
      tecnicas: tecnicasIds,
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

  return (
    <div className="relative flex w-full transition-all duration-300 ease-in-out">
      <div
        className={`transition-all duration-300 ease-in-out w-full ${asideVisible ? 'md:w-2/3' : ''}`}
      >
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4 max-w-4xl">
            <Tabs
              tabs={[
                {
                  id: 'general',
                  label: 'Datos generales',
                  content: <DatosGeneralesSection />
                },
                {
                  id: 'muestra',
                  label: 'Datos muestra',
                  content: <DatosMuestraSection />
                }
              ]}
            />
            <div className="flex justify-between items-center">
              <Button type="submit">
                <SendIcon />
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>

      {/* Aside */}
      {asideVisible && (
        <aside className="hidden md:block md:w-1/3 pr-4">
          <SolicitudAsidePreview
            id_cliente={clienteId}
            id_prueba={pruebaId}
            id_paciente={pacienteId}
            // id_solicitud={idSolicitudFiltrarTecnicas}
          />
        </aside>
      )}
    </div>
  )
}
