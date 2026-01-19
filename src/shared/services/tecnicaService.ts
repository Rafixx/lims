// src/shared/services/tecnicaService.ts

import { apiClient } from './apiClient'

interface MarcarResultadoErroneoResponse {
  success: boolean
  message: string
  data: {
    updated: number
    errors?: Array<{
      id_tecnica: number
      error: string
    }>
  }
}

class TecnicaService {
  private readonly basePath = '/tecnicas'

  async marcarResultadoErroneo(
    idsTecnicas: number[],
    idWorklist: number
  ): Promise<MarcarResultadoErroneoResponse> {
    const response = await apiClient.post<MarcarResultadoErroneoResponse>(
      `${this.basePath}/resultado-erroneo`,
      {
        ids_tecnicas: idsTecnicas,
        id_worklist: idWorklist
      }
    )
    return response.data
  }
}

export const tecnicaService = new TecnicaService()
