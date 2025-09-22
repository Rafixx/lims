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
import { useCentros } from '../../hooks/useCentros'
import { useTecnicosLab } from '../../hooks/useTecnicosLab'

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
  const { data: pruebas = [], isLoading: loadingPruebas } = usePruebas()
  const { data: pacientes = [], isLoading: loadingPacientes } = usePacientes()
  const { data: clientes = [], isLoading: loadingClientes } = useClientes()
  const { data: tiposMuestra = [], isLoading: loadingTipos } = useTiposMuestra()
  const { data: centros = [], isLoading: loadingCentros } = useCentros()
  const { data: tec_resp = [], isLoading: loadingTecResp } = useTecnicosLab()

  // Opciones de estado como array de objetos para EntitySelect
  const estadosOptions = [
    { id: APP_STATES.SOLICITUD.PENDIENTE, nombre: 'Pendiente' },
    { id: APP_STATES.SOLICITUD.EN_PROCESO, nombre: 'En Proceso' },
    { id: APP_STATES.SOLICITUD.COMPLETADA, nombre: 'Completada' },
    { id: APP_STATES.SOLICITUD.CANCELADA, nombre: 'Cancelada' }
  ]

  return (
    <div className="space-y-6">
      {/* Información de la Muestra Específica */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Datos de la Muestra {index + 1}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <EntitySelect
            name={`muestras.${index}.id_cliente`}
            control={control}
            label="Cliente *"
            options={clientes}
            isLoading={loadingClientes}
            getValue={cliente => cliente.id}
            getLabel={cliente => cliente.nombre}
            required
            className={muestraStyle}
            // error={errors.muestras?.[index]?.id_paciente?.message}
          />
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

          <EntitySelect
            name={`muestras.${index}.centro.id`}
            control={control}
            label="Centro *"
            options={centros}
            isLoading={loadingCentros}
            getValue={centro => centro.id}
            getLabel={centro => centro.descripcion}
            required
            className={muestraStyle}
          />

          <EntitySelect
            name={`muestras.${index}.tecnico_responsable.id_usuario`}
            control={control}
            label="Técnico Responsable *"
            options={tec_resp}
            isLoading={loadingTecResp}
            getValue={tec => tec.id_usuario}
            getLabel={tec => tec.nombre}
            required
            className={muestraStyle}
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
    </div>
  )
}
