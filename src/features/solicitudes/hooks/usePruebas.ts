import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/shared/services/apiClient'

export interface Prueba {
  id: number
  prueba: string
  tecnicas?: string[] // hasta que se tipen correctamente
}

export const usePruebas = () =>
  useQuery<Prueba[]>({
    queryKey: ['pruebas'],
    queryFn: async () => {
      const { data } = await apiClient.get('/pruebas')
      return data
    }
  })
