// src/features/solicitudes/interfaces/dto.types.ts

export interface CreateSolicitudDTO {
  num_solicitud: string
  id_cliente: number
  f_entrada: string
  f_compromiso?: string
  f_entrega?: string
  f_resultado?: string
  condiciones_envio?: string
  tiempo_hielo?: string
  updated_by?: number
  muestra: {
    id_prueba: number
    codigo_epi: string
    codigo_externo: string
    id_paciente: number
    id_tipo_muestra: number
    id_ubicacion?: number
    id_centro_externo?: number
    id_criterio_val?: number
    id_tecnico_resp: number
    f_toma?: string
    f_recepcion?: string
    f_destruccion?: string
    f_devolucion?: string
    tecnicas?: { id: number }[]
  }[]
}
