// src/features/solicitudes/hooks/useTecnicasPorPrueba.ts
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/shared/services/apiClient'

interface Tecnica {
  id: number
  tecnica_proc: string
}

export const useTecnicasPorPrueba = (isEditing: boolean = false, pruebaId?: number) => {
  return useQuery<Tecnica[], Error>({
    queryKey: ['tecnicasPorPrueba', pruebaId],
    queryFn: async () => {
      if (!pruebaId) return []
      if (isEditing) return []
      const response = await apiClient.get(`/pruebas/${pruebaId}/tecnicas`)
      return response.data
    },
    enabled: !!pruebaId
  })
}
