/**
 * Sistema centralizado de estados de la aplicación LIMS
 * Define todos los estados posibles, transiciones válidas y configuración visual
 */

// ================================
// DEFINICIÓN DE ESTADOS
// ================================

export const APP_STATES = {
  // Estados de Solicitudes
  SOLICITUD: {
    PENDIENTE: 'PENDIENTE',
    EN_PROCESO: 'EN_PROCESO',
    COMPLETADA: 'COMPLETADA',
    CANCELADA: 'CANCELADA',
    RECHAZADA: 'RECHAZADA'
  },

  // Estados de Técnicas/Worklist
  TECNICA: {
    PENDIENTE: 'PENDIENTE_TECNICA',
    EN_PROGRESO: 'EN_PROGRESO',
    COMPLETADA: 'COMPLETADA_TECNICA',
    CANCELADA: 'CANCELADA_TECNICA',
    BLOQUEADA: 'BLOQUEADA'
  },

  // Estados de Muestras
  MUESTRA: {
    RECIBIDA: 'RECIBIDA',
    EN_PROCESAMIENTO: 'EN_PROCESAMIENTO',
    PROCESADA: 'PROCESADA',
    RECHAZADA: 'RECHAZADA_MUESTRA',
    CADUCADA: 'CADUCADA'
  },

  // Estados de Usuarios/Técnicos
  USUARIO: {
    ACTIVO: 'ACTIVO',
    INACTIVO: 'INACTIVO',
    SUSPENDIDO: 'SUSPENDIDO',
    BLOQUEADO: 'BLOQUEADO'
  },

  // Estados Generales del Sistema
  SISTEMA: {
    LOADING: 'LOADING',
    SUCCESS: 'SUCCESS',
    ERROR: 'ERROR',
    IDLE: 'IDLE',
    EMPTY: 'EMPTY'
  }
} as const

// ================================
// TIPOS TYPESCRIPT
// ================================

export type SolicitudEstado = (typeof APP_STATES.SOLICITUD)[keyof typeof APP_STATES.SOLICITUD]
export type TecnicaEstado = (typeof APP_STATES.TECNICA)[keyof typeof APP_STATES.TECNICA]
export type MuestraEstado = (typeof APP_STATES.MUESTRA)[keyof typeof APP_STATES.MUESTRA]
export type UsuarioEstado = (typeof APP_STATES.USUARIO)[keyof typeof APP_STATES.USUARIO]
export type SistemaEstado = (typeof APP_STATES.SISTEMA)[keyof typeof APP_STATES.SISTEMA]

// Tipo union de todos los estados
export type AppEstado =
  | SolicitudEstado
  | TecnicaEstado
  | MuestraEstado
  | UsuarioEstado
  | SistemaEstado

// ================================
// CONFIGURACIÓN VISUAL DE ESTADOS
// ================================

export interface EstadoConfig {
  label: string
  description: string
  color: string
  bgColor: string
  borderColor: string
  textColor: string
  icon?: string
  priority: number // Para ordenación (1 = más urgente)
}

export const ESTADOS_CONFIG: Record<string, EstadoConfig> = {
  // Solicitudes
  [APP_STATES.SOLICITUD.PENDIENTE]: {
    label: 'Pendiente',
    description: 'Solicitud en espera de procesamiento',
    color: 'amber',
    bgColor: 'bg-amber-100',
    borderColor: 'border-amber-200',
    textColor: 'text-amber-800',
    icon: 'Clock',
    priority: 2
  },

  [APP_STATES.SOLICITUD.EN_PROCESO]: {
    label: 'En Proceso',
    description: 'Solicitud siendo procesada actualmente',
    color: 'blue',
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-800',
    icon: 'PlayCircle',
    priority: 1
  },

  [APP_STATES.SOLICITUD.COMPLETADA]: {
    label: 'Completada',
    description: 'Solicitud procesada exitosamente',
    color: 'green',
    bgColor: 'bg-green-100',
    borderColor: 'border-green-200',
    textColor: 'text-green-800',
    icon: 'CheckCircle',
    priority: 5
  },

  [APP_STATES.SOLICITUD.CANCELADA]: {
    label: 'Cancelada',
    description: 'Solicitud cancelada por el usuario',
    color: 'gray',
    bgColor: 'bg-gray-100',
    borderColor: 'border-gray-200',
    textColor: 'text-gray-800',
    icon: 'XCircle',
    priority: 4
  },

  [APP_STATES.SOLICITUD.RECHAZADA]: {
    label: 'Rechazada',
    description: 'Solicitud rechazada por no cumplir criterios',
    color: 'red',
    bgColor: 'bg-red-100',
    borderColor: 'border-red-200',
    textColor: 'text-red-800',
    icon: 'AlertCircle',
    priority: 3
  },

  // Técnicas
  [APP_STATES.TECNICA.PENDIENTE]: {
    label: 'Pendiente',
    description: 'Técnica en cola de procesamiento',
    color: 'amber',
    bgColor: 'bg-amber-100',
    borderColor: 'border-amber-200',
    textColor: 'text-amber-800',
    icon: 'Clock',
    priority: 2
  },

  [APP_STATES.TECNICA.EN_PROGRESO]: {
    label: 'En Progreso',
    description: 'Técnica siendo ejecutada',
    color: 'blue',
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-800',
    icon: 'PlayCircle',
    priority: 1
  },

  [APP_STATES.TECNICA.COMPLETADA]: {
    label: 'Completada',
    description: 'Técnica finalizada exitosamente',
    color: 'green',
    bgColor: 'bg-green-100',
    borderColor: 'border-green-200',
    textColor: 'text-green-800',
    icon: 'CheckCircle',
    priority: 5
  },

  [APP_STATES.TECNICA.BLOQUEADA]: {
    label: 'Bloqueada',
    description: 'Técnica bloqueada por dependencias',
    color: 'orange',
    bgColor: 'bg-orange-100',
    borderColor: 'border-orange-200',
    textColor: 'text-orange-800',
    icon: 'Lock',
    priority: 2
  },

  [APP_STATES.TECNICA.CANCELADA]: {
    label: 'Cancelada',
    description: 'Técnica cancelada por el usuario',
    color: 'gray',
    bgColor: 'bg-gray-100',
    borderColor: 'border-gray-200',
    textColor: 'text-gray-800',
    icon: 'XCircle',
    priority: 4
  },

  // Estados de Muestras
  [APP_STATES.MUESTRA.RECIBIDA]: {
    label: 'Recibida',
    description: 'Muestra recibida y registrada',
    color: 'green',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    textColor: 'text-green-700',
    icon: 'Package',
    priority: 2
  },

  [APP_STATES.MUESTRA.EN_PROCESAMIENTO]: {
    label: 'En Procesamiento',
    description: 'Muestra siendo procesada',
    color: 'blue',
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-800',
    icon: 'Zap',
    priority: 1
  },

  [APP_STATES.MUESTRA.PROCESADA]: {
    label: 'Procesada',
    description: 'Muestra procesada completamente',
    color: 'green',
    bgColor: 'bg-green-100',
    borderColor: 'border-green-200',
    textColor: 'text-green-800',
    icon: 'CheckSquare',
    priority: 5
  },

  [APP_STATES.MUESTRA.RECHAZADA]: {
    label: 'Rechazada',
    description: 'Muestra rechazada por criterios de calidad',
    color: 'red',
    bgColor: 'bg-red-100',
    borderColor: 'border-red-200',
    textColor: 'text-red-800',
    icon: 'XSquare',
    priority: 3
  },

  [APP_STATES.MUESTRA.CADUCADA]: {
    label: 'Caducada',
    description: 'Muestra caducada o vencida',
    color: 'gray',
    bgColor: 'bg-gray-200',
    borderColor: 'border-gray-300',
    textColor: 'text-gray-700',
    icon: 'Calendar',
    priority: 4
  },

  // Estados de Usuarios
  [APP_STATES.USUARIO.ACTIVO]: {
    label: 'Activo',
    description: 'Usuario activo en el sistema',
    color: 'green',
    bgColor: 'bg-green-100',
    borderColor: 'border-green-200',
    textColor: 'text-green-800',
    icon: 'UserCheck',
    priority: 1
  },

  [APP_STATES.USUARIO.INACTIVO]: {
    label: 'Inactivo',
    description: 'Usuario temporalmente inactivo',
    color: 'yellow',
    bgColor: 'bg-yellow-100',
    borderColor: 'border-yellow-200',
    textColor: 'text-yellow-800',
    icon: 'UserMinus',
    priority: 3
  },

  [APP_STATES.USUARIO.SUSPENDIDO]: {
    label: 'Suspendido',
    description: 'Usuario suspendido temporalmente',
    color: 'orange',
    bgColor: 'bg-orange-100',
    borderColor: 'border-orange-200',
    textColor: 'text-orange-800',
    icon: 'UserX',
    priority: 2
  },

  [APP_STATES.USUARIO.BLOQUEADO]: {
    label: 'Bloqueado',
    description: 'Usuario bloqueado permanentemente',
    color: 'red',
    bgColor: 'bg-red-100',
    borderColor: 'border-red-200',
    textColor: 'text-red-800',
    icon: 'Shield',
    priority: 1
  },

  // Estados del sistema
  [APP_STATES.SISTEMA.LOADING]: {
    label: 'Cargando',
    description: 'Operación en progreso',
    color: 'blue',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-100',
    textColor: 'text-blue-600',
    icon: 'Loader2',
    priority: 1
  },

  [APP_STATES.SISTEMA.SUCCESS]: {
    label: 'Éxito',
    description: 'Operación completada exitosamente',
    color: 'green',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    textColor: 'text-green-600',
    icon: 'CheckCircle',
    priority: 5
  },

  [APP_STATES.SISTEMA.ERROR]: {
    label: 'Error',
    description: 'Ha ocurrido un error',
    color: 'red',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    textColor: 'text-red-600',
    icon: 'AlertTriangle',
    priority: 1
  },

  [APP_STATES.SISTEMA.IDLE]: {
    label: 'Inactivo',
    description: 'Sistema en estado de reposo',
    color: 'gray',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    textColor: 'text-gray-500',
    icon: 'Pause',
    priority: 4
  },

  [APP_STATES.SISTEMA.EMPTY]: {
    label: 'Sin Datos',
    description: 'No hay información disponible',
    color: 'gray',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    textColor: 'text-gray-500',
    icon: 'Inbox',
    priority: 3
  }
}

// ================================
// TRANSICIONES VÁLIDAS ENTRE ESTADOS
// ================================

export const ESTADO_TRANSICIONES: Record<string, string[]> = {
  // Flujos de Solicitudes
  [APP_STATES.SOLICITUD.PENDIENTE]: [
    APP_STATES.SOLICITUD.EN_PROCESO,
    APP_STATES.SOLICITUD.CANCELADA,
    APP_STATES.SOLICITUD.RECHAZADA
  ],

  [APP_STATES.SOLICITUD.EN_PROCESO]: [
    APP_STATES.SOLICITUD.COMPLETADA,
    APP_STATES.SOLICITUD.CANCELADA
  ],

  [APP_STATES.SOLICITUD.CANCELADA]: [
    APP_STATES.SOLICITUD.PENDIENTE // Permitir reactivar
  ],

  [APP_STATES.SOLICITUD.COMPLETADA]: [], // Estado final
  [APP_STATES.SOLICITUD.RECHAZADA]: [], // Estado final

  // Flujos de Técnicas
  [APP_STATES.TECNICA.PENDIENTE]: [
    APP_STATES.TECNICA.EN_PROGRESO,
    APP_STATES.TECNICA.CANCELADA,
    APP_STATES.TECNICA.BLOQUEADA
  ],

  [APP_STATES.TECNICA.EN_PROGRESO]: [APP_STATES.TECNICA.COMPLETADA, APP_STATES.TECNICA.CANCELADA],

  [APP_STATES.TECNICA.BLOQUEADA]: [APP_STATES.TECNICA.PENDIENTE, APP_STATES.TECNICA.CANCELADA],

  [APP_STATES.TECNICA.COMPLETADA]: [], // Estado final
  [APP_STATES.TECNICA.CANCELADA]: [] // Estado final
}

// ================================
// HELPERS PARA VALIDACIÓN
// ================================

/**
 * Valida si una transición de estado es válida
 */
export const esTransicionValida = (estadoActual: string, nuevoEstado: string): boolean => {
  const transicionesPermitidas = ESTADO_TRANSICIONES[estadoActual] || []
  return transicionesPermitidas.includes(nuevoEstado)
}

/**
 * Obtiene los próximos estados válidos desde un estado actual
 */
export const getEstadosPermitidos = (estadoActual: string): string[] => {
  return ESTADO_TRANSICIONES[estadoActual] || []
}

/**
 * Verifica si un estado es final (no tiene transiciones salientes)
 */
export const esEstadoFinal = (estado: string): boolean => {
  const transiciones = ESTADO_TRANSICIONES[estado] || []
  return transiciones.length === 0
}
