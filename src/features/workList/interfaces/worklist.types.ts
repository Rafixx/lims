export interface Worklist {
  id_worklist: number
  nombre: string
  id_tecnica_proc?: number
  create_dt: string
  delete_dt?: string
  update_dt: string
  created_by?: number
  updated_by?: number
  tecnicas: Tecnica[]
  tecnica_proc?: TecnicaProc
}

export interface Tecnica {
  estado: string
  muestra: {
    codigo_epi: string
    codigo_externo: string
  }
}

export interface TecnicaProc {
  tecnica_proc: string
}
