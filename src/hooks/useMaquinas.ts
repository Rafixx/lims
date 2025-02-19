// src/hooks/useMaquinas.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../services/apiClient'

export interface Maquina {
  id: string
  nombre: string
  tipo: string
}

// Función para obtener todas las máquinas
const fetchMaquinas = async (): Promise<Maquina[]> => {
  const { data } = await apiClient.get<Maquina[]>('/api/maquinas')
  return data
}

export const useMaquinas = () => {
  return useQuery<Maquina[]>({
    queryKey: ['maquinas'],
    queryFn: fetchMaquinas
  })
}

// Hook para crear una nueva máquina
export const useCreateMaquina = () => {
  const queryClient = useQueryClient()
  return useMutation<Maquina, Error, Omit<Maquina, 'id'>>({
    mutationFn: async (newMaquina: Omit<Maquina, 'id'>) => {
      const { data } = await apiClient.post<Maquina>('/api/maquinas', newMaquina)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maquinas'] })
    }
  })
}

// Hook para actualizar una máquina
export const useUpdateMaquina = () => {
  const queryClient = useQueryClient()
  return useMutation<Maquina, Error, { id: string; data: Partial<Maquina> }>({
    mutationFn: async ({ id, data }) => {
      const { data: updated } = await apiClient.put<Maquina>(`/api/maquinas/${id}`, data)
      return updated
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maquinas'] })
    }
  })
}

// Hook para eliminar una máquina
export const useDeleteMaquina = () => {
  const queryClient = useQueryClient()
  return useMutation<void, Error, string>({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/api/maquinas/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maquinas'] })
    }
  })
}
