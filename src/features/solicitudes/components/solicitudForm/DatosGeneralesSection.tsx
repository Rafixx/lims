// src/features/solicitudes/components/solicitudForm/DatosGeneralesSection.tsx
import { useFormContext } from 'react-hook-form'
import { FormField } from '@/shared/components/molecules/FormField'
import { EntitySelect } from '@/shared/components/molecules/EntitySelect'
import { muestraStyle } from './SolicitudForm'
import type { Solicitud } from '../../interfaces/solicitudes.types'
import { APP_STATES } from '@/shared/states'
import { useClientes } from '../../hooks/useClientes'
import { usePruebas } from '../../hooks/usePruebas'
import { usePacientes } from '../../hooks/usePacientes'
import { useTiposMuestra } from '../../hooks/useTiposMuestra'

// Hooks temporales hasta implementar los reales
// const useClientes = () => ({ data: [], isLoading: false })
// const usePruebas = () => ({ data: [], isLoading: false })
// const usePacientes = () => ({ data: [], isLoading: false })
// const useTiposMuestra = () => ({ data: [], isLoading: false })

interface Props {
  index: number
}

export const DatosGeneralesSection = ({ index }: Props) => {
  const {
    control,
    register,
    formState: { errors }
  } = useFormContext<Solicitud>()

  // Carga de datos - usando hooks existentes o temporales
  const { data: clientes = [], isLoading: loadingClientes } = useClientes()
  const { data: pruebas = [], isLoading: loadingPruebas } = usePruebas()
  const { data: pacientes = [], isLoading: loadingPacientes } = usePacientes()
  const { data: tiposMuestra = [], isLoading: loadingTipos } = useTiposMuestra()

  // Opciones de estado como array de objetos para EntitySelect
  const estadosOptions = [
    { id: APP_STATES.SOLICITUD.PENDIENTE, nombre: 'Pendiente' },
    { id: APP_STATES.SOLICITUD.EN_PROCESO, nombre: 'En Proceso' },
    { id: APP_STATES.SOLICITUD.COMPLETADA, nombre: 'Completada' },
    { id: APP_STATES.SOLICITUD.CANCELADA, nombre: 'Cancelada' }
  ]

  return (
    <div className="space-y-6">
      {/* Información General de la Solicitud */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Información General</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Número de solicitud - Solo lectura si existe */}
          <FormField
            id="num_solicitud"
            label="Nº Solicitud"
            inputProps={{
              ...register('num_solicitud'),
              readOnly: true,
              className: 'bg-gray-100'
            }}
            error={errors.num_solicitud?.message}
            // helpText="Generado automáticamente"
          />

          <EntitySelect
            name="id_cliente"
            control={control}
            label="Cliente *"
            options={clientes}
            isLoading={loadingClientes}
            getValue={cliente => cliente.id}
            getLabel={cliente => cliente.nombre}
            required
            // error={errors.id_cliente?.message}
          />

          <EntitySelect
            name="estado_solicitud"
            control={control}
            label="Estado de la Solicitud"
            options={estadosOptions}
            isLoading={false}
            getValue={estado => estado.id}
            getLabel={estado => estado.nombre}
            // error={errors.estado_solicitud?.message}
          />

          <FormField
            id="f_compromiso"
            label="Fecha Compromiso"
            inputProps={{
              ...register('f_compromiso'),
              type: 'datetime-local'
            }}
            error={errors.f_compromiso?.message}
            // helpText="Fecha acordada para entrega"
          />

          <FormField
            id="observaciones"
            label="Observaciones Generales"
            inputProps={{
              ...register('observaciones'),
              type: 'text',
              placeholder: 'Observaciones de la solicitud...'
            }}
            error={errors.observaciones?.message}
            className="md:col-span-2"
          />
        </div>
      </div>

      {/* Información de la Muestra Específica */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Datos de la Muestra {index + 1}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <EntitySelect
            name={`muestras.${index}.id_paciente`}
            control={control}
            label="Paciente *"
            options={pacientes}
            isLoading={loadingPacientes}
            getValue={paciente => paciente.id}
            getLabel={paciente => paciente.nombre}
            required
            className={muestraStyle}
            // error={errors.muestras?.[index]?.id_paciente?.message}
          />

          <EntitySelect
            name={`muestras.${index}.id_prueba`}
            control={control}
            label="Prueba *"
            options={pruebas}
            isLoading={loadingPruebas}
            getValue={prueba => prueba.id}
            getLabel={prueba => prueba.prueba}
            required
            className={muestraStyle}
            // error={errors.muestras?.[index]?.id_prueba?.message}
          />

          <EntitySelect
            name={`muestras.${index}.id_tipo_muestra`}
            control={control}
            label="Tipo de Muestra *"
            options={tiposMuestra}
            isLoading={loadingTipos}
            getValue={tipo => tipo.id}
            getLabel={tipo => tipo.tipo_muestra}
            required
            className={muestraStyle}
            // error={errors.muestras?.[index]?.id_tipo_muestra?.message}
          />

          <FormField
            id={`muestras.${index}.codigo_muestra`}
            label="Código de Muestra"
            inputProps={{
              ...register(`muestras.${index}.codigo_muestra`),
              type: 'text',
              placeholder: 'Ej: MUE-2024-001'
            }}
            error={errors.muestras?.[index]?.codigo_muestra?.message}
            className={muestraStyle}
          />

          <FormField
            id={`muestras.${index}.condiciones_envio`}
            label="Condiciones de Envío"
            inputProps={{
              ...register(`muestras.${index}.condiciones_envio`),
              type: 'text',
              placeholder: 'Ej: Temperatura ambiente, refrigerada...'
            }}
            error={errors.muestras?.[index]?.condiciones_envio?.message}
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
            error={errors.muestras?.[index]?.tiempo_hielo?.message}
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
            error={errors.muestras?.[index]?.observaciones_muestra?.message}
            className={`${muestraStyle} md:col-span-2`}
          />
        </div>
      </div>

      {/* Nota informativa */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-amber-800">Implementación temporal</h3>
            <div className="mt-2 text-sm text-amber-700">
              <p>
                Los hooks de datos están pendientes de implementación. Por ahora se muestran campos
                vacíos hasta que se conecten con el backend.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
