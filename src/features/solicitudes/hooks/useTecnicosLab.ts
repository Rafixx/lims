//src/features/solicitudes/hooks/useTecnicosResp.ts
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/shared/services/apiClient'

export interface TecnicoLab {
  id_usuario: number
  nombre: string
}
export const useTecnicosLab = () =>
  useQuery<TecnicoLab[]>({
    queryKey: ['tecnicosResp'],
    queryFn: async () => {
      const { data } = await apiClient.get('/tecnicosLab')
      return data
    }
  })
