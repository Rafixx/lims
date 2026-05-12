// src/features/workList/utils/shouldGenerateCodigo.ts

/**
 * Determina si se debe generar un código de worklist automáticamente.
 *
 * Devuelve true únicamente cuando se selecciona un proceso por primera vez
 * (hay proceso pero aún no hay nombre asignado), evitando así consumir
 * números de secuencia del backend innecesariamente al cambiar de proceso.
 */
export const shouldGenerateCodigo = (procesoNombre: string, nombreActual: string): boolean => {
  return !!procesoNombre && !nombreActual
}
