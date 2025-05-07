import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { SolicitudAsidePreview } from './SolicitudAsidePreview'
import { DatosGeneralesSection } from './DatosGeneralesSection'
import { CreateSolicitudDTO } from '../../interfaces/solicitud.interface'
import { Tabs } from '@/shared/components/molecules/Tabs'
import { DatosMuestraSection } from './DatosMuestraSection'
import { Button } from '@/shared/components/molecules/Button'
import { SendIcon } from 'lucide-react'

export const SolicitudForm = () => {
  const [asideVisible, setAsideVisible] = useState(false)
  const { control, register, handleSubmit, setValue } = useForm<CreateSolicitudDTO>()
  const [idPruebaSeleccionada, setIdPruebaSeleccionada] = useState<number | undefined>()
  const [idClienteSeleccionado, setIdClienteSeleccionado] = useState<number | undefined>()
  const [idPacienteSeleccionado, setIdPacienteSeleccionado] = useState<number | undefined>()

  const onSubmit = (data: CreateSolicitudDTO) => {
    console.log('Enviado:', data)
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
          />
        </aside>
      )}
    </div>
  )
}
