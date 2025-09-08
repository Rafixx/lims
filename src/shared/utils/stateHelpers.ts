/**
 * Helper utilities para el manejo centralizado de estados
 * Proporciona funciones de alto nivel para trabajar con estados de manera consistente
 */

import {
  APP_STATES,
  ESTADOS_CONFIG,
  ESTADO_TRANSICIONES,
  type AppEstado,
  type EstadoConfig
} from '../constants/appStates'

// ================================
// HELPERS DE CONFIGURACIÓN
// ================================

/**
 * Obtiene la configuración visual completa de un estado
 */
export const getEstadoConfig = (estado: AppEstado): EstadoConfig => {
  const config = ESTADOS_CONFIG[estado]
  if (!config) {
    console.warn(`⚠️  Estado no encontrado: ${estado}. Usando configuración por defecto.`)
    return {
      label: estado,
      description: 'Estado no definido',
      color: 'gray',
      bgColor: 'bg-gray-100',
      borderColor: 'border-gray-200',
      textColor: 'text-gray-800',
      priority: 999
    }
  }
  return config
}

/**
 * Obtiene solo el label de un estado
 */
export const getEstadoLabel = (estado: AppEstado): string => {
  return getEstadoConfig(estado).label
}

/**
 * Obtiene las clases CSS de un estado para badges/pills
 */
export const getEstadoClasses = (estado: AppEstado): string => {
  const config = getEstadoConfig(estado)
  return `${config.bgColor} ${config.textColor} ${config.borderColor}`
}

/**
 * Obtiene las clases CSS completas para un badge con estilos adicionales
 */
export const getEstadoBadgeClasses = (
  estado: AppEstado,
  size: 'sm' | 'md' | 'lg' = 'md'
): string => {
  const baseClasses = getEstadoClasses(estado)
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  }

  return `inline-flex items-center gap-1 rounded-full border font-medium ${baseClasses} ${sizeClasses[size]}`
}

// ================================
// HELPERS DE TRANSICIONES
// ================================

/**
 * Valida si una transición de estado es válida
 */
export const esTransicionValida = (estadoActual: AppEstado, nuevoEstado: AppEstado): boolean => {
  const transicionesPermitidas = ESTADO_TRANSICIONES[estadoActual] || []
  return transicionesPermitidas.includes(nuevoEstado)
}

/**
 * Obtiene los próximos estados válidos desde un estado actual
 */
export const getEstadosPermitidos = (estadoActual: AppEstado): AppEstado[] => {
  return (ESTADO_TRANSICIONES[estadoActual] || []) as AppEstado[]
}

/**
 * Verifica si un estado es final (no tiene transiciones salientes)
 */
export const esEstadoFinal = (estado: AppEstado): boolean => {
  const transiciones = ESTADO_TRANSICIONES[estado] || []
  return transiciones.length === 0
}

/**
 * Obtiene información completa de transiciones con sus configuraciones
 */
export const getTransicionesConConfig = (estadoActual: AppEstado) => {
  const estadosPermitidos = getEstadosPermitidos(estadoActual)
  return estadosPermitidos.map(estado => ({
    estado,
    config: getEstadoConfig(estado as AppEstado)
  }))
}

// ================================
// HELPERS DE ORDENACIÓN
// ================================

/**
 * Ordena una lista de estados por prioridad (más urgente primero)
 */
export const ordenarPorPrioridad = (estados: AppEstado[]): AppEstado[] => {
  return estados.sort((a, b) => {
    const prioridadA = getEstadoConfig(a).priority
    const prioridadB = getEstadoConfig(b).priority
    return prioridadA - prioridadB
  })
}

/**
 * Filtra y ordena elementos por estado y prioridad
 */
export const filtrarYOrdenarPorEstado = <T>(
  items: T[],
  getEstado: (item: T) => AppEstado,
  estadosFiltro?: AppEstado[]
): T[] => {
  let filtrados = items

  // Filtrar por estados si se especificaron
  if (estadosFiltro && estadosFiltro.length > 0) {
    filtrados = items.filter(item => estadosFiltro.includes(getEstado(item)))
  }

  // Ordenar por prioridad
  return filtrados.sort((a, b) => {
    const estadoA = getEstado(a)
    const estadoB = getEstado(b)
    const prioridadA = getEstadoConfig(estadoA).priority
    const prioridadB = getEstadoConfig(estadoB).priority
    return prioridadA - prioridadB
  })
}

// ================================
// HELPERS DE VALIDACIÓN
// ================================

/**
 * Valida si un string corresponde a un estado válido
 */
export const esEstadoValido = (estado: string): estado is AppEstado => {
  return Object.values(APP_STATES).some(categoriaEstados =>
    Object.values(categoriaEstados).includes(estado as AppEstado)
  )
}

/**
 * Convierte un string a AppEstado con validación
 */
export const toAppEstado = (estado: string): AppEstado | null => {
  if (esEstadoValido(estado)) {
    return estado as AppEstado
  }
  console.warn(`⚠️  Estado inválido: ${estado}`)
  return null
}

// ================================
// HELPERS DE MÉTRICAS
// ================================

/**
 * Cuenta elementos por estado
 */
export const contarPorEstado = <T>(
  items: T[],
  getEstado: (item: T) => AppEstado
): Record<string, number> => {
  const conteos: Record<string, number> = {}

  items.forEach(item => {
    const estado = getEstado(item)
    conteos[estado] = (conteos[estado] || 0) + 1
  })

  return conteos
}

/**
 * Calcula estadísticas de estados con configuración
 */
export const getEstadisticasEstados = <T>(items: T[], getEstado: (item: T) => AppEstado) => {
  const conteos = contarPorEstado(items, getEstado)

  return Object.entries(conteos)
    .map(([estado, cantidad]) => ({
      estado: estado as AppEstado,
      cantidad,
      config: getEstadoConfig(estado as AppEstado),
      porcentaje: Math.round((cantidad / items.length) * 100)
    }))
    .sort((a, b) => a.config.priority - b.config.priority)
}

// ================================
// HELPERS DE COMPARACIÓN
// ================================

/**
 * Compara dos estados y devuelve si el primero tiene mayor prioridad
 */
export const tieneMayorPrioridad = (estadoA: AppEstado, estadoB: AppEstado): boolean => {
  const prioridadA = getEstadoConfig(estadoA).priority
  const prioridadB = getEstadoConfig(estadoB).priority
  return prioridadA < prioridadB // Menor número = mayor prioridad
}

/**
 * Encuentra el estado de mayor prioridad en una lista
 */
export const getEstadoPrioritario = (estados: AppEstado[]): AppEstado | null => {
  if (estados.length === 0) return null

  return estados.reduce((estadoPrioritario, estadoActual) =>
    tieneMayorPrioridad(estadoActual, estadoPrioritario) ? estadoActual : estadoPrioritario
  )
}
