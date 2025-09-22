import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/shared/services/apiClient'

export interface TiposMuestra {
  id: number
  cod_tipo_muestra: string
  tipo_muestra: string
}

export const useTiposMuestra = () =>
  useQuery<TiposMuestra[]>({
    queryKey: ['tiposMuestra'],
    queryFn: async () => {
      const { data } = await apiClient.get('/tiposmuestra')
      return data
    }
  })
