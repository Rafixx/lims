import { SolicitudFormValues } from './form.types'

export const defaultMuestra: SolicitudFormValues['muestra'][0] = {
  // codigo_epi: '',
  // codigo_externo: '',
  // id_paciente: 0,
  // id_tipo_muestra: 0,
  // id_ubicacion: 0,
  // id_centro_externo: 0,
  // id_criterio_val: 0,
  // id_tecnico_resp: 0,
  // f_toma: '',
  // condiciones_envio: '',
  // tiempo_hielo: '',
  // f_recepcion: '',
  // f_destruccion: '',
  // f_devolucion: '',
  // tecnicas: []
  id_prueba: 1,
  codigo_epi: 'EPI_01',
  codigo_externo: 'EXT_01',
  id_paciente: 1,
  id_tipo_muestra: 1,
  id_centro_externo: 1,
  id_criterio_val: 1,
  id_ubicacion: 1,
  id_tecnico_resp: 1,
  f_toma: '2025-05-01',
  f_recepcion: '2025-05-02',
  f_destruccion: '2025-05-03',
  f_devolucion: '2025-05-04',
  tecnicas: []
}

export const EMPTY_FORM_VALUES: SolicitudFormValues = {
  // id_cliente: 0,
  // id_prueba: 0,
  // id_centro_externo: 0,
  // id_criterio_val: 0,
  // num_solicitud: '',
  // condiciones_envio: '',
  // tiempo_hielo: '',
  // f_entrada: '',
  // f_compromiso: '',
  // f_entrega: '',
  // f_resultado: '',
  // muestra: [defaultMuestra]
  num_solicitud: 'AUTO_01',
  id_cliente: 1,
  id_centro_externo: 1,
  id_criterio_val: 1,
  condiciones_envio: 'Condiciones 1',
  tiempo_hielo: 'Tiempo 1',
  f_entrada: '2025-05-01',
  f_compromiso: '2025-05-02',
  f_entrega: '2025-05-03',
  f_resultado: '2025-05-04',
  muestra: [defaultMuestra]
}

export const createEmptyFormValues = (): SolicitudFormValues => ({
  ...EMPTY_FORM_VALUES,
  f_entrada: new Date().toISOString(),
  muestra: []
})
