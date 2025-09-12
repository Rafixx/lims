// ============================================
// TIPOS BASE (Building Blocks)
// ============================================

import { AppEstado } from '@/shared/states'

/** Entidad base para Cliente */
export interface Cliente {
  id: number
  nombre: string
  email?: string
  telefono?: string
}

/** Entidad base para Prueba */
export interface Prueba {
  id: number
  prueba: string
  descripcion?: string
  precio?: number
}

/** Entidad base para Técnica */
export interface Tecnica {
  id_tecnica_proc: number
  nombre?: string
  descripcion?: string
}

/** Entidad base para Paciente */
export interface Paciente {
  id: number
  nombre: string
  cedula?: string
  edad?: number
  sexo?: string
}

/** Entidad base para Tipo de Muestra */
export interface TipoMuestra {
  id: number
  nombre: string
  descripcion?: string
}

export interface Tecnico_responsable {
  id_usuario: number
  nombre: string
}

export interface Centro {
  id: number
  codigo: string
  descripcion: string
}

// ============================================
// TIPOS PRINCIPALES DE DOMINIO
// ============================================

/**
 * Muestra - Estructura unificada para API y Forms
 * Campos obligatorios son los mínimos requeridos para crear una muestra
 */
export interface Muestra {
  // IDs (obligatorios para crear/editar)
  id_muestra?: number // Opcional para creación, presente en respuestas
  id_paciente: number // Siempre requerido
  id_prueba: number // Siempre requerido
  id_tipo_muestra: number // Siempre requerido

  //estado de la muestra
  estado_muestra?: AppEstado

  // Códigos
  codigo_muestra?: string // Código de la muestra
  codigo_epi?: string
  codigo_externo?: string

  // Metadatos
  f_toma_muestra?: string // ISO date string

  // Condiciones de envío
  condiciones_envio?: string
  tiempo_hielo?: string

  // Observaciones
  observaciones_muestra?: string

  // Relaciones (pobladas en respuestas API)
  paciente?: Paciente
  prueba?: Prueba
  tipo_muestra?: TipoMuestra
  tecnicas?: Tecnica[]
  tecnico_responsable?: Tecnico_responsable
  centro?: Centro
}

/**
 * Solicitud - Estructura unificada para API y Forms
 * Diseñada para ser flexible: funciona tanto para requests como responses
 */
export interface Solicitud {
  // Identificación
  id_solicitud?: number // Opcional para creación, presente en respuestas
  num_solicitud?: string // Generado por el backend

  // Referencias principales
  id_cliente: number // Siempre requerido

  // Estados y fechas
  estado_solicitud?: AppEstado
  f_creacion?: string // ISO date string
  f_compromiso?: string // ISO date string
  f_entrega?: string | null // ISO date string

  // Contenido
  observaciones?: string
  muestras: Muestra[] // Array de muestras (nunca vacío en solicitudes válidas)

  // Relaciones (pobladas en respuestas API)
  cliente?: Cliente
}

// ============================================
// TIPOS DERIVADOS PARA CASOS ESPECÍFICOS
// ============================================

/** Para crear nuevas solicitudes - estructura mínima requerida */
export type CreateSolicitudRequest = Pick<Solicitud, 'id_cliente' | 'muestras'> & {
  f_compromiso?: string
  observaciones?: string
}

/** Para actualizar solicitudes existentes */
export type UpdateSolicitudRequest = Partial<
  Pick<Solicitud, 'estado_solicitud' | 'f_compromiso' | 'f_entrega' | 'observaciones'>
> & {
  id_solicitud: number // ID siempre requerido para updates
}

/** Respuesta completa del API con todas las relaciones pobladas */
export type SolicitudAPIResponse = Required<Pick<Solicitud, 'id_solicitud'>> &
  Solicitud & {
    num_solicitud: string
    cliente: Cliente
    muestras: (Muestra & {
      paciente: Paciente
      prueba: Prueba
      tipo_muestra: TipoMuestra
      tecnicas: Tecnica[]
      tecnico_responsable?: Tecnico_responsable
      centro: Centro
    })[]
  }

/** Para formularios - alias del tipo principal */
export type SolicitudFormValues = Solicitud

/** Para componentes de lista simplificada */
export type SolicitudListItem = Pick<
  Solicitud,
  'id_solicitud' | 'num_solicitud' | 'estado_solicitud' | 'f_creacion' | 'f_compromiso'
> & {
  cliente_nombre: string
  total_muestras: number
  muestras_completadas?: number
}

// ============================================
// TIPOS PARA ESTADÍSTICAS Y FILTROS
// ============================================

export interface SolicitudesStats {
  total_solicitudes: number
  solicitudes_pendientes: number
  solicitudes_en_progreso: number
  solicitudes_completadas: number
  solicitudes_vencidas: number
  promedio_tiempo_procesamiento: number | null
  solicitudes_creadas_hoy: number
  solicitudes_completadas_hoy: number
}

export interface SolicitudesFiltros {
  estados?: AppEstado[]
  clientes?: number[]
  pruebas?: number[]
  fechaDesde?: string
  fechaHasta?: string
  soloVencidas?: boolean
  soloHoy?: boolean
}

// ============================================
// TIPOS PARA HOOKS Y SERVICIOS
// ============================================

export interface UseSolicitudesReturn {
  solicitudes: SolicitudAPIResponse[]
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

export interface SolicitudServiceMethods {
  getSolicitudes(): Promise<SolicitudAPIResponse[]>
  getSolicitud(id: number): Promise<SolicitudAPIResponse>
  createSolicitud(data: CreateSolicitudRequest): Promise<SolicitudAPIResponse>
  updateSolicitud(id: number, data: UpdateSolicitudRequest): Promise<SolicitudAPIResponse>
  deleteSolicitud(id: number): Promise<void>
  getSolicitudesStats(): Promise<SolicitudesStats>
  getSolicitudesFiltradas(filtros: SolicitudesFiltros): Promise<SolicitudAPIResponse[]>
}
