// src/features/solicitudes/interfaces/solicitud.interface.ts
export interface TipoMuestra {
  id: number
  tipo_muestra: string
}

export interface Tecnico {
  id_usuario: number
  nombre: string
  email: string
}

export interface Tecnica_proc {
  tecnica_proc: string
}

export interface Tecnica {
  id_tecnica: number
  fecha_inicio_tec: string | null
  estado: string
  fecha_estado: string | null
  tecnica_proc: Tecnica_proc
}

export interface Muestra {
  id_muestra: number
  codigo_epi: string
  codigo_externo: string
  f_toma: string | null
  f_recepcion: string | null
  f_destruccion: string | null
  f_devolucion: string | null
  estado_muestra: string
  tecnico_resp?: Tecnico
  tipo_muestra?: TipoMuestra
  tecnicas?: Tecnica[]
}

export interface Solicitud {
  id_solicitud: number
  num_solicitud: string
  f_creacion: string
  estado_solicitud: string
  f_entrada: string
  cliente?: {
    id: number
    nombre: string
  }
  prueba?: {
    id: number
    prueba: string
  }
  muestra?: Muestra[]
  updated_by: number
}

export interface CreateSolicitudDTO {
  num_solicitud: string
  id_paciente: number
  id_cliente: number
  id_prueba: number
  id_tipo_muestra: number
  f_entrada: string
  created_by: number
  f_compromiso?: string
  f_entrega?: string
  f_resultado?: string
  condiciones_envio?: string
  tiempo_hielo?: string
  estado_solicitud?: string
  id_centro_externo?: number
  id_criterio_val?: number
  id_ubicacion?: number
  f_toma?: string
  f_recepcion?: string
  f_destruccion?: string
  f_devolucion?: string
}
