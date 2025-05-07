import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/shared/services/apiClient'

export interface Cliente {
  nombre: string
  razon_social: string
  nif: string
  direccion: string
}

export const useCliente = (id?: number) =>
  useQuery<Cliente>({
    queryKey: ['cliente', id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/clientes/${id}`)
      return data
    },
    enabled: !!id // evita ejecutar la query si no hay ID
  })
