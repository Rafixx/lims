import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/shared/services/apiClient'

interface Cliente {
  id: number
  nombre: string
}

export const useClientes = () =>
  useQuery<Cliente[]>({
    queryKey: ['clientes'],
    queryFn: async () => {
      const { data } = await apiClient.get('/clientes')
      return data
    }
  })
