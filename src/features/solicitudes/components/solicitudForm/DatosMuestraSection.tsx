import { useFormContext } from 'react-hook-form'
import { FormField } from '@/shared/components/molecules/FormField'
import { SolicitudFormValues } from '../../interfaces/form.types'
import { muestraStyle } from './SolicitudForm'

interface Props {
  index: number
  // onRemove: () => void
}

export const DatosMuestraSection = ({ index }: Props) => {
  // export const DatosMuestraSection = ({ index, onRemove }: Props) => {
  const { register } = useFormContext<SolicitudFormValues>()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 px-2">
      <FormField
        id="f_entrada"
        label="Entrada"
        inputProps={{ ...register('f_entrada'), type: 'date' }}
      />
      <FormField
        id={'f_compromiso'}
        label="Compromiso"
        inputProps={{ ...register('f_compromiso'), type: 'date' }}
      />
      <FormField
        id={'f_entrega'}
        label="Entrega"
        inputProps={{ ...register('f_entrega'), type: 'date' }}
      />
      <FormField
        id={'f_resultado'}
        label="Resultado"
        inputProps={{ ...register('f_resultado'), type: 'date' }}
      />
      <FormField
        id={`muestra.${index}.f_toma`}
        label="Toma"
        inputProps={{ ...register(`muestra.${index}.f_toma`), type: 'date' }}
        className={muestraStyle}
      />
      <FormField
        id={`muestra.${index}.f_recepcion`}
        label="Recepción"
        inputProps={{ ...register(`muestra.${index}.f_recepcion`), type: 'date' }}
        className={muestraStyle}
      />
      <FormField
        id={`muestra.${index}.f_destruccion`}
        label="Destrucción"
        inputProps={{ ...register(`muestra.${index}.f_destruccion`), type: 'date' }}
        className={muestraStyle}
      />
      <FormField
        id={`muestra.${index}.f_devolucion`}
        label="Devolución"
        inputProps={{ ...register(`muestra.${index}.f_devolucion`), type: 'date' }}
        className={muestraStyle}
      />
    </div>
  )
}
