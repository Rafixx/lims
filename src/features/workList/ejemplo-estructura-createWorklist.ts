// Ejemplo de estructura de datos que se enviará al endpoint createWorklist
// Archivo: ejemplo-estructura-createWorklist.json

/**
 * Estructura exacta que se envía al endpoint POST /worklists
 *
 * Coincide con la interfaz CreateWorklistRequest definida en:
 * src/features/workList/interfaces/worklist.types.ts
 */

const ejemploCreateWorklistRequest = {
  nombre: 'Worklist Análisis Sangre',
  id_tecnica_proc: 1,
  created_by: 123, // ID del usuario autenticado (opcional)
  tecnicas: [{ id_tecnica: 456 }, { id_tecnica: 789 }, { id_tecnica: 101 }]
}

/**
 * Mapeo de campos:
 * - nombre: string (requerido) - Nombre del worklist ingresado por el usuario
 * - id_tecnica_proc: number (requerido) - ID del proceso de técnica seleccionado
 * - created_by: number (opcional) - ID del usuario que crea el worklist
 * - tecnicas: array (requerido) - Array de objetos con id_tecnica de las técnicas seleccionadas
 */

export default ejemploCreateWorklistRequest
