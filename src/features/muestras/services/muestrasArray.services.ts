import { apiClient } from '@/shared/services/apiClient'
import { MuestraArray } from '../interfaces/muestras.types'

interface CreateMuestraArrayDTO {
  codigo_placa: string
  tipo_placa: number
}

class MuestrasArrayService {
  private readonly basePath = '/muestras'

  async getArrayByMuestra(id: number): Promise<MuestraArray[]> {
    const response = await apiClient.get<MuestraArray[]>(`${this.basePath}/${id}/array`)
    return response.data
  }

  async createMuestra(data: CreateMuestraArrayDTO): Promise<MuestraArray> {
    const response = await apiClient.post<MuestraArray>(this.basePath, data)
    return response.data
  }

  async updateMuestra(id_muestra: number, data: CreateMuestraArrayDTO): Promise<MuestraArray> {
    const response = await apiClient.put<MuestraArray>(`${this.basePath}/${id_muestra}`, data)
    return response.data
  }

  async deleteMuestra(id_muestra: number): Promise<void> {
    await apiClient.delete(`${this.basePath}/${id_muestra}`)
  }
}

export const muestrasArrayService = new MuestrasArrayService()
export default muestrasArrayService
