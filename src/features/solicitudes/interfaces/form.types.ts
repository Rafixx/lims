// src/features/solicitudes/interfaces/form.types.ts

export interface SolicitudFormValues {
  id_cliente: number
  id_prueba: number
  id_centro_externo: number
  id_criterio_val: number
  num_solicitud: string
  id_tecnico_resp: number
  condiciones_envio: string
  tiempo_hielo: string
  f_entrada?: string
  f_compromiso?: string
  f_entrega?: string
  f_resultado?: string
  muestra: {
    id_paciente: number
    id_tipo_muestra: number
    id_ubicacion: number
    f_toma?: string
    f_recepcion?: string
    f_destruccion?: string
    f_devolucion?: string
    tecnicas: {
      id_tecnica_proc: number
    }[]
  }[]
}
