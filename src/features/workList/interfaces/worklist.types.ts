import { Resultado } from '@/features/muestras/interfaces/muestras.types'

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
  estado?: string
  muestra?: {
    codigo_epi: string
    codigo_externo: string
  }
  tecnico_resp?: {
    nombre: string
  }
  resultados?: Resultado
}

export interface TecnicaProc {
  tecnica_proc: string
}
