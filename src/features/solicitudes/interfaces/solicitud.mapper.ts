// features/solicitudes/utils/solicitud.mapper.ts

import { SolicitudFormValues } from '../interfaces/form.types'
import { CreateSolicitudDTO } from '../interfaces/dto.types'

export const mapFormValuesToDTO = (
  values: SolicitudFormValues,
  context: { updatedBy?: number }
): CreateSolicitudDTO => {
  return {
    num_solicitud: values.num_solicitud,
    id_cliente: values.id_cliente,
    f_entrada: values.f_entrada ?? '',
    f_compromiso: values.f_compromiso,
    f_entrega: values.f_entrega,
    f_resultado: values.f_resultado,
    condiciones_envio: values.condiciones_envio,
    tiempo_hielo: values.tiempo_hielo,
    updated_by: context.updatedBy,
    muestra: values.muestra.map(m => ({
      id_prueba: m.id_prueba,
      codigo_epi: m.codigo_epi,
      codigo_externo: m.codigo_externo,
      id_paciente: m.id_paciente,
      id_tipo_muestra: m.id_tipo_muestra,
      id_ubicacion: m.id_ubicacion,
      id_centro_externo: m.id_centro_externo,
      id_criterio_val: m.id_criterio_val,
      id_tecnico_resp: m.id_tecnico_resp,
      f_toma: m.f_toma,
      f_recepcion: m.f_recepcion,
      f_destruccion: m.f_destruccion,
      f_devolucion: m.f_devolucion,
      tecnicas: m.tecnicas.map(t => ({ id: t.id_tecnica_proc }))
    }))
  }
}
