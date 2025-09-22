/**
 * Utilidades para trabajar con estados y sus configuraciones
 */
import { ESTADOS_CONFIG } from '../constants/appStates'

/**
 * Obtiene el label legible de un estado
 */
export const getEstadoLabel = (estado: string): string => {
  const config = ESTADOS_CONFIG[estado]
  return config?.label || estado
}

/**
 * Obtiene la configuración completa de un estado
 */
export const getEstadoConfig = (estado: string) => {
  return ESTADOS_CONFIG[estado]
}

/**
 * Genera opciones para SelectFilter basadas en una lista de estados
 */
export const getEstadoOptions = (estados: string[]) => {
  return estados.map(estado => ({
    value: estado,
    label: getEstadoLabel(estado)
  }))
}

/**
 * Obtiene todos los estados de un tipo específico con sus labels
 */
export const getEstadosByType = (estados: Record<string, string>) => {
  return Object.values(estados).map(estado => ({
    value: estado,
    label: getEstadoLabel(estado)
  }))
}

/**
 * Obtiene solo estados específicos con sus labels (útil para filtros personalizados)
 */
export const getSelectedEstadoOptions = (estadosSeleccionados: string[]) => {
  return estadosSeleccionados.map(estado => ({
    value: estado,
    label: getEstadoLabel(estado)
  }))
}

/**
 * Crea un mapa de valor -> label para búsquedas rápidas
 */
export const getEstadoLabelMap = (estados: string[]) => {
  const map: Record<string, string> = {}
  estados.forEach(estado => {
    map[estado] = getEstadoLabel(estado)
  })
  return map
}
