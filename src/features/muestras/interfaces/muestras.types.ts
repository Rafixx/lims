import { AppEstado } from '@/shared/states'
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

export interface Solicitud {
  id_solicitud: number
  cliente: Cliente | null
  f_creacion?: string
  f_entrada?: string
  f_compromiso?: string
  f_entrega?: string
  f_resultado?: string
  condiciones_envio?: string
  tiempo_hielo?: boolean
}

export interface Muestra {
  id_muestra: number
  paciente?: Paciente | null
  solicitud?: Solicitud | null
  tecnico_resp?: TecnicoLaboratorio | null
  tipo_muestra?: TipoMuestra | null
  centro?: Centro | null
  criterio_validacion?: CriterioValidacion | null
  ubicacion?: Ubicacion | null
  prueba?: Prueba | null

  codigo_epi?: string
  codigo_externo?: string
  f_toma?: string
  f_recepcion?: string
  f_destruccion?: string
  f_devolucion?: string

  estado_muestra: AppEstado
}
export interface MuestraWithTecnicas {
  id_muestra: number
  tecnicas: Tecnica[]
}

export interface Worklist {
  id_worklist: number
  nombre: string
}

export interface Tecnica {
  id_tecnica: number
  fecha_inicio_tec?: string
  estado?: AppEstado
  fecha_estado?: string
  comentarios?: string
  tecnica_proc?: TecnicaProc
  worklist?: Worklist
  tecnico_resp?: TecnicoLaboratorio | null
}

export interface MuestraStats {
  total: number
  pendientes: number
  en_proceso: number
  completadas: number
  vencidas: number
  creadas_hoy: number
  completadas_hoy: number
}
