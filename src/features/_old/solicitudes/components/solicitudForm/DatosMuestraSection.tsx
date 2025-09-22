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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          {/* Campos adicionales de cronología de muestra */}
          <FormField
            id={`muestras.${index}.condiciones_envio`}
            label="Condiciones de Envío"
            inputProps={{
              ...register(`muestras.${index}.condiciones_envio`),
              type: 'text',
              placeholder: 'Ej: Temperatura ambiente, refrigerada...'
            }}
            className={muestraStyle}
          />

          <FormField
            id={`muestras.${index}.tiempo_hielo`}
            label="Tiempo en Hielo"
            inputProps={{
              ...register(`muestras.${index}.tiempo_hielo`),
              type: 'text',
              placeholder: 'Ej: 2 horas, No aplica...'
            }}
            className={muestraStyle}
          />

          <FormField
            id={`muestras.${index}.observaciones_muestra`}
            label="Observaciones de la Muestra"
            inputProps={{
              ...register(`muestras.${index}.observaciones_muestra`),
              type: 'text',
              placeholder: 'Observaciones específicas de esta muestra'
            }}
            className={muestraStyle}
          />
        </div>
      </div>
    </div>
  )
}
