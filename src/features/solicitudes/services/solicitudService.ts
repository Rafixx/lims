// src/features/solicitudes/services/solicitudService.ts

import { apiClient } from '@/shared/services/apiClient'
import { Solicitud, CreateSolicitudDTO } from '../interfaces/solicitud.interface'

export const getSolicitudes = async (): Promise<Solicitud[]> => {
  const response = await apiClient.get<Solicitud[]>('/solicitudes')
  return response.data
}

export const getSolicitud = async (id: number): Promise<Solicitud> => {
  const response = await apiClient.get<Solicitud>(`/solicitudes/${id}`)
  return response.data
}

export const createSolicitud = async (data: CreateSolicitudDTO): Promise<Solicitud> => {
  const response = await apiClient.post<Solicitud>('/solicitudes', data)
  return response.data
}

export const updateSolicitud = async (
  id: number,
  data: Partial<CreateSolicitudDTO>
): Promise<Solicitud> => {
  const response = await apiClient.put<Solicitud>(`/solicitudes/${id}`, data)
  return response.data
}

export const deleteSolicitud = async (id: number): Promise<void> => {
  await apiClient.delete(`/solicitudes/${id}`)
}
