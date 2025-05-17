// features/solicitudes/utils/solicitud.mapper.ts

import { SolicitudFormValues } from '../interfaces/form.types'
import { CreateSolicitudDTO } from '../interfaces/dto.types'

export function mapFormValuesToDTO(values: SolicitudFormValues): CreateSolicitudDTO {
  const muestra = values.muestra[0] // suponiendo que sólo hay una

  return {
    num_solicitud: values.num_solicitud,
    id_paciente: muestra.id_paciente,
    id_cliente: values.id_cliente,
    id_prueba: values.id_prueba,
    id_tipo_muestra: muestra.id_tipo_muestra,
    condiciones_envio: values.condiciones_envio,
    tiempo_hielo: values.tiempo_hielo,
    id_ubicacion: muestra.id_ubicacion,
    f_entrada: values.f_entrada ?? '',
    f_compromiso: values.f_compromiso,
    f_entrega: values.f_entrega,
    f_resultado: values.f_resultado,
    f_toma: muestra.f_toma,
    f_recepcion: muestra.f_recepcion,
    tecnicas: muestra.tecnicas.map(t => ({ id: t.id_tecnica_proc }))
  }
}
