import { Muestra } from '../interfaces/muestras.types'

/**
 * Transforma los valores del formulario de muestra en un payload listo para la API.
 *
 * El formulario usa objetos anidados (e.g. tipo_muestra.id) para los EntitySelect,
 * pero el backend espera campos escalares de FK (e.g. id_tipo_muestra).
 * Esta función extrae esos IDs y los expone al nivel raíz del payload.
 */
export const buildMuestraPayload = (
  data: Muestra
): Muestra & {
  id_tipo_muestra?: number
  id_prueba?: number
  id_centro?: number
  id_criterio_validacion?: number
  id_ubicacion?: number
  id_tecnico_resp?: number
  id_solicitud_cliente?: number
} => {
  return {
    ...data,
    id_tipo_muestra: data.tipo_muestra?.id || undefined,
    id_prueba: data.prueba?.id || undefined,
    id_centro: data.centro?.id || undefined,
    id_criterio_validacion: data.criterio_validacion?.id || undefined,
    id_ubicacion: data.ubicacion?.id || undefined,
    // El técnico responsable usa id_usuario como clave primaria
    id_tecnico_resp: data.tecnico_resp?.id_usuario || undefined,
    // El cliente está anidado en solicitud
    id_solicitud_cliente: data.solicitud?.cliente?.id || undefined
  }
}
