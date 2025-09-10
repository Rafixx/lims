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
      {/* Fechas de la Solicitud (nivel general) */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Cronología de la Solicitud</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            id="f_creacion"
            label="Fecha de Creación"
            inputProps={{
              ...register('f_creacion'),
              type: 'datetime-local',
              readOnly: true
            }}
            // helpText="Fecha automática de creación"
          />
          <FormField
            id="f_compromiso"
            label="Fecha Compromiso"
            inputProps={{
              ...register('f_compromiso'),
              type: 'datetime-local'
            }}
            // helpText="Fecha acordada para entrega"
          />
          <FormField
            id="f_entrega"
            label="Fecha de Entrega"
            inputProps={{
              ...register('f_entrega'),
              type: 'datetime-local'
            }}
            // helpText="Fecha real de entrega (opcional)"
          />
        </div>
      </div>

      {/* Fechas específicas de la Muestra */}
      <div className="bg-blue-50 p-4 rounded-lg">
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
