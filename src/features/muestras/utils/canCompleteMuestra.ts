import { ESTADO_MUESTRA } from '@/shared/interfaces/estados.types'
import { Muestra } from '../interfaces/muestras.types'

/**
 * Determina si una muestra puede ser marcada como completada.
 * Una muestra no puede completarse si ya está en el estado COMPLETADA (4) o
 * en un estado final equivalente (COMPLETADA_ERROR = 7, RECHAZADA = 5).
 */
export const ESTADOS_FINALES_MUESTRA: ReadonlyArray<number> = [
  ESTADO_MUESTRA.COMPLETADA,
  ESTADO_MUESTRA.COMPLETADA_ERROR,
  ESTADO_MUESTRA.RECHAZADA
]

export const canCompleteMuestra = (muestra: Muestra): boolean => {
  const idEstado = muestra.estadoInfo?.id ?? muestra.id_estado
  if (idEstado === undefined || idEstado === null) return true
  return !ESTADOS_FINALES_MUESTRA.includes(idEstado)
}
