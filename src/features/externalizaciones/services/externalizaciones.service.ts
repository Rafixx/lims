import { apiClient } from '@/shared/services/apiClient'
import { Externalizacion, ExternalizacionFormData } from '../interfaces/externalizaciones.types'

class ExternalizacionesService {
  private readonly basePath = '/externalizaciones'

  async getExternalizaciones(): Promise<Externalizacion[]> {
    const response = await apiClient.get<{ success: boolean; data: Externalizacion[] }>(
      this.basePath
    )
    return response.data.data
  }

  async getExternalizacionesPendientes(): Promise<Externalizacion[]> {
    const response = await apiClient.get<{ success: boolean; data: Externalizacion[] }>(
      `${this.basePath}/pendientes`
    )
    return response.data.data
  }

  async getExternalizacionesByTecnica(idTecnica: number): Promise<Externalizacion[]> {
    const response = await apiClient.get<{ success: boolean; data: Externalizacion[] }>(
      `${this.basePath}/tecnica/${idTecnica}`
    )
    return response.data.data
  }

  async getExternalizacionesByCentro(idCentro: number): Promise<Externalizacion[]> {
    const response = await apiClient.get<{ success: boolean; data: Externalizacion[] }>(
      `${this.basePath}/centro/${idCentro}`
    )
    return response.data.data
  }

  async getExternalizacion(id: number): Promise<Externalizacion> {
    const response = await apiClient.get<{ success: boolean; data: Externalizacion }>(
      `${this.basePath}/${id}`
    )
    return response.data.data
  }

  async createExternalizacion(data: ExternalizacionFormData): Promise<Externalizacion> {
    const response = await apiClient.post<{ success: boolean; data: Externalizacion }>(
      this.basePath,
      data
    )
    return response.data.data
  }

  async updateExternalizacion(
    id: number,
    data: Partial<ExternalizacionFormData>
  ): Promise<Externalizacion> {
    const response = await apiClient.put<{ success: boolean; data: Externalizacion }>(
      `${this.basePath}/${id}`,
      data
    )
    return response.data.data
  }

  async deleteExternalizacion(id: number): Promise<void> {
    await apiClient.delete(`${this.basePath}/${id}`)
  }

  async registrarRecepcion(
    id: number,
    data: { f_recepcion?: string; updated_by: number }
  ): Promise<Externalizacion> {
    const response = await apiClient.patch<{ success: boolean; data: Externalizacion }>(
      `${this.basePath}/${id}/recepcion`,
      data
    )
    return response.data.data
  }

  async registrarRecepcionDatos(
    id: number,
    data: { f_recepcion_datos?: string; updated_by: number }
  ): Promise<Externalizacion> {
    const response = await apiClient.patch<{ success: boolean; data: Externalizacion }>(
      `${this.basePath}/${id}/recepcion-datos`,
      data
    )
    return response.data.data
  }
}

export const externalizacionesService = new ExternalizacionesService()
export default externalizacionesService
