// src/features/solicitudes/hooks/useTecnicasPorPrueba.ts
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/shared/services/apiClient'

interface Tecnicas {
  id: number
  tecnica_proc: string
}

export const useTecnicas = (pruebaId?: number, solicitudId?: number) => {
  return solicitudId ? useTecnicaPorSolicitud(solicitudId) : useTecnicasPorPrueba(pruebaId)
}

export const useTecnicasPorPrueba = (pruebaId?: number) => {
  return useQuery<Tecnicas[], Error>({
    queryKey: ['tecnicasPorPrueba', pruebaId],
    queryFn: async () => {
      if (!pruebaId) return []
      const response = await apiClient.get(`/pruebas/${pruebaId}/tecnicas`)
      return response.data
    },
    enabled: !!pruebaId
  })
}

export const useTecnicaPorSolicitud = (solicitudId?: number) => {
  return useQuery<Tecnicas[], Error>({
    queryKey: ['tecnicasPorSolicitud', solicitudId],
    queryFn: async () => {
      if (!solicitudId) return []
      const response = await apiClient.get(`/tecnicas/solicitud/${solicitudId}`)
      console.log('tecnicas por solicitud', response.data)
      return response.data
    },
    enabled: !!solicitudId
  })
}
