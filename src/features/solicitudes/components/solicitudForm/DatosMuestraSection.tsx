// src/features/solicitudes/components/solicitudForm/DatosMuestraSection.tsx
import { UseFormRegister } from 'react-hook-form'
import { CreateSolicitudDTO } from '@/features/solicitudes/interfaces/solicitud.interface'
import { FormField } from '@/shared/components/molecules/FormField'

interface Props {
  register: UseFormRegister<CreateSolicitudDTO>
}

export const DatosMuestraSection = ({ register }: Props) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      <FormField
        id="f_entrada"
        label="Fecha de entrada"
        inputProps={{ ...register('f_entrada'), type: 'date' }}
      />
      <FormField
        id="f_compromiso"
        label="Fecha compromiso"
        inputProps={{ ...register('f_compromiso'), type: 'date' }}
      />
      <FormField
        id="f_entrega"
        label="Fecha entrega"
        inputProps={{ ...register('f_entrega'), type: 'date' }}
      />
      <FormField
        id="f_resultado"
        label="Fecha resultado"
        inputProps={{ ...register('f_resultado'), type: 'date' }}
      />
      <FormField
        id="f_toma"
        label="Fecha de toma"
        inputProps={{ ...register('f_toma'), type: 'date' }}
      />
      <FormField
        id="f_recepcion"
        label="Fecha de recepción"
        inputProps={{ ...register('f_recepcion'), type: 'date' }}
      />
      <FormField
        id="f_destruccion"
        label="Fecha de destrucción"
        inputProps={{ ...register('f_destruccion'), type: 'date' }}
      />
      <FormField
        id="f_devolucion"
        label="Fecha de devolución"
        inputProps={{ ...register('f_devolucion'), type: 'date' }}
      />
    </div>
  )
}
