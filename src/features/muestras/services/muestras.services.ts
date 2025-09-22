import { apiClient } from '@/shared/services/apiClient'
import { Muestra, MuestraWithTecnicas, Tecnica, MuestraStats } from '../interfaces/muestras.types'

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

  async createMuestra(data: Muestra): Promise<Muestra> {
    const response = await apiClient.post<Muestra>(this.basePath, data)
    return response.data
  }

  async updateMuestra(id: number, data: Muestra): Promise<Muestra> {
    const response = await apiClient.put<Muestra>(`${this.basePath}/${id}`, data)
    return response.data
  }

  async deleteMuestra(id: number): Promise<void> {
    await apiClient.delete(`${this.basePath}/${id}`)
  }
}

export const muestrasService = new MuestrasService()
export default muestrasService
