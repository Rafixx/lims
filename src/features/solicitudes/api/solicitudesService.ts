import { apiClient } from '@/shared/services/apiClient'
import type {
  SolicitudAPIResponse,
  CreateSolicitudRequest,
  UpdateSolicitudRequest,
  SolicitudesStats,
  SolicitudesFiltros,
  SolicitudServiceMethods
} from '../interfaces/solicitudes.types'

class SolicitudesService implements SolicitudServiceMethods {
  private readonly baseURL = '/solicitudes'

  async getSolicitudes(): Promise<SolicitudAPIResponse[]> {
    const response = await apiClient.get<SolicitudAPIResponse[]>(this.baseURL)
    return response.data
  }

  async getSolicitud(id: number): Promise<SolicitudAPIResponse> {
    const response = await apiClient.get<SolicitudAPIResponse>(`${this.baseURL}/${id}`)
    return response.data
  }

  async createSolicitud(data: CreateSolicitudRequest): Promise<SolicitudAPIResponse> {
    const response = await apiClient.post<SolicitudAPIResponse>(this.baseURL, data)
    return response.data
  }

  async updateSolicitud(id: number, data: UpdateSolicitudRequest): Promise<SolicitudAPIResponse> {
    const response = await apiClient.put<SolicitudAPIResponse>(`${this.baseURL}/${id}`, data)
    return response.data
  }

  async deleteSolicitud(id: number): Promise<void> {
    await apiClient.delete(`${this.baseURL}/${id}`)
  }

  async getSolicitudesStats(): Promise<SolicitudesStats> {
    const response = await apiClient.get<SolicitudesStats>(`${this.baseURL}/stats`)
    return response.data
  }

  async getSolicitudesFiltradas(filtros: SolicitudesFiltros): Promise<SolicitudAPIResponse[]> {
    const response = await apiClient.post<SolicitudAPIResponse[]>(
      `${this.baseURL}/filtradas`,
      filtros
    )
    return response.data
  }
}

export const solicitudesService = new SolicitudesService()
export default solicitudesService
