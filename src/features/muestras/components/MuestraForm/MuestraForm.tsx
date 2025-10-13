import { useForm, FormProvider, SubmitHandler } from 'react-hook-form'
import { useState, useCallback, useMemo } from 'react'
import { useNotification } from '@/shared/components/Notification/NotificationContext'
import { MuestraAsidePreview } from './MuestraAsidePreview'
import { DatosGeneralesSection } from './DatosGeneralesSection'
import { Tabs } from '@/shared/components/molecules/Tabs'
import { DatosMuestraSection } from './DatosMuestraSection'
import { Button } from '@/shared/components/molecules/Button'
import { SendIcon } from 'lucide-react'
import { Muestra } from '../../interfaces/muestras.types'
import { DEFAULT_MUESTRA } from '../../interfaces/defaults'
import { useCreateMuestra, useUpdateMuestra } from '../../hooks/useMuestras'
import { MuestraGroupSection } from './MuestraGroupSection'

// Tipo extendido para incluir técnicas en el formulario
type MuestraFormData = Muestra & {
  tecnicas?: { id_tecnica_proc: number }[]
}

interface Props {
  initialValues?: Muestra
  onSuccess?: () => void
  onCancel?: () => void
  isMuestraGroup: boolean
}

export const muestraStyle = 'border-2 border-l-accent'

export const MuestraForm = ({ initialValues, onSuccess, onCancel, isMuestraGroup }: Props) => {
  const methods = useForm<Muestra>({
    defaultValues: initialValues || DEFAULT_MUESTRA
  })

  const { watch, handleSubmit } = methods

  // ✅ No usar useEffect con reset - causa loop infinito
  // En su lugar, usar key en el componente padre para forzar re-mount

  const createMutation = useCreateMuestra()
  const updateMutation = useUpdateMuestra()

  const { notify } = useNotification()

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [selectedTecnicas, setSelectedTecnicas] = useState<{ id_tecnica_proc: number }[]>([])

  const clienteId = watch('solicitud.cliente.id')
  const pruebaId = watch('prueba.id')
  const pacienteId = watch('paciente.id')
  const id_muestra = watch('id_muestra')
  const estado_muestra = watch('estado_muestra')
  const asideVisible = Boolean(clienteId || pruebaId || pacienteId)

  const tabs = useMemo(() => {
    const baseTabs = [
      {
        id: 'general',
        label: 'Datos principales',
        content: <DatosGeneralesSection />
      },
      {
        id: 'muestra',
        label: 'Cronología',
        content: <DatosMuestraSection />
      }
    ]

    if (isMuestraGroup) {
      baseTabs.push({
        id: 'group',
        label: 'Placa',
        content: <MuestraGroupSection />
      })
    }

    return baseTabs
  }, [isMuestraGroup])

  // Callback para capturar las técnicas seleccionadas
  const handleTecnicasChange = useCallback((tecnicas: { id_tecnica_proc: number }[]) => {
    setSelectedTecnicas(tecnicas)
  }, [])

  const handleSubmitForm: SubmitHandler<Muestra> = async formValues => {
    try {
      setIsSubmitting(true)
      const isEditing = Boolean(formValues.id_muestra && formValues.id_muestra > 0)

      // Incluir las técnicas seleccionadas en los datos del formulario
      const formDataWithTecnicas: MuestraFormData = {
        ...formValues,
        tecnicas: selectedTecnicas
      }

      if (import.meta.env.DEV) {
        console.log('[📋 MuestraForm] Guardando muestra:', {
          modo: isEditing ? 'EDICIÓN' : 'CREACIÓN',
          id: formValues.id_muestra,
          tecnicas: selectedTecnicas.length,
          data: formDataWithTecnicas
        })
      }

      if (isEditing) {
        // Actualizar muestra existente
        await updateMutation.mutateAsync({
          id: formValues.id_muestra!,
          data: formDataWithTecnicas
        })
        notify('Muestra actualizada con éxito', 'success')
      } else {
        const { ...createData } = formDataWithTecnicas

        await createMutation.mutateAsync(createData as Muestra)
        notify('Muestra creada con éxito', 'success')
      }

      // Llamar al callback de éxito
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      console.error('❌ Error al guardar muestra:', error)

      if (formValues.id_muestra && formValues.id_muestra > 0) {
        notify(`Error al actualizar la muestra: ${errorMessage}`, 'error')
      } else {
        notify(`Error al crear la muestra: ${errorMessage}`, 'error')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    }
  }

  return (
    <div className="relative flex w-full transition-all duration-300 ease-in-out">
      <div
        className={`transition-all duration-300 ease-in-out min-h-[550px] w-full ${
          asideVisible ? 'md:w-2/3' : ''
        }`}
      >
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(handleSubmitForm)} className="relative flex flex-col h-full">
            <div className="flex-grow overflow-y-auto">
              <Tabs tabs={tabs} />
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
                    : initialValues?.id_muestra
                      ? 'Actualizar'
                      : 'Crear'}{' '}
                  Muestra
                </div>
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>

      {asideVisible && (
        <aside className="hidden md:block md:w-1/3 pr-4">
          <MuestraAsidePreview
            id_cliente={clienteId}
            id_prueba={pruebaId}
            id_paciente={pacienteId}
            id_muestra={id_muestra}
            estado_muestra={estado_muestra}
            onTecnicasChange={handleTecnicasChange}
          />
        </aside>
      )}
    </div>
  )
}
