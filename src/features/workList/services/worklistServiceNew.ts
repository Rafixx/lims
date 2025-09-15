// src/features/workList/services/worklistServiceNew.ts

import { apiClient } from '@/shared/services/apiClient'
import type {
  Worklist,
  TecnicaSinAsignar,
  WorklistEstadisticas,
  TecnicasAgrupadasWorklist,
  CreateWorklistRequest,
  AsignarTecnicasRequest,
  RemoverTecnicasRequest,
  AsignarTecnicoRequest,
  DimTecnicasProc,
  ApiResponse
} from '../interfaces/worklist.types'

// ================================
// SERVICIO DE WORKLIST
// ================================

class WorklistService {
  private readonly basePath = '/worklist'

  // ================================
  // CRUD DE WORKLIST
  // ================================

  /**
   * Crear nuevo worklist
   */
  async crearWorklist(data: CreateWorklistRequest): Promise<Worklist> {
    const response = await apiClient.post<ApiResponse<Worklist>>(this.basePath, data)
    return response.data.data
  }

  /**
   * Obtener todos los worklists
   */
  async obtenerWorklists(): Promise<Worklist[]> {
    const response = await apiClient.get<ApiResponse<Worklist[]>>(this.basePath)
    return response.data.data
  }

  /**
   * Obtener técnicas sin asignar por tipo de proceso
   */
  async obtenerTecnicasSinAsignar(dimTecnicasProc?: string): Promise<TecnicaSinAsignar[]> {
    const params = dimTecnicasProc ? { dim_tecnicas_proc: dimTecnicasProc } : {}
    const response = await apiClient.get<ApiResponse<TecnicaSinAsignar[]>>(
      `${this.basePath}/tecnicas-sin-asignar`,
      { params }
    )
    return response.data.data
  }

  /**
   * Obtener procesos disponibles para crear worklist
   */
  async obtenerProcesosDisponibles(): Promise<DimTecnicasProc[]> {
    const response = await apiClient.get<ApiResponse<DimTecnicasProc[]>>(
      `${this.basePath}/procesos-disponibles`
    )
    return response.data.data
  }

  /**
   * Obtener worklist por ID
   */
  async obtenerWorklistPorId(id: number): Promise<Worklist> {
    const response = await apiClient.get<ApiResponse<Worklist>>(`${this.basePath}/${id}`)
    return response.data.data
  }

  /**
   * Actualizar worklist
   */
  async actualizarWorklist(id: number, data: Partial<Worklist>): Promise<Worklist> {
    const response = await apiClient.put<ApiResponse<Worklist>>(`${this.basePath}/${id}`, data)
    return response.data.data
  }

  /**
   * Eliminar worklist
   */
  async eliminarWorklist(id: number): Promise<void> {
    await apiClient.delete<ApiResponse<void>>(`${this.basePath}/${id}`)
  }

  // ================================
  // OPERACIONES ESPECÍFICAS DE WORKLIST
  // ================================

  /**
   * Asignar técnicas a un worklist
   */
  async asignarTecnicas(id: number, data: AsignarTecnicasRequest): Promise<void> {
    await apiClient.post<ApiResponse<void>>(`${this.basePath}/${id}/asignar-tecnicas`, data)
  }

  /**
   * Remover técnicas de un worklist
   */
  async removerTecnicas(id: number, data: RemoverTecnicasRequest): Promise<void> {
    await apiClient.delete<ApiResponse<void>>(`${this.basePath}/${id}/remover-tecnicas`, { data })
  }

  /**
   * Obtener estadísticas de un worklist
   */
  async obtenerEstadisticas(id: number): Promise<WorklistEstadisticas> {
    const response = await apiClient.get<ApiResponse<WorklistEstadisticas>>(
      `${this.basePath}/${id}/estadisticas`
    )
    return response.data.data
  }

  /**
   * Obtener técnicas agrupadas por proceso de un worklist
   */
  async obtenerTecnicasAgrupadas(id: number): Promise<TecnicasAgrupadasWorklist[]> {
    const response = await apiClient.get<ApiResponse<TecnicasAgrupadasWorklist[]>>(
      `${this.basePath}/${id}/tecnicas-agrupadas`
    )
    return response.data.data
  }

  // ================================
  // DELEGACIÓN DE OPERACIONES DE TÉCNICA
  // ================================

  /**
   * Asignar técnico a una técnica
   */
  async asignarTecnico(idTecnica: number, data: AsignarTecnicoRequest): Promise<void> {
    await apiClient.patch<ApiResponse<void>>(`${this.basePath}/tecnica/${idTecnica}/asignar`, data)
  }

  /**
   * Iniciar técnica
   */
  async iniciarTecnica(idTecnica: number): Promise<void> {
    await apiClient.patch<ApiResponse<void>>(`${this.basePath}/tecnica/${idTecnica}/iniciar`)
  }

  /**
   * Completar técnica
   */
  async completarTecnica(idTecnica: number): Promise<void> {
    await apiClient.patch<ApiResponse<void>>(`${this.basePath}/tecnica/${idTecnica}/completar`)
  }
}

// Exportar instancia singleton
export const worklistServiceNew = new WorklistService()
