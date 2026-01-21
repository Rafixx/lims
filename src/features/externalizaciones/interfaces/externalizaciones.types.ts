import { Centro, TecnicaProc, TecnicoLaboratorio } from '@/shared/interfaces/dim_tables.types'
import { DimEstado } from '@/shared/interfaces/estados.types'

export type Externalizacion = {
  id_externalizacion: number
  id_tecnica: number
  volumen?: string | null
  concentracion?: string | null
  servicio?: string | null
  f_envio?: string | null
  f_recepcion?: string | null
  f_recepcion_datos?: string | null
  agencia?: string | null
  observaciones?: string | null
  tecnica?: {
    id_tecnica: number
    id_muestra: number
    fecha_inicio_tec?: string
    id_estado?: number
    fecha_estado?: string
    comentarios?: string
    estadoInfo?: DimEstado | null
    tecnica_proc?: TecnicaProc | null
    muestra?: {
      id_muestra: number
      codigo_epi?: string
      codigo_externo?: string
      estudio?: string
    }
  }
  centro?: Centro | null
  tecnico_resp?: TecnicoLaboratorio | null
}

export type ExternalizacionFormData = Omit<
  Externalizacion,
  'id_externalizacion' | 'tecnica' | 'centro' | 'tecnico_resp'
> & {
  id_centro?: number | null
  id_tecnico_resp?: number | null
}

export type ExternalizacionStats = {
  total: number
  pendientes: number
  recibidas: number
  con_datos: number
}
