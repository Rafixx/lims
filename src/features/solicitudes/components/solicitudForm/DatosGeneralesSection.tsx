// src/features/solicitudes/components/solicitudForm/DatosGeneralesSection.tsx
import { useFormContext } from 'react-hook-form'
import { FormField } from '@/shared/components/molecules/FormField'
import { EntitySelect } from '@/shared/components/molecules/EntitySelect'
import { useClientes } from '../../hooks/useClientes'
import { usePruebas } from '../../hooks/usePruebas'
import { usePacientes } from '../../hooks/usePacientes'
import { useTiposMuestra } from '../../hooks/useTiposMuestra'
import { useUbicaciones } from '../../hooks/useUbicaciones'
import { useCentros } from '../../hooks/useCentros'
import { useCriteriosValidacion } from '../../hooks/useCriteriosValidacion'
import { useTecnicosLab } from '../../hooks/useTecnicosLab'
import { SolicitudFormValues } from '../../interfaces/form.types'
import { muestraStyle } from './SolicitudForm'

interface Props {
  index: number
}

export const DatosGeneralesSection = ({ index }: Props) => {
  const {
    control,
    register,
    formState: { errors }
  } = useFormContext<SolicitudFormValues>()

  // Carga de datos
  const { data: clientes = [], isLoading: loadingClientes } = useClientes()
  const { data: pruebas = [], isLoading: loadingPruebas } = usePruebas()
  const { data: pacientes = [], isLoading: loadingPacientes } = usePacientes()
  const { data: tiposMuestra = [], isLoading: loadingTipos } = useTiposMuestra()
  const { data: ubicaciones = [], isLoading: loadingUbicaciones } = useUbicaciones()
  const { data: centros = [], isLoading: loadingCentros } = useCentros()
  const { data: criteriosValidacion = [], isLoading: loadingCriterios } = useCriteriosValidacion()
  const { data: tecnicosLab = [], isLoading: loadingTecnicos } = useTecnicosLab()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 px-2">
      <FormField
        id="num_solicitud"
        label="Nº Solicitud"
        inputProps={{
          ...register('num_solicitud', {
            required: 'Obligatorio',
            maxLength: { value: 20, message: 'Máx 20 caracteres' },
            minLength: { value: 5, message: 'Mínimo 5 caracteres' }
          })
        }}
        error={errors.num_solicitud?.message}
      />
      <FormField
        id={`muestra.${index}.codigo_epi`}
        label="Código EPI"
        inputProps={{
          ...register(`muestra.${index}.codigo_epi`, {})
        }}
        error={errors.muestra?.[index]?.codigo_epi?.message}
        className={muestraStyle}
      />
      <FormField
        id={`muestra.${index}.codigo_externo`}
        label="Código externo"
        inputProps={{
          ...register(`muestra.${index}.codigo_externo`, {})
        }}
        error={errors.muestra?.[index]?.codigo_externo?.message}
        className={muestraStyle}
      />
      <EntitySelect
        name={`muestra.${index}.id_paciente`}
        control={control}
        label="Paciente"
        options={pacientes}
        isLoading={loadingPacientes}
        getValue={p => p.id}
        getLabel={p => p.nombre}
        required
        className={muestraStyle}
      />
      <EntitySelect
        name="id_cliente"
        control={control}
        label="Cliente"
        options={clientes}
        isLoading={loadingClientes}
        getValue={p => p.id}
        getLabel={p => p.nombre}
        required
      />
      <EntitySelect
        name={`muestra.${index}.id_prueba`}
        control={control}
        label="Prueba"
        options={pruebas}
        isLoading={loadingPruebas}
        getValue={p => p.id}
        getLabel={p => p.prueba}
        required
      />
      <EntitySelect
        name={`muestra.${index}.id_tipo_muestra`}
        control={control}
        label="Tipo de muestra"
        options={tiposMuestra}
        isLoading={loadingTipos}
        getValue={tm => tm.id}
        getLabel={tm => tm.tipo_muestra}
        required
        className={muestraStyle}
      />
      <FormField
        id={'condiciones_envio'}
        label="Condiciones de envío"
        inputProps={{
          ...register('condiciones_envio'),
          type: 'text'
        }}
        error={errors.condiciones_envio?.message}
      />
      <FormField
        id={'tiempo_hielo'}
        label="Tiempo con hielo"
        inputProps={{
          ...register('tiempo_hielo'),
          type: 'text'
        }}
        error={errors.tiempo_hielo?.message}
      />
      <EntitySelect
        name={`muestra.${index}.id_ubicacion`}
        control={control}
        label="Ubicación"
        options={ubicaciones}
        isLoading={loadingUbicaciones}
        getValue={ub => ub.id}
        getLabel={ub => ub.ubicacion}
        required
        className={muestraStyle}
      />
      <EntitySelect
        name={`muestra.${index}.id_centro_externo`}
        control={control}
        label="Centro externo"
        options={centros}
        isLoading={loadingCentros}
        getValue={c => c.id}
        getLabel={c => c.descripcion}
        required
      />
      {/* <FormField
        id={`muestra.${index}.id_tecnico_resp`}
        className={muestraStyle}
        label="Técnico responsable (ID)"
        inputProps={{
          ...register(`muestra.${index}.id_tecnico_resp`, { valueAsNumber: true }),
          type: 'number',
          min: 0
        }}
        error={errors.muestra?.[index]?.id_tecnico_resp?.message}
      /> */}
      <EntitySelect
        name={`muestra.${index}.id_tecnico_resp`}
        control={control}
        label="Técnico responsable"
        options={tecnicosLab}
        isLoading={loadingTecnicos}
        getValue={t => t.id_usuario}
        getLabel={t => t.nombre}
        required
        className={muestraStyle}
      />
      <EntitySelect
        name={`muestra.${index}.id_criterio_val`}
        control={control}
        label="Criterio de validación"
        options={criteriosValidacion}
        isLoading={loadingCriterios}
        getValue={c => c.id}
        getLabel={c => c.descripcion}
        required
      />
      {/* <FormField
        id={`muestra.${index}.id_criterio_val`}
        label="Criterio validación (ID)"
        inputProps={{
          ...register(`muestra.${index}.id_criterio_val`, { valueAsNumber: true }),
          type: 'number',
          min: 0
        }}
        className={muestraStyle}
        error={errors.muestra?.[index]?.id_criterio_val?.message}
      /> */}
    </div>
  )
}
