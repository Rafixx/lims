// ============ ESTADOS DE TECNICA ============
// IDs oficiales de dim_estados (entidad = 'TECNICA')
export const ESTADO_TECNICA = {
  PENDIENTE: 8,         // CREADA en dim_estados
  ASIGNADA: 9,
  EN_PROCESO: 10,
  EN_REVISION: 11,      // inactiva
  COMPLETADA_TECNICA: 12,
  CANCELADA_TECNICA: 13,
  PAUSADA: 14,          // ERROR_TECNICA en dim_estados
  REINTENTANDO: 15,
  EXTERNALIZADA: 16,
  ENVIADA_EXT: 17,
  RECIBIDA_EXT: 18
} as const

// ============ ESTADOS DE MUESTRA ============
// IDs oficiales de dim_estados (entidad = 'MUESTRA')
export const ESTADO_MUESTRA = {
  REGISTRADA: 1,
  RECIBIDA: 2,          // inactiva
  EN_PROCESO: 3,
  COMPLETADA: 4,
  RECHAZADA: 5,
  EN_REVISION: 6,       // inactiva
  COMPLETADA_ERROR: 7,
  // Alias para compatibilidad con código existente
  REGISTRADA_MUESTRA: 1
} as const

/**
 * Interfaces para el sistema de gestión de estados
 * Basado en la nueva API de estados del backend
 */

export type EntidadTipo = 'MUESTRA' | 'TECNICA'

export interface DimEstado {
  id: number
  estado: string
  entidad: EntidadTipo
  descripcion?: string
  orden?: number
  activo: boolean
  color?: string
  es_inicial: boolean
  es_final: boolean
}

export interface EstadoDisponible {
  id: number
  estado: string
  descripcion?: string
  color?: string
}

export interface CambioEstadoRequest {
  id_estado: number
  comentario?: string
}

export interface CambioEstadoResponse {
  id_muestra?: number
  id_tecnica?: number
  id_estado: number
  fecha_estado: string
  comentarios?: string
  estadoInfo: DimEstado
}

export interface EstadosApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  error?: {
    code: string
    message: string
    details?: Record<string, unknown>
  }
}

export interface EstadisticasEstado {
  entidad: EntidadTipo
  estados: Array<{
    estado: string
    count: number
    color: string
    descripcion: string
  }>
}

// Tipos para el contexto de React
export interface EstadosContextValue {
  estadosMuestra: DimEstado[]
  estadosTecnica: DimEstado[]
  isLoading: boolean
  error: string | null
  recargarEstados: () => Promise<void>
}

// Tipos para hooks
export interface UseEstadosOptions {
  entidad: EntidadTipo
  estadoActual?: number
}

export interface UseCambiarEstadoOptions {
  onSuccess?: (resultado: CambioEstadoResponse) => void
  onError?: (error: Error) => void
}
