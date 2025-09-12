import { useForm, FormProvider, SubmitHandler, useFieldArray } from 'react-hook-form'
import { useCallback, useEffect, useState } from 'react'
import { useNotification } from '@/shared/components/Notification/NotificationContext'
import { useCreateSolicitud, useUpdateSolicitud } from '../../hooks/useSolicitudes'
import { SolicitudAsidePreview } from './SolicitudAsidePreview'
import { DatosGeneralesSection } from './DatosGeneralesSection'
import { Tabs } from '@/shared/components/molecules/Tabs'
import { DatosMuestraSection } from './DatosMuestraSection'
import { Button } from '@/shared/components/molecules/Button'
import { Plus, SendIcon } from 'lucide-react'

import { DEFAULT_MUESTRA, EMPTY_SOLICITUD_FORM } from '../../interfaces/defaults'
import type {
  Solicitud,
  CreateSolicitudRequest,
  UpdateSolicitudRequest
} from '../../interfaces/solicitudes.types'
import { normalizeDates } from '@/shared/utils/helpers'

interface Props {
  initialValues?: Partial<Solicitud>
  onSuccess?: () => void
  onCancel?: () => void
  onClose?: () => void
}

export const muestraStyle = 'border-2 border-l-accent'

export const SolicitudForm = ({ initialValues, onSuccess, onCancel, onClose }: Props) => {
  const methods = useForm<Solicitud>({
    defaultValues: (initialValues as Solicitud) || EMPTY_SOLICITUD_FORM
  })

  const { control, watch, handleSubmit, setValue } = methods
  const { fields, append } = useFieldArray({
    control,
    name: 'muestras'
  })

  const createMutation = useCreateSolicitud()
  const updateMutation = useUpdateSolicitud()
  const { notify } = useNotification()

  const [currentIndex, setCurrentIndex] = useState(0)

  const clienteId = watch('id_cliente')
  const pruebaId = watch(`muestras.${currentIndex}.id_prueba`)
  const pacienteId = watch(`muestras.${currentIndex}.id_paciente`)
  const asideVisible = Boolean(clienteId || pruebaId || pacienteId)
  const muestra = watch(`muestras.${currentIndex}`)

  const handleTecnicasChange = useCallback(
    (tecnicas: { id_tecnica_proc: number }[]) => {
      setValue(`muestras.${currentIndex}.tecnicas`, tecnicas, {
        shouldValidate: false,
        shouldDirty: true
      })
    },
    [currentIndex, setValue]
  )

  useEffect(() => {
    if (initialValues) {
      const normalized = normalizeDates(initialValues)
      const normalizedMuestras = normalized.muestras?.map(muestra => normalizeDates(muestra)) || []

      const patchedInitial = {
        ...normalized,
        muestras: normalizedMuestras.length > 0 ? normalizedMuestras : [DEFAULT_MUESTRA]
      } as Solicitud

      methods.reset(patchedInitial)
      setCurrentIndex(0)
    }
  }, [initialValues, methods])

  const handleSubmitForm: SubmitHandler<Solicitud> = async formValues => {
    try {
      const isEditing = !!formValues.id_solicitud

      if (isEditing) {
        const updateData: UpdateSolicitudRequest = {
          id_solicitud: formValues.id_solicitud!,
          estado_solicitud: formValues.estado_solicitud,
          f_compromiso: formValues.f_compromiso,
          f_entrega: formValues.f_entrega,
          observaciones: formValues.observaciones
        }

        await updateMutation.mutateAsync({ id: formValues.id_solicitud!, data: updateData })
        notify('Solicitud actualizada con éxito', 'success')
      } else {
        const createData: CreateSolicitudRequest = {
          id_cliente: formValues.id_cliente,
          muestras: formValues.muestras,
          f_compromiso: formValues.f_compromiso,
          observaciones: formValues.observaciones
        }

        await createMutation.mutateAsync(createData)
        notify('Solicitud creada con éxito', 'success')
      }

      // Llamar callbacks apropiados
      if (onSuccess) {
        onSuccess()
      } else if (onClose) {
        onClose()
      }
    } catch (error) {
      notify('Error al guardar la solicitud', 'error')
      console.error(error)
    }
  }

  const handleAddMuestra = () => {
    append(DEFAULT_MUESTRA)
    setCurrentIndex(fields.length) // Navega a la nueva muestra
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    } else if (onClose) {
      onClose()
    }
  }

  const isSubmitting = createMutation.isPending || updateMutation.isPending

  return (
    <div className="relative flex w-full transition-all duration-300 ease-in-out">
      <div className="mt-10 gap-4 flex flex-col w-24">
        {fields.map((_, index) => (
          <Button
            type="button"
            key={index}
            className={`border-r-2 border-accent w-12 p-3 mr-3 text-xs hover:cursor-pointer ${
              currentIndex === index
                ? 'bg-accent text-white font-bold'
                : 'hover:bg-accent hover:text-white'
            }`}
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
        className={`transition-all duration-300 ease-in-out min-h-[550px] w-full ${
          asideVisible ? 'md:w-2/3' : ''
        }`}
      >
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(handleSubmitForm)} className="relative flex flex-col h-full">
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

            <div className="sticky bottom-0 mb-4 bg-white z-10 flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="danger" onClick={handleCancel} disabled={isSubmitting}>
                Cancelar
              </Button>
              <Button type="submit" variant="primary" disabled={isSubmitting}>
                <div className="flex items-center gap-2">
                  <SendIcon className="w-4 h-4 mr-2" />
                  {isSubmitting
                    ? 'Guardando...'
                    : initialValues?.id_solicitud
                      ? 'Actualizar'
                      : 'Crear'}{' '}
                  Solicitud
                </div>
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
