import { useQuery, useMutation, useQueryClient, UseQueryResult } from '@tanstack/react-query'
import muestrasService from '../services/muestras.services'
import { Muestra, MuestraStats, Tecnica } from '../interfaces/muestras.types'

export const useMuestras = () => {
  const { data, isLoading, error, refetch }: UseQueryResult<Muestra[], Error> = useQuery({
    queryKey: ['muestras'],
    queryFn: async () => muestrasService.getMuestras(),
    staleTime: 5 * 60 * 1000, // Los datos son válidos por 5 minutos
    placeholderData: [] // Valor inicial para data
  })

  return {
    muestras: data || [],
    isLoading,
    error,
    refetch
  }
}

// Hook para obtener una muestra específica
export const useMuestra = (id: number) => {
  const { data, isLoading, error, refetch }: UseQueryResult<Muestra, Error> = useQuery({
    queryKey: ['muestra', id],
    queryFn: async () => muestrasService.getMuestra(id),
    staleTime: 5 * 60 * 1000 // Los datos son válidos por 5 minutos
  })

  return {
    muestra: data || null,
    isLoading,
    error,
    refetch
  }
}

export const useTecnicasByMuestra = (id: number) => {
  const { data, isLoading, error, refetch }: UseQueryResult<Tecnica[], Error> = useQuery({
    queryKey: ['muestra', id, 'tecnicas'],
    queryFn: async () => muestrasService.getTecnicasByMuestra(id),
    enabled: !!id && id > 0,
    staleTime: 5 * 60 * 1000 // Los datos son válidos por 5 minutos
  })

  return {
    tecnicas: data || [],
    isLoading,
    error,
    refetch
  }
}

export const useMuestrasStats = () => {
  const { data, isLoading, error, refetch }: UseQueryResult<MuestraStats, Error> = useQuery({
    queryKey: ['muestras', 'stats'],
    queryFn: async () => muestrasService.getMuestrasStats(),
    staleTime: 5 * 60 * 1000 // Los datos son válidos por 5 minutos
  })

  return {
    stats: data || null,
    isLoading,
    error,
    refetch
  }
}

// ============================================
// MUTATIONS
// ============================================

// Hook para crear una nueva muestra
export const useCreateMuestra = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Muestra) => muestrasService.createMuestra(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['muestras'] })
    }
  })
}

// Hook para actualizar una muestra existente
export const useUpdateMuestra = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Muestra }) =>
      muestrasService.updateMuestra(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['muestra', id] })
      queryClient.invalidateQueries({ queryKey: ['muestras'] })
    }
  })
}

// Hook para eliminar una muestra
export const useDeleteMuestra = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => muestrasService.deleteMuestra(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['muestras'] })
    }
  })
}
