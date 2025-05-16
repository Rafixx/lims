// src/features/solicitudes/components/solicitudForm/DatosGeneralesSection.tsx
import { useFormContext } from 'react-hook-form'
import { FormValues } from './SolicitudForm'
import { FormField } from '@/shared/components/molecules/FormField'
import { EntitySelect } from '@/shared/components/molecules/EntitySelect'
import { useClientes } from '../../hooks/useClientes'
import { usePruebas } from '../../hooks/usePruebas'
import { usePacientes } from '../../hooks/usePacientes'
import { useTiposMuestra } from '../../hooks/useTiposMuestra'
import { useUbicaciones } from '../../hooks/useUbicaciones'

export const DatosGeneralesSection = () => {
  const {
    control,
    register,
    formState: { errors }
  } = useFormContext<FormValues>()

  // Para filtrar pruebas según el cliente
  // const clienteSeleccionado = watch('clienteId')

  // Carga de datos
  const { data: clientes = [], isLoading: loadingClientes } = useClientes()
  const { data: pruebas = [], isLoading: loadingPruebas } = usePruebas()
  const { data: pacientes = [], isLoading: loadingPacientes } = usePacientes()
  const { data: tiposMuestra = [], isLoading: loadingTipos } = useTiposMuestra()
  const { data: ubicaciones = [], isLoading: loadingUbicaciones } = useUbicaciones()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Nº Solicitud */}
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

      {/* Paciente */}
      <EntitySelect
        name="id_paciente"
        control={control}
        label="Paciente"
        options={pacientes}
        isLoading={loadingPacientes}
        getValue={p => p.id}
        getLabel={p => p.nombre}
        required
      />

      {/* Cliente */}
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

      {/* Prueba (filtrada por cliente) */}
      <EntitySelect
        name="id_prueba"
        control={control}
        label="Prueba"
        options={pruebas}
        isLoading={loadingPruebas}
        getValue={p => p.id}
        getLabel={p => p.prueba}
        required
      />

      {/* Tipo de muestra */}
      <EntitySelect
        name="id_tipo_muestra"
        control={control}
        label="Tipo de muestra"
        options={tiposMuestra}
        isLoading={loadingTipos}
        getValue={tm => tm.id}
        getLabel={tm => tm.tipo_muestra}
        required
      />

      {/* Condiciones de envío */}
      <FormField
        id="condiciones_envio"
        label="Condiciones de envío"
        inputProps={{
          ...register('condiciones_envio'),
          type: 'text'
        }}
        error={errors.condiciones_envio?.message}
      />

      {/* Tiempo con hielo */}
      <FormField
        id="tiempo_hielo"
        label="Tiempo con hielo"
        inputProps={{
          ...register('tiempo_hielo'),
          type: 'text'
        }}
        error={errors.tiempo_hielo?.message}
      />

      {/* Ubicación */}
      <EntitySelect
        name="id_ubicacion"
        control={control}
        label="Ubicación"
        options={ubicaciones}
        isLoading={loadingUbicaciones}
        getValue={ub => ub.id}
        getLabel={ub => ub.ubicacion}
        required
      />

      {/* Centro externo */}
      <FormField
        id="id_centro_externo"
        label="Centro externo (ID)"
        inputProps={{
          ...register('id_centro_externo', { valueAsNumber: true }),
          type: 'number',
          min: 0
        }}
        error={errors.id_centro_externo?.message}
      />

      {/* Criterio validación */}
      <FormField
        id="id_criterio_val"
        label="Criterio validación (ID)"
        inputProps={{
          ...register('id_criterio_val', { valueAsNumber: true }),
          type: 'number',
          min: 0
        }}
        error={errors.id_criterio_val?.message}
      />
    </div>
  )
}
