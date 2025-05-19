// src/features/solicitudes/services/solicitudService.ts

import { apiClient } from '@/shared/services/apiClient'
import { CreateSolicitudDTO } from '../interfaces/dto.types'
import { SolicitudAPIResponse } from '../interfaces/api.types'

export const getSolicitudes = async (): Promise<SolicitudAPIResponse[]> => {
  const response = await apiClient.get<SolicitudAPIResponse[]>('/solicitudes')
  return response.data
}

export const getSolicitud = async (id: number): Promise<SolicitudAPIResponse> => {
  const response = await apiClient.get<SolicitudAPIResponse>(`/solicitudes/${id}`)
  return response.data
}

export const createSolicitud = async (data: CreateSolicitudDTO): Promise<SolicitudAPIResponse> => {
  const response = await apiClient.post<SolicitudAPIResponse>('/solicitudes', data)
  return response.data
}

export const updateSolicitud = async (
  id: number,
  data: Partial<CreateSolicitudDTO>
): Promise<SolicitudAPIResponse> => {
  const response = await apiClient.put<SolicitudAPIResponse>(`/solicitudes/${id}`, data)
  return response.data
}

export const deleteSolicitud = async (id: number): Promise<void> => {
  await apiClient.delete(`/solicitudes/${id}`)
}
