import { useFormContext } from 'react-hook-form'
import { FormField } from '@/shared/components/molecules/FormField'
import { SolicitudFormValues } from '../../interfaces/form.types'

interface Props {
  index: number
  // onRemove: () => void
}

export const DatosMuestraSection = ({ index }: Props) => {
  // export const DatosMuestraSection = ({ index, onRemove }: Props) => {
  const { register } = useFormContext<SolicitudFormValues>()

  return (
    <div className="border rounded-md p-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          id={`muestra.${index}.f_toma`}
          label="Fecha de toma"
          inputProps={{ ...register(`muestra.${index}.f_toma`), type: 'date' }}
        />
        <FormField
          id={`muestra.${index}.f_recepcion`}
          label="Fecha de recepción"
          inputProps={{ ...register(`muestra.${index}.f_recepcion`), type: 'date' }}
        />
        <FormField
          id={`muestra.${index}.f_destruccion`}
          label="Fecha de destrucción"
          inputProps={{ ...register(`muestra.${index}.f_destruccion`), type: 'date' }}
        />
        <FormField
          id={`muestra.${index}.f_devolucion`}
          label="Fecha de devolución"
          inputProps={{ ...register(`muestra.${index}.f_devolucion`), type: 'date' }}
        />
      </div>
      {/* <div className="flex justify-end">
        <button type="button" onClick={onRemove}>
          Eliminar muestra
        </button>
      </div> */}
    </div>
  )
}
