//src/features/solicitudes/hooks/useCentros.ts
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/shared/services/apiClient'

export interface CriterioValidacion {
  id: number
  codigo: string
  descripcion: string
}

export const useCriteriosValidacion = () =>
  useQuery<CriterioValidacion[]>({
    queryKey: ['criteriosValidacion'],
    queryFn: async () => {
      const { data } = await apiClient.get('/criteriosValidacion')
      return data
    }
  })
