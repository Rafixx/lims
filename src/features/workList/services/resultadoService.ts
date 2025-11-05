import { apiClient } from '@/shared/services/apiClient'
import { ImportDataResultsResponse, RawNanoDrop, RawQubit } from '../interfaces/worklist.types'

class ResultadoService {
  private readonly workList_basePath = '/worklists'
  private readonly resultados_basePath = '/resultados'

  async setCSVtoRAW(file: File): Promise<ImportDataResultsResponse> {
    const formData = new FormData()
    formData.append('file', file)

    const response = await apiClient.post<ImportDataResultsResponse>(
      `${this.resultados_basePath}/setCSVtoRAW`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )
    return response.data
  }

  async importDataResults(
    id: number,
    type: string,
    mapping?: Record<number, number>
  ): Promise<ImportDataResultsResponse> {
    const response = await apiClient.post<ImportDataResultsResponse>(
      `${this.workList_basePath}/${id}/importDataResults`,
      {
        type,
        mapping
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    return response.data
  }

  async getRawNanodropData(): Promise<RawNanoDrop[]> {
    const response = await apiClient.get<RawNanoDrop[]>(`${this.resultados_basePath}/raw/nanodrop`)
    return response.data
  }

  async getRawQubitData(): Promise<RawQubit[]> {
    const response = await apiClient.get<RawQubit[]>(`${this.resultados_basePath}/raw/qubit`)
    return response.data
  }
}

export const resultadoService = new ResultadoService()
