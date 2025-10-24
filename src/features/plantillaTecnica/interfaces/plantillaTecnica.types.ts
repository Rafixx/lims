// src/features/plantillaTecnica/interfaces/plantillaTecnica.types.ts

/**
 * Interfaces para el sistema de Plantilla Técnica
 */

export interface PlantillaTecnica {
  id: number
  cod_plantilla_tecnica: string
  tecnica: string
  dimPipetas: DimPipeta[]
  dimReactivos: DimReactivo[]
  dimMaquinas: DimMaquina[]
}

export interface DimPipeta {
  id: number
  codigo: string
  modelo: string
  zona: string
  activa: boolean
  created_by: number
  update_dt: string
  id_plantilla_tecnica: number
}

export interface DimReactivo {
  id: number
  num_referencia: string
  reactivo: string
  lote: string | null
  volumen_formula: string | null
  activa: boolean
  created_by: number
  update_dt: string
  id_plantilla_tecnica: number
}

export interface DimMaquina {
  id: number
  codigo: string
  modelo: string
  zona: string
  activa: boolean
  created_by: number
  update_dt: string
  id_plantilla_tecnica: number
}

export interface TecnicaProc {
  id: number
  tecnica_proc: string
  orden: number
  obligatoria: boolean
  activa: boolean
  created_by: number
  update_dt: string
  id_prueba: number
  id_plantilla_tecnica: number
  plantillaTecnica: PlantillaTecnica
}

export interface TecnicaDetalle {
  codigo_epi?: string
  codigo_externo?: string
  resultado?: string
}
