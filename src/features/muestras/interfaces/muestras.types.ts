import {
  Paciente,
  Cliente,
  TecnicoLaboratorio,
  TipoMuestra,
  Centro,
  CriterioValidacion,
  Ubicacion,
  Prueba,
  TecnicaProc
} from '@/shared/interfaces/dim_tables.types'
import { DimEstado } from '@/shared/interfaces/estados.types'

export type Solicitud = {
  id_solicitud: number
  cliente: Cliente | null
  f_creacion?: string
  f_entrada?: string
  f_compromiso?: string
  f_entrega?: string
  f_resultado?: string
  condiciones_envio?: string
  tiempo_hielo?: string
}

export type Muestra = {
  id_muestra: number
  paciente?: Paciente | null
  solicitud?: Solicitud | null
  tecnico_resp?: TecnicoLaboratorio | null
  tipo_muestra?: TipoMuestra | null
  centro?: Centro | null
  criterio_validacion?: CriterioValidacion | null
  ubicacion?: Ubicacion | null
  prueba?: Prueba | null
  tipo_array: boolean | null

  codigo_epi?: string
  codigo_externo?: string
  f_toma?: string
  f_recepcion?: string
  f_destruccion?: string
  f_devolucion?: string

  id_estado?: number
  estadoInfo?: DimEstado | null

  // Configuración de array para muestras tipo array
  array_config?: {
    code: string
    width: number
    heightLetter: string
    height: number
    totalPositions: number
  } | null
}

export type MuestraWithTecnicas = {
  id_muestra: number
  tecnicas: Tecnica[]
}

export type MuestraWithArray = {
  id_muestra: number
  array: MuestraArray[]
}

export type MuestraArray = {
  id_array: number
  id_muestra: number
  id_posicion: number
  codigo_placa: string
  posicion_placa: string
  num_array: number
  num_serie: string
  pos_array: string
}

export type Worklist = {
  id_worklist: number
  nombre: string
}

export type Tecnica = {
  id_tecnica: number
  fecha_inicio_tec?: string
  fecha_estado?: string
  comentarios?: string
  muestra: Muestra
  tecnica_proc?: TecnicaProc
  worklist?: Worklist
  tecnico_resp?: TecnicoLaboratorio | null
  resultados?: Resultado[]

  id_estado?: number
  estadoInfo?: DimEstado | null
}

export type MuestraStats = {
  total: number
  pendientes: number
  en_proceso: number
  completadas: number
  vencidas: number
  creadas_hoy: number
  completadas_hoy: number
}

export type Resultado = {
  id_resultado: number
  tipo_res: string
  valor: string | number | null
  valor_texto?: string
  valor_fecha: string | null
  unidades?: string
}

export type EMPTY_MUESTRA_FORM = {
  paciente: null
  solicitud: null
  tecnico_resp: null
  tipo_muestra: null
  centro: null
  criterio_validacion: null
  ubicacion: null
  prueba: null

  codigo_epi: ''
  codigo_externo: ''
  f_toma: ''
  f_recepcion: ''
  f_destruccion: ''
  f_devolucion: ''
}
