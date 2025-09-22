import { useFormContext } from 'react-hook-form'
import { FormField } from '@/shared/components/molecules/FormField'
import { muestraStyle } from './SolicitudForm'
import type { Solicitud } from '../../interfaces/solicitudes.types'

interface Props {
  index: number
}

export const DatosMuestraSection = ({ index }: Props) => {
  // ✅ Usar el tipo correcto de Solicitud
  const { register } = useFormContext<Solicitud>()

  return (
    <div className="space-y-6">
      {/* Fechas específicas de la Muestra */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Cronología de la Muestra {index + 1}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            id={`muestras.${index}.f_toma_muestra`}
            label="Fecha Toma de Muestra"
            inputProps={{
              ...register(`muestras.${index}.f_toma_muestra`),
              type: 'datetime-local'
            }}
            className={muestraStyle}
            // helpText="Cuándo se tomó la muestra"
          />

          <FormField
            id={`muestras.${index}.solicitud.f_creacion`}
            label="Fecha de Creación"
            inputProps={{
              ...register(`muestras.${index}.solicitud.f_creacion`),
              type: 'date',
              placeholder: 'Fecha de creación de la solicitud'
            }}
            className={muestraStyle}
          />
          <FormField
            id={`muestras.${index}.solicitud.f_entrada`}
            label="Fecha de Entrada"
            inputProps={{
              ...register(`muestras.${index}.solicitud.f_entrada`),
              type: 'date',
              placeholder: 'Fecha de entrada de la solicitud'
            }}
            className={muestraStyle}
          />
          <FormField
            id={`muestras.${index}.solicitud.f_compromiso`}
            label="Fecha Compromiso"
            inputProps={{
              ...register(`muestras.${index}.solicitud.f_compromiso`),
              type: 'date',
              placeholder: 'Fecha de compromiso de la solicitud'
            }}
            className={muestraStyle}
          />
          <FormField
            id={`muestras.${index}.solicitud.f_entrega`}
            label="Fecha de Entrega"
            inputProps={{
              ...register(`muestras.${index}.solicitud.f_entrega`),
              type: 'date',
              placeholder: 'Fecha de entrega de la solicitud'
            }}
            className={muestraStyle}
          />
          <FormField
            id={`muestras.${index}.solicitud.f_recepcion`}
            label="Fecha de Recepción"
            inputProps={{
              ...register(`muestras.${index}.solicitud.f_recepcion`),
              type: 'date',
              placeholder: 'Fecha de recepción de la solicitud'
            }}
            className={muestraStyle}
          />
        </div>
      </div>
    </div>
  )
}
