// src/hooks/useMuestras.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'
import { apiClient } from '../services/apiClient'
import { Producto } from './useProductos'

export interface Muestra {
  id: string
  identificacionExterna: string
  codigoInterno: string
  fechaIngreso: string
  estado: string
  ubicacion: string
  productos: Producto[] // Ahora es un array de Producto
}

const fetchMuestras = async (): Promise<Muestra[]> => {
  const { data } = await apiClient.get<Muestra[]>('/api/muestras')
  return data
}

export const useMuestras = () => {
  return useQuery<Muestra[]>({ queryKey: ['muestras'], queryFn: fetchMuestras })
}

export const useCreateMuestra = () => {
  const queryClient = useQueryClient()
  return useMutation<Muestra, Error, Omit<Muestra, 'id'>, unknown>({
    mutationFn: async (newMuestra: Omit<Muestra, 'id'>): Promise<Muestra> => {
      const response: AxiosResponse<Muestra> = await apiClient.post<Muestra>(
        '/api/muestras',
        newMuestra
      )
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['muestras'] })
    }
  })
}
