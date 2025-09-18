// src/features/workList/interfaces/worklist.types.ts

import type { TecnicaEstado } from '@/shared/states'

// ==========================================
// TIPOS LEGACY (para compatibilidad con componentes existentes)
// ==========================================

export interface TecnicaConMuestra {
  id: number
  nombre: string
  codigo: string
  muestras: unknown[]
  estado: string
  tecnico_asignado?: string
}

export interface TecnicaAgrupada {
  proceso: string
  codigo_proceso: string
  tecnicas: TecnicaConMuestra[]
  total_muestras: number
  completadas: number
  pendientes: number
  estado: string
}

export interface TecnicaAgrupadaBackend {
  proceso: string
  codigo_proceso: string
  tecnicas: TecnicaConMuestra[]
  total_muestras: number
  completadas: number
  pendientes: number
  estado: string
}

export interface TecnicaPendiente {
  id: number
  nombre: string
  codigo: string
  proceso: string
  estado: string
  total_muestras: number
  completadas: number
  pendientes: number
}

export interface TecnicaConProceso extends TecnicaPendiente {
  codigo_proceso: string
}

export interface WorklistStats {
  total_tecnicas: number
  tecnicas_pendientes: number
  tecnicas_en_proceso: number
  tecnicas_completadas: number
  total_muestras: number
  muestras_pendientes: number
  muestras_completadas: number
}

export interface ProcesoInfo {
  codigo: string
  nombre: string
  tecnicas_count: number
  muestras_count: number
  estado: string
}

export interface AsignacionTecnico {
  tecnica_id: number
  tecnico_id: string
  fecha_asignacion?: string
}

export interface EstadisticasWorklist {
  total_worklists: number
  completadas: number
  en_proceso: number
  pendientes: number
  total_tecnicas: number
  tecnicas_sin_asignar: number
}

// ================================
// TIPOS PRINCIPALES DE WORKLIST
// ================================

/**
 * Entidad Worklist principal
 */
export interface Worklist {
  id_worklist: number
  nombre: string
  id_tecnica_proc?: number
  create_dt: string
  delete_dt?: string
  update_dt: string
  created_by?: number
  updated_by?: number
  tecnicas: TecnicaWorklist[]
  // Campos adicionales calculados
  total_tecnicas?: number
  tecnicas_completadas?: number
  tecnica_proc?: {
    tecnica_proc: string
  }
}

/**
 * Técnica asociada a un worklist
 */
export interface TecnicaWorklist {
  id: number
  codigo: string
  estado: TecnicaEstado
  id_worklist?: number
  proceso_nombre: string
  dim_tecnicas_proc: string
  muestra: {
    codigo_epi: string
    codigo_externo: string
    paciente_nombre: string
    fecha_recepcion: string
    paciente: { nombre: string }
  }
  fecha_estado: string
  prioridad: number
  tiempo_estimado?: number
  tecnico_asignado?: {
    id: number
    nombre: string
  }
}

/**
 * Técnica sin asignar a ningún worklist
 */
export interface TecnicaSinAsignar {
  id: number
  codigo: string
  estado: TecnicaEstado
  proceso_nombre: string
  dim_tecnicas_proc: string
  muestra_codigo: string
  paciente_nombre: string
  fecha_creacion: string
  prioridad: number
}

/**
 * Información de proceso de técnicas
 */
export interface DimTecnicasProc {
  dim_tecnicas_proc: string
  descripcion?: string
  tecnica_proc?: string
  total_tecnicas_disponibles: number
}

/**
 * Request para crear nuevo worklist
 */
export interface CreateWorklistRequest {
  nombre: string
  dim_tecnicas_proc: string
  tecnicas_seleccionadas: number[]
}

/**
 * Request para asignar técnicas a worklist
 */
export interface AsignarTecnicasRequest {
  tecnicas_ids: number[]
}

/**
 * Request para remover técnicas de worklist
 */
export interface RemoverTecnicasRequest {
  tecnicas_ids: number[]
}

/**
 * Estadísticas de un worklist específico
 */
export interface WorklistEstadisticas {
  total_tecnicas: number
  tecnicas_pendientes: number
  tecnicas_en_progreso: number
  tecnicas_completadas: number
  porcentaje_completado: number
  tiempo_promedio_procesamiento?: number
  conteo_por_estado: Record<TecnicaEstado, number>
}

/**
 * Técnicas agrupadas por proceso en un worklist
 */
export interface TecnicasAgrupadasWorklist {
  dim_tecnicas_proc: string
  proceso_nombre: string
  tecnicas: TecnicaWorklist[]
  total: number
  completadas: number
  porcentaje_completado: number
}

/**
 * Información del técnico de laboratorio
 */
export interface TecnicoLab {
  id: number
  nombre: string
  email?: string
  activo: boolean
}

/**
 * Request para asignar técnico a una técnica
 */
export interface AsignarTecnicoRequest {
  id_tecnico: number
}

/**
 * Response estándar de la API
 */
export interface ApiResponse<T = unknown> {
  success: boolean
  data: T
  message: string
  error?: unknown
}

/**
 * Parámetros para filtros de técnicas
 */
export interface FiltrosTecnicas {
  dim_tecnicas_proc?: string
  estado?: TecnicaEstado
  fecha_desde?: string
  fecha_hasta?: string
}

/**
 * Estado de selección para crear worklist
 */
export interface TecnicaSeleccionable extends TecnicaSinAsignar {
  seleccionada: boolean
}
