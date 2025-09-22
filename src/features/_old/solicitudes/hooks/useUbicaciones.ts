import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/shared/services/apiClient'

export interface Ubicacion {
  id: number
  codigo: string
  ubicacion: string
}

export const useUbicaciones = () =>
  useQuery<Ubicacion[]>({
    queryKey: ['ubicaciones'],
    queryFn: async () => {
      const { data } = await apiClient.get('/ubicaciones')
      return data
    }
  })
