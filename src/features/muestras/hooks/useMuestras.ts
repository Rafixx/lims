import { useQuery, useMutation, useQueryClient, UseQueryResult } from '@tanstack/react-query'
import muestrasService from '../services/muestras.services'
import { Muestra, MuestraStats, Tecnica } from '../interfaces/muestras.types'
import { STALE_TIME } from '@/shared/constants/constants'

export const useMuestras = () => {
  const { data, isLoading, error, refetch }: UseQueryResult<Muestra[], Error> = useQuery({
    queryKey: ['muestras'],
    queryFn: async () => muestrasService.getMuestras(),
    staleTime: STALE_TIME,
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
export const useMuestra = (id?: number) => {
  const { data, isLoading, error, refetch }: UseQueryResult<Muestra, Error> = useQuery({
    queryKey: ['muestra', id],
    queryFn: async () => muestrasService.getMuestra(id!),
    staleTime: STALE_TIME,
    enabled: !!id && id > 0,
    placeholderData: undefined
  })

  return {
    muestra: data,
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
    staleTime: STALE_TIME
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
    staleTime: STALE_TIME
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
