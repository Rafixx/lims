import { SolicitudFormValues } from './form.types'

export const defaultMuestra: SolicitudFormValues['muestra'][0] = {
  id_paciente: 0,
  id_tipo_muestra: 0,
  id_ubicacion: 0,
  f_toma: '',
  f_recepcion: '',
  f_destruccion: '',
  f_devolucion: '',
  tecnicas: []
}

export const EMPTY_FORM_VALUES: SolicitudFormValues = {
  id_cliente: 0,
  id_prueba: 0,
  id_centro_externo: 0,
  id_criterio_val: 0,
  num_solicitud: '',
  id_tecnico_resp: 0,
  condiciones_envio: '',
  tiempo_hielo: '',
  f_entrada: '',
  f_compromiso: '',
  f_entrega: '',
  f_resultado: '',
  muestra: [defaultMuestra]
}

export const createEmptyFormValues = (): SolicitudFormValues => ({
  ...EMPTY_FORM_VALUES,
  f_entrada: new Date().toISOString(),
  muestra: []
})
