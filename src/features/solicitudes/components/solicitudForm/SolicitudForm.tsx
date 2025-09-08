import { useForm, FormProvider, SubmitHandler, useFieldArray } from 'react-hook-form'
import { useCallback, useEffect, useState } from 'react'
import { useNotification } from '@/shared/components/Notification/NotificationContext'
import { useCreateSolicitud } from '../../hooks/useSolicitudes'
import { SolicitudAsidePreview } from './SolicitudAsidePreview'
import { DatosGeneralesSection } from './DatosGeneralesSection'
import { Tabs } from '@/shared/components/molecules/Tabs'
import { DatosMuestraSection } from './DatosMuestraSection'
import { Button } from '@/shared/components/molecules/Button'
import { Plus, SendIcon } from 'lucide-react'

import { defaultMuestra, EMPTY_FORM_VALUES } from '../../interfaces/form.defaults'
import { SolicitudFormValues } from '../../interfaces/form.types'
import { mapFormValuesToDTO } from '../../interfaces/solicitud.mapper'
import { normalizeDates } from '@/shared/utils/helpers'

interface Props {
  initialValues?: Partial<SolicitudFormValues>
  onClose: () => void
}

export const muestraStyle = 'border-2 border-l-accent'

export const SolicitudForm = ({ initialValues, onClose }: Props) => {
  const methods = useForm<SolicitudFormValues>({
    defaultValues: initialValues || EMPTY_FORM_VALUES
  })

  const { control, watch, handleSubmit, setValue } = methods
  const { fields, append } = useFieldArray({
    control,
    name: 'muestra'
  })

  const { mutateAsync: createSolicitud } = useCreateSolicitud()
  const { notify } = useNotification()

  const [currentIndex, setCurrentIndex] = useState(0)

  const clienteId = watch('id_cliente')
  const pruebaId = watch(`muestra.${currentIndex}.id_prueba`)
  const pacienteId = watch(`muestra.${currentIndex}.id_paciente`)
  const asideVisible = Boolean(clienteId || pruebaId || pacienteId)
  const muestra = watch(`muestra.${currentIndex}`)

  //TODO: revisar implementación al editar muestra y cambiar técnicas. No recarga la lista de técnicas
  // const { tecnicas: currentTecnicas = [] } = useTecnicas(pruebaId)
  const handleTecnicasChange = useCallback(
    (tecnicas: { id_tecnica_proc: number }[]) => {
      setValue(`muestra.${currentIndex}.tecnicas`, tecnicas, {
        shouldValidate: false,
        shouldDirty: true
      })
    },
    [currentIndex, setValue]
  )

  useEffect(() => {
    if (initialValues) {
      const normalized = normalizeDates(initialValues)
      const normalizedMuestra = normalized.muestra?.map(muestra => normalizeDates(muestra)) || []

      const patchedInitial = {
        ...normalized,
        muestra: normalizedMuestra.length > 0 ? normalizedMuestra : [defaultMuestra]
      }

      methods.reset(patchedInitial)
      setCurrentIndex(0)
    }
  }, [initialValues, methods])

  const handleSubmitForm: SubmitHandler<SolicitudFormValues> = async formValues => {
    try {
      const isEditing = !!formValues.id_solicitud

      if (isEditing) {
        // Para edición, usaríamos el hook de actualización
        // Por ahora solo creamos nuevas solicitudes
        console.log('Edición de solicitud no implementada aún')
        notify('Función de edición pendiente de implementar', 'warning')
      } else {
        // Convertir formulario a DTO usando el mapper
        const dtoPayload = mapFormValuesToDTO(formValues, {
          updatedBy: 1 // Por ahora hardcodeado
        })

        await createSolicitud(dtoPayload)
        notify('Solicitud creada con éxito', 'success')
      }

      onClose()
    } catch (error) {
      notify('Error al guardar la solicitud', 'error')
      console.error(error)
    }
  }

  const handleAddMuestra = () => {
    append(defaultMuestra)
    setCurrentIndex(fields.length) // Navega a la nueva muestra
  }
  //TODO: implementar la eliminación de muestras
  // const handleRemoveMuestra = (index: number) => {
  //   if (fields.length > 1) {
  //     remove(index)
  //     setCurrentIndex(prev => (prev === index ? 0 : prev > index ? prev - 1 : prev))
  //   } else {
  //     notify('No se puede eliminar la última muestra', 'error')
  //   }
  // }

  return (
    <div className="relative flex w-full transition-all duration-300 ease-in-out">
      <div className="mt-10 gap-4 flex flex-col w-24">
        {fields.map((_, index) => (
          <Button
            type="button"
            key={index}
            className={`border-r-2 border-accent w-12 p-3 mr-3 text-xs hover:cursor-pointer ${currentIndex === index ? 'bg-accent text-white font-bold' : 'hover:bg-accent hover:text-white'}`}
            onClick={() => setCurrentIndex(index)}
          >
            M-{index + 1}
          </Button>
        ))}
        {fields.length < 3 && (
          <Button
            type="button"
            className="w-12 p-3 mr-3 text-md hover:bg-primary hover:text-white"
            onClick={handleAddMuestra}
          >
            <Plus className="w-4 h-4" />
          </Button>
        )}
      </div>

      <div
        className={`transition-all duration-300 ease-in-out min-h-[550px] w-full ${asideVisible ? 'md:w-2/3' : ''}`}
      >
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(handleSubmitForm)}
            className="relative flex flex-col h-full "
          >
            <div className="flex-grow overflow-y-auto">
              <Tabs
                tabs={[
                  {
                    id: 'general',
                    label: 'Datos principales',
                    content: (
                      <DatosGeneralesSection key={`general-${currentIndex}`} index={currentIndex} />
                    )
                  },
                  {
                    id: 'muestra',
                    label: 'Cronología',
                    content: (
                      <DatosMuestraSection key={`muestra-${currentIndex}`} index={currentIndex} />
                    )
                  }
                ]}
              />
            </div>
            <div className="sticky bottom-0 bg-white z-10">
              <Button type="submit" variant="primary">
                <SendIcon />
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>

      {asideVisible && (
        <aside className="hidden md:block md:w-1/3 pr-4">
          <SolicitudAsidePreview
            id_cliente={clienteId}
            id_prueba={pruebaId}
            id_paciente={pacienteId}
            id_muestra={muestra?.id_muestra}
            onTecnicasChange={handleTecnicasChange}
          />
        </aside>
      )}
    </div>
  )
}
