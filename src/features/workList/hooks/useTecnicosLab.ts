// src/features/workList/hooks/useTecnicosLab.ts

import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/shared/services/apiClient'

export interface TecnicoLab {
  id_usuario: number
  nombre: string
  especialidad?: string
  activo: boolean
}

export const useTecnicosLab = () => {
  return useQuery<TecnicoLab[]>({
    queryKey: ['tecnicosLab'],
    queryFn: async () => {
      const { data } = await apiClient.get('/tecnicosLab')
      return data
    },
    staleTime: 5 * 60 * 1000 // Los datos son válidos por 5 minutos
  })
}
