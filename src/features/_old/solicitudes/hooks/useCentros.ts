//src/features/solicitudes/hooks/useCentros.ts
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/shared/services/apiClient'

export interface Centro {
  id: number
  codigo: string
  descripcion: string
}

export const useCentros = () =>
  useQuery<Centro[]>({
    queryKey: ['centros'],
    queryFn: async () => {
      const { data } = await apiClient.get('/centros')
      return data
    }
  })
