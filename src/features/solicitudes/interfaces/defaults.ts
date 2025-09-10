import { Solicitud, Muestra } from './solicitudes.types'
import { APP_STATES } from '@/shared/states'

export const DEFAULT_MUESTRA: Muestra = {
  id_paciente: 0,
  id_prueba: 0,
  id_tipo_muestra: 0,
  codigo_muestra: '',
  f_toma_muestra: '',
  condiciones_envio: '',
  tiempo_hielo: '',
  observaciones_muestra: '',
  tecnicas: []
}

export const EMPTY_SOLICITUD_FORM: Solicitud = {
  id_cliente: 0,
  estado_solicitud: APP_STATES.SOLICITUD.PENDIENTE,
  f_creacion: new Date().toISOString(),
  f_compromiso: '',
  f_entrega: null,
  observaciones: '',
  muestras: [DEFAULT_MUESTRA]
}
