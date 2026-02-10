import { apiClient } from '@/shared/services/apiClient'
import {
  CodExternoPar,
  CodigoEpiResponse,
  CreateMuestraResult,
  ImportCodExternoResult,
  Muestra,
  MuestraWithTecnicas,
  Tecnica,
  MuestraStats
} from '../interfaces/muestras.types'

class MuestrasService {
  private readonly basePath = '/muestras'

  async getMuestras(): Promise<Muestra[]> {
    const response = await apiClient.get<Muestra[]>(this.basePath)
    return response.data
  }

  async getMuestra(id: number): Promise<Muestra> {
    const response = await apiClient.get<Muestra>(`${this.basePath}/${id}`)
    return response.data
  }

  async getTecnicasByMuestra(id: number): Promise<Tecnica[]> {
    const response = await apiClient.get<MuestraWithTecnicas>(`${this.basePath}/${id}/tecnicas`)
    return response.data.tecnicas
  }

  async getMuestrasStats(): Promise<MuestraStats> {
    const response = await apiClient.get<MuestraStats>(`${this.basePath}/estadisticas`)
    return response.data
  }

  async createMuestra(data: Muestra): Promise<CreateMuestraResult> {
    const response = await apiClient.post<CreateMuestraResult>(this.basePath, data)
    return response.data
  }

  async updateMuestra(id: number, data: Muestra): Promise<Muestra> {
    const response = await apiClient.put<Muestra>(`${this.basePath}/${id}`, data)
    return response.data
  }

  async deleteMuestra(id: number): Promise<void> {
    await apiClient.delete(`${this.basePath}/${id}`)
  }

  async getNextCodigoEpi(): Promise<CodigoEpiResponse> {
    const response = await apiClient.get<CodigoEpiResponse>(`${this.basePath}/codigo-epi`)
    return response.data
  }

  async importCodExterno(estudio: string, pares: CodExternoPar[]): Promise<ImportCodExternoResult> {
    const response = await apiClient.post<ImportCodExternoResult>(
      `${this.basePath}/estudio/${encodeURIComponent(estudio)}/cod-externo`,
      { pares }
    )
    return response.data
  }
}

export const muestrasService = new MuestrasService()
export default muestrasService
