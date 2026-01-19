import { Resultado } from '@/features/muestras/interfaces/muestras.types'
import { DimEstado } from '@/shared/interfaces/estados.types'

export interface Worklist {
  id_worklist: number
  nombre: string
  tecnica_proc?: string
  id_tecnico_resp?: number
  tecnico_resp?: {
    id_usuario: number
    nombre: string
  }
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
  codigo?: string
  tecnica_proc?: string
  created_by: number
  tecnicas: number[]
}

export interface Tecnica {
  id_tecnica?: number
  id_muestra?: number
  id_tecnica_proc?: number
  tecnica_proc?: {
    id?: number
    tecnica_proc?: string
  }
  id_estado?: number
  estadoInfo?: DimEstado
  muestraArray?: MuestraArray
  muestra?: {
    id_muestra?: number
    codigo_epi: string
    codigo_externo: string
    estudio?: string
  }
  tecnico_resp?: {
    id_usuario: number
    nombre: string
  }
  resultados?: Resultado[]
}

export interface MuestraArray {
  id_muestra: number
  id_array: number
  codigo_placa: string
  posicion_placa: string
}

export interface ManualResultFormValues {
  tipo_res?: string
  valor?: string
  valor_texto?: string
  valor_fecha?: string
  unidades?: string
}

export interface CreateResultadoPayload extends ManualResultFormValues {
  id_muestra: number
  id_tecnica: number
  created_by?: number
}

export interface UpdateResultadoPayload extends ManualResultFormValues {
  updated_by?: number
}

export interface TecnicaProc {
  tecnica_proc: string
}

export interface ImportDataResultsResponse {
  success: boolean
  message: string
  type?: string
}

export interface RawNanoDrop {
  id: number
  fecha: string
  sample_code: string
  an_cant: string
  a260_280: string
  a260_230: string
  a260: string
  a280: string
  an_factor: string
  correcion_lb: string
  absorbancia_lb: string
  corregida: string
  porc_corregido: string
  impureza1: string
  impureza1_a260: string
  impureza1_porc: string
  impureza1_mm: string
  impureza2: string
  impureza2_a260: string
  impureza2_porc: string
  impureza2_mm: string
  impureza3: string
  impureza3_a260: string
  impureza3_porc: string
  impureza3_mm: string
  position: string | null // Posición en la placa para arrays
  createdAt: string
}

export interface RawQubit {
  id: number
  run_id: string | null
  assay_name: string | null
  test_name: string | null
  test_date: string | null
  qubit_tube_conc: string | null
  qubit_units: string | null
  orig_conc: string | null
  orig_conc_units: string | null
  sample_volume_ul: string | null
  dilution_factor: string | null
  std1_rfu: string | null
  std2_rfu: string | null
  std3_rfu: string | null
  excitation: string | null
  emission: string | null
  green_rfu: string | null
  far_red_rfu: string | null
  fecha: string | null
  position: string | null // Posición en la placa para arrays
  createdAt: string
}

// Tipo union para datos RAW
export type RawData = RawNanoDrop | RawQubit

// Tipo para el instrumento
export type InstrumentType = 'NANODROP' | 'QUBIT'

// Interface para las filas mapeables (con estructura común para el modal)
export interface MappableRow {
  id: number
  sampleIdentifier: string // Campo identificador de muestra (sample_code para Nanodrop, test_name para Qubit)
  posicionPlaca?: string // Posición en la placa (para arrays)
  displayData: Record<string, string | null> // Datos adicionales para mostrar en el modal
}

export interface CodigoWorklistResponse {
  codigo_worklist: string
  secuencia: number
  year: number
}
