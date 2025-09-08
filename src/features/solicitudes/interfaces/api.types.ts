// src/features/solicitudes/interfaces/api.types.ts

export interface TecnicaProc {
  id: number
  tecnica_proc: string
  orden: number
  obligatoria: boolean
  activa: boolean
  created_by: number
  update_dt: string
  id_prueba: number
  id_plantilla_tecnica: number
}

export interface Tecnica {
  id_tecnica: number
  id_muestra: number
  id_tecnica_proc: number
  id_tecnico_resp: number
  fecha_inicio_tec: string
  estado: string
  fecha_estado: string
  comentarios: string
  delete_dt: string
  update_dt: string
  created_by: number
  updated_by: number
  tecnica_proc: TecnicaProc
}

export interface TipoMuestra {
  id: number
  tipo_muestra: string
}

export interface TecnicoLab {
  id_usuario: number
  nombre: string
}

export interface Muestra {
  id_muestra: number
  id_prueba: number
  id_paciente: number
  id_solicitud: number
  id_tecnico_resp: number
  id_tipo_muestra: number
  id_centro_externo: number
  id_criterio_val: number
  id_ubicacion: number
  tipo_array: string
  codigo_epi: string
  codigo_externo: string
  f_toma: string
  f_recepcion: string
  f_destruccion: string
  f_devolucion: string
  agotada: boolean
  estado_muestra: string
  update_dt: string
  delete_dt: string
  created_by: number
  updated_by: number
  tecnicas: Tecnica[]
  tecnico_resp?: TecnicoLab
  tipo_muestra?: TipoMuestra
  prueba: Prueba
}

export interface Cliente {
  id: number
  nombre: string
}

export interface Prueba {
  id: number
  prueba: string
}

export interface SolicitudAPIResponse {
  id_solicitud: number
  num_solicitud: string
  id_cliente: number
  f_creacion: string
  f_entrada: string
  f_compromiso?: string | null
  f_entrega?: string | null
  f_resultado?: string | null
  condiciones_envio?: string | null
  tiempo_hielo?: string | null
  estado_solicitud: string
  delete_dt?: string | null
  update_dt: string
  created_by: number
  updated_by: number
  muestra?: Muestra[]
  cliente?: Cliente
  prueba?: Prueba
}
