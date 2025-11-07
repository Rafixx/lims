// src/features/tecnicasReactivos/services/tecnicaReactivoService.ts

import { apiClient } from '@/shared/services/apiClient'
import type {
  WorklistTecnicasReactivos,
  CreateTecnicaReactivoData,
  UpdateTecnicaReactivoData,
  BatchUpdateItem,
  BatchUpdateResponse,
  WorklistTecnicasReactivosOptimizado
} from '../interfaces/tecnicaReactivo.types'

class TecnicaReactivoService {
  /**
   * Obtener técnicas con reactivos por worklist ID (ENDPOINT OPTIMIZADO)
   */
  async getWorklistTecnicasReactivosOptimizado(
    worklistId: number
  ): Promise<WorklistTecnicasReactivosOptimizado> {
    console.log('🌐 [Service] GET /api/worklists/:id/tecnicas-reactivos (optimizado)')
    const response = await apiClient.get<WorklistTecnicasReactivosOptimizado>(
      `/worklists/${worklistId}/tecnicas-reactivos`
    )
    console.log('✅ [Service] Response optimizada:', response.data)
    return response.data
  }

  /**
   * Obtener técnicas con reactivos por worklist ID (ENDPOINT LEGACY)
   * @deprecated Usar getWorklistTecnicasReactivosOptimizado en su lugar
   */
  async getWorklistTecnicasReactivos(worklistId: number): Promise<WorklistTecnicasReactivos> {
    const response = await apiClient.get<WorklistTecnicasReactivos>(
      `/worklists/tecnicasReactivos/${worklistId}`
    )
    return response.data
  }

  /**
   * Crear nueva relación técnica-reactivo
   */
  async createTecnicaReactivo(data: CreateTecnicaReactivoData) {
    const response = await apiClient.post('/tecnicasReactivos', data)
    return response.data
  }

  /**
   * Actualizar relación técnica-reactivo
   */
  async updateTecnicaReactivo(id: number, data: UpdateTecnicaReactivoData) {
    const response = await apiClient.put(`/tecnicasReactivos/${id}`, data)
    return response.data
  }

  /**
   * Batch Update/Create de lotes y volúmenes (NUEVO ENDPOINT)
   */
  async batchUpsertLotes(updates: BatchUpdateItem[]): Promise<BatchUpdateResponse> {
    console.log('🌐 [Service] PATCH /api/tecnicasReactivos/batch', {
      totalUpdates: updates.length,
      updates
    })

    const response = await apiClient.patch<BatchUpdateResponse>('/tecnicasReactivos/batch', {
      updates
    })

    console.log('✅ [Service] Batch Response:', {
      success: response.data.success,
      updated: response.data.updated,
      created: response.data.created,
      failed: response.data.failed
    })

    return response.data
  }

  /**
   * Actualizar o crear lote y volumen para un reactivo en una técnica
   * @deprecated Usar batchUpsertLotes para mejor performance
   */
  async upsertLoteVolumen(
    idTecnica: number,
    idReactivo: number,
    idTecnicaReactivo: number | undefined,
    data: UpdateTecnicaReactivoData
  ) {
    console.log('🌐 [Service] Upsert lote/volumen:', {
      idTecnica,
      idReactivo,
      idTecnicaReactivo,
      lote: data.lote,
      volumen: data.volumen
    })

    // Si tenemos el ID de la relación, hacemos UPDATE
    if (idTecnicaReactivo) {
      console.log(`🌐 [Service] UPDATE (PUT) /api/tecnicasReactivos/${idTecnicaReactivo}`, data)
      const response = await apiClient.put(`/tecnicasReactivos/${idTecnicaReactivo}`, data)
      console.log('✅ [Service] UPDATE Response:', response.data)
      return response.data
    }

    // Si no tenemos el ID, hacemos CREATE
    const createData: CreateTecnicaReactivoData = {
      id_tecnica: idTecnica,
      id_reactivo: idReactivo,
      lote: data.lote,
      volumen: data.volumen,
      created_by: data.updated_by
    }

    console.log('🌐 [Service] CREATE (POST) /api/tecnicasReactivos', createData)
    const response = await apiClient.post('/tecnicasReactivos', createData)
    console.log('✅ [Service] CREATE Response:', response.data)

    return response.data
  }

  /**
   * Eliminar relación técnica-reactivo (soft delete)
   */
  async deleteTecnicaReactivo(id: number) {
    const response = await apiClient.delete(`/tecnicasReactivos/${id}`)
    return response.data
  }
}

export const tecnicaReactivoService = new TecnicaReactivoService()
