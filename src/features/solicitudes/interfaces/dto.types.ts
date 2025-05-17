// src/features/solicitudes/interfaces/dto.types.ts

export interface CreateSolicitudDTO {
  num_solicitud: string
  id_paciente: number
  id_cliente: number
  id_prueba: number
  id_tipo_muestra: number
  condiciones_envio?: string
  tiempo_hielo?: string
  id_ubicacion?: number
  id_centro_externo?: number
  id_criterio_val?: number
  f_entrada: string
  f_compromiso?: string
  f_entrega?: string
  f_resultado?: string
  f_toma?: string
  f_recepcion?: string
  f_destruccion?: string
  f_devolucion?: string
  created_by?: number
  estado_solicitud?: string
  tecnicas?: { id: number }[]
}
