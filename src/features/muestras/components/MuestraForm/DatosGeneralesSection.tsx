// src/features/solicitudes/components/solicitudForm/DatosGeneralesSection.tsx
import { useFormContext } from 'react-hook-form'
import { FormField } from '@/shared/components/molecules/FormField'
import { EntitySelect } from '@/shared/components/molecules/EntitySelect'
import { muestraStyle } from './MuestraForm'
import type { Muestra } from '../../interfaces/muestras.types'
import {
  useClientes,
  usePruebas,
  usePacientes,
  useTiposMuestra,
  useCentros,
  useTecnicosLaboratorio,
  useCriteriosValidacion
} from '@/shared/hooks/useDim_tables'

interface DatosGeneralesSectionProps {
  isDuplicating?: boolean
}

export const DatosGeneralesSection = ({ isDuplicating = false }: DatosGeneralesSectionProps) => {
  const {
    control,
    register,
    watch,
    formState: { errors }
  } = useFormContext<Muestra>()

  // Obtener el id_muestra actual para determinar si estamos editando
  const id_muestra = watch('id_muestra')

  // Carga de datos - usando hooks existentes o temporales
  const { data: pruebas = [], isLoading: loadingPruebas } = usePruebas()
  const { data: pacientes = [], isLoading: loadingPacientes } = usePacientes()
  const { data: clientes = [], isLoading: loadingClientes } = useClientes()
  const { data: tiposMuestra = [], isLoading: loadingTipos } = useTiposMuestra()
  const { data: centros = [], isLoading: loadingCentros } = useCentros()
  const { data: tec_resp = [], isLoading: loadingTecResp } = useTecnicosLaboratorio()
  const { data: criterios = [], isLoading: loadingCriterios } = useCriteriosValidacion()

  return (
    <div className="space-y-6">
      {/* Información de la Muestra Específica */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Datos de la Muestra </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <EntitySelect
            name={`solicitud.cliente.id`}
            control={control}
            label="Cliente"
            options={clientes}
            isLoading={loadingClientes}
            getValue={cliente => cliente.id}
            getLabel={cliente => cliente.nombre}
            required
            className={muestraStyle}
            disabled={isDuplicating}
            // error={errors.muestras?.[index]?.id_paciente?.message}
          />
          <EntitySelect
            name={`paciente.id`}
            control={control}
            label="Paciente"
            options={pacientes}
            isLoading={loadingPacientes}
            getValue={paciente => paciente.id}
            getLabel={paciente => paciente.nombre}
            required
            className={muestraStyle}
            disabled={isDuplicating}
            // error={errors.muestras?.[index]?.id_paciente?.message}
          />

          <EntitySelect
            name={`prueba.id`}
            control={control}
            label="Prueba"
            options={pruebas}
            isLoading={loadingPruebas}
            getValue={prueba => prueba.id}
            getLabel={prueba => prueba.prueba || ''}
            required
            className={muestraStyle}
            disabled={id_muestra !== undefined && id_muestra > 0}
            // error={errors.muestras?.[index]?.id_prueba?.message}
          />

          <EntitySelect
            name={`tipo_muestra.id`}
            control={control}
            label="Tipo de Muestra"
            options={tiposMuestra}
            isLoading={loadingTipos}
            getValue={tipo => tipo.id}
            getLabel={tipo => tipo.tipo_muestra || ''}
            required
            className={muestraStyle}
            // error={errors.muestras?.[index]?.id_tipo_muestra?.message}
          />

          <EntitySelect
            name={`centro.id`}
            control={control}
            label="Centro"
            options={centros}
            isLoading={loadingCentros}
            getValue={centro => centro.id}
            getLabel={centro => centro.descripcion || ''}
            required
            className={muestraStyle}
            disabled={isDuplicating}
          />

          <EntitySelect
            name={`tecnico_resp.id_usuario`}
            control={control}
            label="Técnico Responsable"
            options={tec_resp}
            isLoading={loadingTecResp}
            getValue={tec => tec.id_usuario}
            getLabel={tec => tec.nombre || ''}
            required
            className={muestraStyle}
          />

          <EntitySelect
            name={`criterio_validacion.id`}
            control={control}
            label="Criterio de Validación"
            options={criterios}
            isLoading={loadingCriterios}
            getValue={cval => cval.id}
            getLabel={cval => cval.descripcion || ''}
            required
            className={muestraStyle}
          />

          <FormField
            id={`codigo_externo`}
            label="Código externo"
            inputProps={{
              ...register(`codigo_externo`),
              type: 'text',
              disabled: isDuplicating
              // placeholder: 'Ej: MUE-2024-001'
            }}
            error={errors.codigo_externo?.message}
            required
            className={muestraStyle}
          />
          <FormField
            id={`codigo_epi`}
            label="Código EPIDISEASE"
            inputProps={{
              ...register(`codigo_epi`),
              type: 'text',
              placeholder: 'Ej: EPI2025-001',
              disabled: isDuplicating
            }}
            error={errors.codigo_epi?.message}
            className={muestraStyle}
          />
          <FormField
            id={`estudio`}
            label="Número de estudio"
            inputProps={{
              ...register(`estudio`),
              type: 'text',
              placeholder: 'Ej: estudio-12345'
            }}
            error={errors.estudio?.message}
            className={muestraStyle}
          />

          <FormField
            id={`solicitud.condiciones_envio`}
            label="Condiciones de Envío"
            inputProps={{
              ...register(`solicitud.condiciones_envio`),
              type: 'text',
              placeholder: 'Ej: Temperatura ambiente, refrigerada...'
            }}
            error={errors.solicitud?.condiciones_envio?.message}
            className={muestraStyle}
          />

          <FormField
            id={`solicitud.tiempo_hielo`}
            label="Tiempo en Hielo"
            inputProps={{
              ...register(`solicitud.tiempo_hielo`),
              type: 'text',
              placeholder: 'Ej: 2 horas, No aplica...'
            }}
            error={errors.solicitud?.tiempo_hielo?.message}
            className={muestraStyle}
          />
        </div>

        <FormField
          id={`observaciones`}
          label="Observaciones"
          inputProps={{
            ...register(`observaciones`),
            type: 'text',
            placeholder: 'Incidencias u observaciones adicionales sobre la muestra...'
          }}
          error={errors.observaciones?.message}
          className={muestraStyle}
        />
      </div>
    </div>
  )
}
