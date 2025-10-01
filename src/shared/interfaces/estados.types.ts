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
