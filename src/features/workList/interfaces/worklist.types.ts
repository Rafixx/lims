// src/features/workList/interfaces/worklist.types.ts

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
}

export interface TecnicaPendiente {
  id_tecnica: number
  id_muestra: number
  id_tecnica_proc: number
  id_tecnico_resp: number | null
  fecha_inicio_tec: string | null
  estado: 'PENDIENTE' | 'EN_PROGRESO' | 'COMPLETADA' | 'CANCELADA'
  fecha_estado: string
  comentarios: string | null
  created_by: number
  updated_by: number | null
  tecnica_proc?: TecnicaProc
}

export interface TecnicaConProceso extends TecnicaPendiente {
  tecnica_proc: TecnicaProc
}

export interface TecnicaAgrupada {
  id_tecnica_proc: number
  tecnica_proc: string
  cantidad: number
  proceso?: TecnicaProc
}

// Interfaz para los datos que llegan del backend (formato diferente)
export interface TecnicaAgrupadaBackend {
  id_tecnica_proc: number
  tecnica_proc: string
  count: string // El backend envía esto como string
}

export interface ProcesoInfo {
  id_tecnica_proc: number
  tecnica_proc: string
  total_tecnicas: number
}

export interface WorklistStats {
  total_tecnicas_pendientes: number
  total_procesos: number
  total_tecnicas_en_progreso: number
  total_tecnicas_completadas_hoy: number
  promedio_tiempo_procesamiento: number | null
}

export interface TecnicoPorProceso {
  id_tecnica_proc: number
  tecnicas: TecnicaPendiente[]
}

export interface AsignacionTecnico {
  id_tecnica: number
  id_tecnico_resp: number
}

export interface MuestraDetalle {
  id_muestra: number
  nombre_paciente: string
  fecha_creacion: string
  fecha_extraccion: string | null
  tipo_muestra: string
  comentarios: string | null
  codigo_solicitud: string
  id_solicitud: number
}

export interface TecnicaConMuestra extends TecnicaPendiente {
  muestra: MuestraDetalle
}
