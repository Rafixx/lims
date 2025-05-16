// src/features/solicitudes/components/solicitudForm/DatosGeneralesSection.tsx
import { Control, UseFormRegister } from 'react-hook-form'
import {
  CreateSolicitudDTO
  // TipoMuestra
} from '@/features/solicitudes/interfaces/solicitud.interface'
import { usePruebas } from '../../hooks/usePruebas'
import { useClientes } from '../../hooks/useClientes'
import { FormField } from '@/shared/components/molecules/FormField'
import { EntitySelect } from '@/shared/components/molecules/EntitySelect'
import { useTiposMuestra } from '../../hooks/useTiposMuestra'
import { usePacientes } from '../../hooks/usePacientes'
import { useUbicaciones } from '../../hooks/useUbicaciones'

interface Props {
  register: UseFormRegister<CreateSolicitudDTO>
  control: Control<CreateSolicitudDTO>
  onClienteChange?: (clienteId: number) => void
  onPruebaChange?: (pruebaId: number) => void
  onPacienteChange?: (pacienteId: number) => void
}

export const DatosGeneralesSection = ({
  register,
  control,
  onClienteChange,
  onPruebaChange,
  onPacienteChange
}: Props) => {
  const { data: pruebas = [] } = usePruebas()
  const { data: clientes = [] } = useClientes()
  const { data: tiposMuestra = [] } = useTiposMuestra()
  const { data: pacientes = [] } = usePacientes()
  const { data: ubicaciones = [] } = useUbicaciones()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        id="num_solicitud"
        label="Nº Solicitud"
        inputProps={register('num_solicitud', { required: true })}
      />
      <EntitySelect
        name="id_paciente"
        label="Paciente"
        control={control}
        required
        fetchFn={async () => pacientes} // el hook ya hizo el fetch
        getValue={pa => pa.id}
        getLabel={pa => pa.nombre}
        onChangeCapture={e => onPacienteChange?.(Number(e.target.value))}
      />

      <EntitySelect
        name="id_cliente"
        label="Cliente"
        control={control}
        required
        fetchFn={async () => clientes} // el hook ya hizo el fetch
        getValue={cl => cl.id}
        getLabel={cl => cl.nombre}
        onChangeCapture={e => onClienteChange?.(Number(e.target.value))}
      />
      <EntitySelect
        name="id_prueba"
        label="Prueba"
        control={control}
        required
        fetchFn={async () => pruebas} // el hook ya hizo el fetch
        getValue={pr => pr.id}
        getLabel={pr => pr.prueba}
        onChangeCapture={e => onPruebaChange?.(Number(e.target.value))}
        // icon={<List size={16} />}
        // onIconClick={() => console.log('Icon clicked!')}
      />
      <EntitySelect
        name="id_tipo_muestra"
        label="Tipo de muestra"
        control={control}
        required
        fetchFn={async () => tiposMuestra} // el hook ya hizo el fetch
        getValue={tm => tm.id}
        getLabel={tm => tm.tipo_muestra}
      />
      <FormField
        id="condiciones_envio"
        label="Condiciones de envío"
        inputProps={{ ...register('condiciones_envio') }}
      />
      <FormField
        id="tiempo_hielo"
        label="Tiempo con hielo"
        inputProps={{ ...register('tiempo_hielo') }}
      />
      <EntitySelect
        name="id_ubicacion"
        label="Ubicación"
        control={control}
        required
        fetchFn={async () => ubicaciones} // el hook ya hizo el fetch
        getValue={ub => ub.id}
        getLabel={ub => ub.ubicacion}
      />
      <FormField
        id="id_centro_externo"
        label="Centro externo (ID)"
        inputProps={{ ...register('id_centro_externo'), type: 'number', min: 0 }}
      />
      <FormField
        id="id_criterio_val"
        label="Criterio validación (ID)"
        inputProps={{ ...register('id_criterio_val'), type: 'number', min: 0 }}
      />

      {/* <FormField
        id="id_ubicacion"
        label="Ubicación (ID)"
        inputProps={{ ...register('id_ubicacion'), type: 'number', min: 0 }}
      />
      <FormField
        id="estado_solicitud"
        label="Estado de la solicitud"
        inputProps={{ ...register('estado_solicitud') }}
      /> */}
    </div>
  )
}
