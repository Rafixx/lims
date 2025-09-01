// src/features/workList/services/worklistService.ts

import { apiClient } from '@/shared/services/apiClient'
import {
  TecnicaPendiente,
  TecnicaAgrupada,
  TecnicaAgrupadaBackend,
  TecnicaConProceso,
  WorklistStats,
  ProcesoInfo,
  AsignacionTecnico,
  TecnicaConMuestra
} from '../interfaces/worklist.types'

export const worklistService = {
  // Obtiene todas las técnicas pendientes
  getTecnicasPendientes: async (): Promise<TecnicaPendiente[]> => {
    const { data } = await apiClient.get('/worklist/tecnicas-pendientes')
    return data.data || []
  },

  // Obtiene técnicas agrupadas por proceso/técnica
  getTecnicasAgrupadasPorProceso: async (): Promise<TecnicaAgrupada[]> => {
    try {
      const { data } = await apiClient.get('/worklist/tecnicas-agrupadas')
      const backendData: TecnicaAgrupadaBackend[] = data.data || []

      // Mapear los datos del backend al formato esperado por la interfaz
      const mappedData: TecnicaAgrupada[] = backendData.map(item => ({
        id_tecnica_proc: item.id_tecnica_proc,
        tecnica_proc: item.tecnica_proc,
        cantidad: parseInt(item.count) || 0,
        // El proceso no viene del backend, se asignará posteriormente o será undefined
        proceso: undefined
      }))

      return mappedData
    } catch (error) {
      console.error('Error fetching tecnicas agrupadas:', error)
      return []
    }
  },

  // Obtiene técnicas pendientes con información del proceso incluida
  getTecnicasPendientesConProceso: async (): Promise<TecnicaConProceso[]> => {
    const { data } = await apiClient.get('/worklist/tecnicas-con-proceso')
    return data.data || []
  },

  // Obtiene estadísticas completas del worklist
  getWorklistStats: async (): Promise<WorklistStats> => {
    try {
      const { data } = await apiClient.get('/worklist/estadisticas')
      const stats = data.data || {}

      // Asegurar que todas las propiedades necesarias existen
      return {
        total_tecnicas_pendientes: stats.total_tecnicas_pendientes || 0,
        total_tecnicas_en_progreso: stats.total_tecnicas_en_progreso || 0,
        total_tecnicas_completadas_hoy: stats.total_tecnicas_completadas_hoy || 0,
        total_procesos: stats.total_procesos || 0,
        promedio_tiempo_procesamiento: stats.promedio_tiempo_procesamiento || null
      }
    } catch (error) {
      console.error('Error getting worklist stats:', error)
      // Valores por defecto en caso de error
      return {
        total_tecnicas_pendientes: 0,
        total_tecnicas_en_progreso: 0,
        total_tecnicas_completadas_hoy: 0,
        total_procesos: 0,
        promedio_tiempo_procesamiento: null
      }
    }
  },

  // Obtiene procesos que tienen técnicas pendientes
  getProcesosPendientes: async (): Promise<ProcesoInfo[]> => {
    const { data } = await apiClient.get('/worklist/procesos-pendientes')
    return data.data || []
  },

  // Obtiene el conteo total de técnicas pendientes
  getConteoTecnicasPendientes: async (): Promise<{ total: number }> => {
    const { data } = await apiClient.get('/worklist/conteo')
    return data.data || { total: 0 }
  },

  // Obtiene técnicas pendientes para un proceso específico
  getTecnicasPendientesPorProceso: async (idTecnicaProc: number): Promise<TecnicaConMuestra[]> => {
    try {
      const { data } = await apiClient.get(`/worklist/proceso/${idTecnicaProc}/tecnicas`)
      // Access the actual data from the response structure
      return Array.isArray(data.data) ? data.data : []
    } catch (error) {
      console.error('Error fetching tecnicas por proceso:', error)
      throw error
    }
  },

  // Valida si existe un proceso específico con técnicas pendientes
  existeProcesoConTecnicasPendientes: async (
    idTecnicaProc: number
  ): Promise<{ existe: boolean }> => {
    const { data } = await apiClient.get(`/worklist/proceso/${idTecnicaProc}/existe`)
    return data.data || { existe: false }
  },

  // Asignar técnico a una técnica específica (asumiendo que existe este endpoint)
  asignarTecnico: async (asignacion: AsignacionTecnico): Promise<void> => {
    await apiClient.patch(`/worklist/tecnica/${asignacion.id_tecnica}/asignar`, {
      id_tecnico_resp: asignacion.id_tecnico_resp
    })
  },

  // Iniciar una técnica (cambiar estado a en_progreso)
  iniciarTecnica: async (idTecnica: number): Promise<void> => {
    await apiClient.patch(`/worklist/tecnica/${idTecnica}/iniciar`)
  },

  // Completar una técnica
  completarTecnica: async (idTecnica: number, comentarios?: string): Promise<void> => {
    await apiClient.patch(`/worklist/tecnica/${idTecnica}/completar`, {
      comentarios
    })
  }
}
