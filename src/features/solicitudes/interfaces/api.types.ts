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

export interface Muestra {
  id_muestra: number
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
  id_prueba: number
  f_creacion: string
  f_entrada: string
  f_compromiso: string
  f_entrega: string
  f_resultado: string
  condiciones_envio: string
  tiempo_hielo: string
  estado_solicitud: string
  delete_dt: string
  update_dt: string
  created_by: number
  updated_by: number
  muestra: Muestra[]
  cliente: Cliente
  prueba: Prueba
}
