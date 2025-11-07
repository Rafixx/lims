// src/features/tecnicasReactivos/interfaces/tecnicaReactivo.types.ts

export interface TecnicaReactivo {
  id: number
  id_tecnica: number
  id_reactivo: number
  volumen?: string
  lote?: string
  delete_dt?: string | null
  update_dt: string
  created_by?: number
  updated_by?: number
}

export interface DimReactivo {
  id: number
  num_referencia?: string
  reactivo: string
  lote?: string | null
  volumen_formula?: string
  activa?: boolean
  created_by?: number | null
  update_dt?: string
  id_plantilla_tecnica?: number
  tecnicasReactivos?: Array<{
    id: number
  }>
}

export interface PlantillaTecnica {
  id: number
  cod_plantilla_tecnica?: string
  tecnica?: string
  activa?: boolean
  created_by?: number
  update_dt?: string
  dimReactivos: DimReactivo[]
}

export interface TecnicaProc {
  tecnica_proc: string
  plantillaTecnica?: PlantillaTecnica
}

export interface TecnicaConReactivos {
  id_tecnica: number
  tecnica_proc?: TecnicaProc
  muestra: {
    codigo_epi?: string
    codigo_externo?: string
  }
}

// Tipo para el array que devuelve el backend
export type WorklistTecnicasReactivos = TecnicaConReactivos[]

export interface CreateTecnicaReactivoData {
  id_tecnica: number
  id_reactivo: number
  volumen?: string
  lote?: string
  created_by?: number
}

export interface UpdateTecnicaReactivoData {
  volumen?: string
  lote?: string
  updated_by?: number
}

// Batch Update Types
export interface BatchUpdateItem {
  id?: number // ID de tecnicas_reactivos (para UPDATE)
  id_tecnica?: number // ID de técnica (para CREATE)
  id_reactivo?: number // ID de reactivo (para CREATE)
  lote?: string
  volumen?: string
}

export interface BatchUpdateResult {
  id?: number
  status: 'updated' | 'created' | 'error'
  error?: string
}

export interface BatchUpdateResponse {
  success: boolean
  updated: number
  created: number
  failed: number
  results: BatchUpdateResult[]
}

// Endpoint Optimizado Types
export interface ReactivoOptimizado {
  id: number // ID del reactivo (dim_reactivos)
  idTecnicaReactivo: number // ID de la relación (tecnicas_reactivos)
  nombre: string
  numReferencia?: string
  lote: string | null
  volumen: string | null
  volumenFormula?: string
  loteReactivo?: string
}

export interface TecnicaOptimizada {
  idTecnica: number
  nombreTecnica: string
  idTecnicaProc: number
  muestra: {
    id: number
    codigoEpi?: string
    codigoExterno?: string
  }
  reactivos: ReactivoOptimizado[]
}

export interface WorklistTecnicasReactivosOptimizado {
  worklistId: number
  tecnicas: TecnicaOptimizada[]
  estadisticas: {
    totalTecnicas: number
    totalReactivos: number
    lotesCompletos: number
    lotesPendientes: number
  }
}
