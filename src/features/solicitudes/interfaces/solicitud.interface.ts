// src/features/solicitudes/interfaces/solicitud.interface.ts

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
}

export interface CreateSolicitudDTO {
  num_solicitud: string
  id_cliente: number
  id_prueba: number
  f_entrada: string
}
