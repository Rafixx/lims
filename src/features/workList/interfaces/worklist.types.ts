import { Resultado } from '@/features/muestras/interfaces/muestras.types'
import { DimEstado } from '@/shared/interfaces/estados.types'

export interface Worklist {
  id_worklist: number
  nombre: string
  tecnica_proc?: string
  create_dt: string
  delete_dt?: string
  update_dt: string
  created_by?: number
  updated_by?: number
  tecnicas: Tecnica[]
}

// Estructura específica para crear un worklist
export interface CreateWorklistRequest {
  nombre: string
  tecnica_proc?: string
  created_by: number
  tecnicas: number[]
}

export interface Tecnica {
  id_tecnica?: number
  id_tecnica_proc?: number
  id_estado?: number
  estadoInfo?: DimEstado
  muestra?: {
    codigo_epi: string
    codigo_externo: string
  }
  tecnico_resp?: {
    id_usuario: number
    nombre: string
  }
  resultados?: Resultado
}

export interface TecnicaProc {
  tecnica_proc: string
}
