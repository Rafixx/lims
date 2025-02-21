// src/hooks/useTecnicas.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../services/apiClient'

export interface Resultado {
  id: string
  valor: string | number
  unidad: string | null
  fechaResultado: string
}

export interface Tecnica {
  id: string
  nombre: string
  productoId: string
  maquinaId: string | null
  estado: string
  resultados: Resultado[]
}

const fetchTecnicas = async (): Promise<Tecnica[]> => {
  const { data } = await apiClient.get<Tecnica[]>('/api/tecnicas')
  return data
}

export const useTecnicas = () => {
  return useQuery<Tecnica[]>({
    queryKey: ['tecnicas'],
    queryFn: fetchTecnicas
  })
}

export const useCreateTecnica = () => {
  const queryClient = useQueryClient()
  return useMutation<Tecnica, Error, Omit<Tecnica, 'id'>>({
    mutationFn: async (newTecnica: Omit<Tecnica, 'id'>) => {
      const { data } = await apiClient.post<Tecnica>('/api/tecnicas', newTecnica)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tecnicas'] })
    }
  })
}

export const useUpdateTecnica = () => {
  const queryClient = useQueryClient()
  return useMutation<Tecnica, Error, { id: string; data: Partial<Tecnica> }>({
    mutationFn: async ({ id, data }) => {
      const { data: updated } = await apiClient.put<Tecnica>(`/api/tecnicas/${id}`, data)
      return updated
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tecnicas'] })
    }
  })
}

export const useDeleteTecnica = () => {
  const queryClient = useQueryClient()
  return useMutation<void, Error, string>({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/api/tecnicas/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tecnicas'] })
    }
  })
}
