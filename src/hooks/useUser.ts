// src/hooks/useUser.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../services/apiClient'

export interface User {
  id: string
  nombre: string
  email: string
  rol: string
  fechaCreacion: string
}

// Función para obtener los usuarios
const fetchUsers = async (): Promise<User[]> => {
  const { data } = await apiClient.get<User[]>('/api/users')
  return data
}

export const useUsers = () => {
  return useQuery<User[]>({
    queryKey: ['users'],
    queryFn: fetchUsers
  })
}

// Hook para crear un usuario
export const useCreateUser = () => {
  const queryClient = useQueryClient()
  return useMutation<User, Error, Omit<User, 'id'>>({
    mutationFn: async (newUser: Omit<User, 'id'>) => {
      const { data } = await apiClient.post<User>('/api/users', newUser)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    }
  })
}

// Hook para actualizar un usuario
export const useUpdateUser = () => {
  const queryClient = useQueryClient()
  return useMutation<User, Error, { id: string; data: Partial<User> }>({
    mutationFn: async ({ id, data }) => {
      const { data: updatedUser } = await apiClient.put<User>(`/api/users/${id}`, data)
      return updatedUser
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    }
  })
}

// Hook para eliminar un usuario
export const useDeleteUser = () => {
  const queryClient = useQueryClient()
  return useMutation<unknown, Error, string>({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/api/users/${id}`)
      return {}
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    }
  })
}
