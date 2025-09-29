import { Muestra } from './muestras.types'
import { APP_STATES } from '@/shared/states'

export const DEFAULT_MUESTRA: Muestra = {
  id_muestra: 0,
  codigo_epi: '',
  codigo_externo: '',
  f_toma: '2025-09-26T00:00:00.000Z',
  f_recepcion: '2025-09-26T00:00:00.000Z',
  f_destruccion: '2025-09-26T00:00:00.000Z',
  f_devolucion: '2025-09-26T00:00:00.000Z',
  estado_muestra: APP_STATES.MUESTRA.RECIBIDA,
  paciente: {
    id: 0,
    nombre: '',
    sip: '',
    direccion: ''
  },
  solicitud: {
    id_solicitud: 0,
    // id_cliente: 0,
    f_creacion: '2025-09-26T00:00:00.000Z',
    f_entrada: '2025-09-26T00:00:00.000Z',
    f_compromiso: '2025-09-26T00:00:00.000Z',
    f_entrega: '2025-09-26T00:00:00.000Z',
    f_resultado: '2025-09-26T00:00:00.000Z',
    condiciones_envio: 'Condiciones 1',
    tiempo_hielo: 'Tiempo 1',
    cliente: {
      id: 0,
      nombre: '',
      razon_social: '',
      nif: ''
    }
  },
  tecnico_resp: {
    id_usuario: 0,
    nombre: ''
    // email: ''
  },
  tipo_muestra: {
    id: 0,
    cod_tipo_muestra: '',
    tipo_muestra: ''
  },
  centro: {
    id: 0,
    codigo: '',
    descripcion: ''
  },
  criterio_validacion: {
    id: 0,
    codigo: '',
    descripcion: ''
  },
  ubicacion: {
    id: 0,
    codigo: '',
    ubicacion: ''
  },
  prueba: {
    id: 0,
    cod_prueba: '',
    prueba: ''
  }
}

// {
// "id_muestra": 102,
// "codigo_epi": "52_002",
// "codigo_externo": "EXT_01",
// "f_toma": "2025-05-01T00:00:00.000Z",
// "f_recepcion": "2025-05-02T00:00:00.000Z",
// "f_destruccion": "2025-05-03T00:00:00.000Z",
// "f_devolucion": "2025-05-04T00:00:00.000Z",
// "estado_muestra": "RECIBIDA",
// "paciente": {
// "id": 1,
// "nombre": "Paciente Uno Uno",
// "sip": "11223344",
// "direccion": "Calle del paciente"
// },
// "solicitud": {
// "id_solicitud": 52,
// "id_cliente": 1,
// "f_creacion": "2025-05-23T09:18:31.235Z",
// "f_entrada": "2025-05-01T00:00:00.000Z",
// "f_compromiso": "2025-05-02T00:00:00.000Z",
// "f_entrega": "2025-05-03T00:00:00.000Z",
// "f_resultado": "2025-05-04T00:00:00.000Z",
// "condiciones_envio": "Condiciones 1",
// "tiempo_hielo": "Tiempo 1",
// "cliente": {
// "id": 1,
// "nombre": "Cliente número 1",
// "razon_social": "Razón cliente",
// "nif": "11223344"
// }
// },
// "tecnico_resp": {
// "id_usuario": 2,
// "nombre": "Rafa",
// "email": "rafa@lims.com"
// },
// "tipo_muestra": {
// "id": 2,
// "cod_tipo_muestra": "SANGRE001",
// "tipo_muestra": "SANGRE"
// },
// "centro": {
// "id": 2,
// "codigo": "002",
// "descripcion": "HOSPITAL CLINICO UNIVERSITARIO DE VALENCIA"
// },
// "criterio_validacion": {
// "id": 1,
// "codigo": "AZ001",
// "descripcion": "CRITERIO PRIMARIO"
// },
// "ubicacion": {
// "id": 1,
// "codigo": "REF01",
// "ubicacion": "Frigo 0021"
// },
// "prueba": {
// "id": 1,
// "cod_prueba": "SG",
// "prueba": "ScoliGEN"
// }
// }
