// src/hooks/useProductos.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../services/apiClient'

export interface Producto {
  id: string
  nombre: string
  tecnicas: string[] // IDs de las técnicas asociadas
}

// Función para obtener todos los productos
const fetchProductos = async (): Promise<Producto[]> => {
  const { data } = await apiClient.get<Producto[]>('/api/productos')
  return data
}

export const useProductos = () => {
  return useQuery<Producto[]>({
    queryKey: ['productos'],
    queryFn: fetchProductos
  })
}

// Hook para crear un nuevo producto
export const useCreateProducto = () => {
  const queryClient = useQueryClient()
  return useMutation<Producto, Error, Omit<Producto, 'id'>>({
    mutationFn: async (newProducto: Omit<Producto, 'id'>) => {
      const { data } = await apiClient.post<Producto>('/api/productos', newProducto)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] })
    }
  })
}

// Hook para actualizar un producto
export const useUpdateProducto = () => {
  const queryClient = useQueryClient()
  return useMutation<Producto, Error, { id: string; data: Partial<Producto> }>({
    mutationFn: async ({ id, data }) => {
      const { data: updated } = await apiClient.put<Producto>(`/api/productos/${id}`, data)
      return updated
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] })
    }
  })
}

// Hook para eliminar un producto
export const useDeleteProducto = () => {
  const queryClient = useQueryClient()
  return useMutation<void, Error, string>({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/api/productos/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] })
    }
  })
}
