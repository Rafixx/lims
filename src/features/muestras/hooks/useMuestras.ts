import { useCallback, useEffect, useRef, useState } from 'react'
import { useQuery, useMutation, useQueryClient, UseQueryResult } from '@tanstack/react-query'
import muestrasService from '../services/muestras.services'
import { CodigoEpiResponse, Muestra, MuestraStats, Tecnica, TecnicaAgrupada } from '../interfaces/muestras.types'
import { STALE_TIME } from '@/shared/constants/constants'
import tecnicaService from '../services/tecnica.service'

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

// Hook para obtener técnicas agrupadas o normales según el tipo de muestra
export const useTecnicasAgrupadasByMuestra = (id: number) => {
  const { data, isLoading, error, refetch }: UseQueryResult<Tecnica[] | TecnicaAgrupada[], Error> = useQuery({
    queryKey: ['muestra', id, 'tecnicas-agrupadas'],
    queryFn: async () => tecnicaService.getTecnicasAgrupadasByMuestra(id),
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

export const useNextCodigoEpi = (autoFetch = false) => {
  const [codigoEpi, setCodigoEpi] = useState<CodigoEpiResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const hasFetchedRef = useRef(false)

  const fetchCodigo = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await muestrasService.getNextCodigoEpi()
      setCodigoEpi(response)
      return response
    } catch (err) {
      const errorInstance =
        err instanceof Error
          ? err
          : new Error('No se pudo obtener el siguiente código epidemiológico')
      setError(errorInstance)
      throw errorInstance
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!autoFetch || hasFetchedRef.current) {
      return
    }
    hasFetchedRef.current = true
    fetchCodigo().catch(() => {
      // el error se maneja en el estado local
    })
  }, [autoFetch, fetchCodigo])

  return {
    codigoEpi,
    isLoading,
    error,
    fetchCodigo
  }
}

// Hook para eliminar/cancelar una técnica
export const useDeleteTecnica = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      tecnicaId,
      muestraId
    }: {
      tecnicaId: number
      muestraId: number
    }) => {
      const tecnicaService = await import('../services/tecnica.service').then(m => m.default)

      // Ejecutar la eliminación (el backend debe cambiar el estado a CANCELADA internamente)
      await tecnicaService.deleteTecnica(tecnicaId)
    },
    onSuccess: (_, { muestraId }) => {
      // Invalidar las técnicas de la muestra
      queryClient.invalidateQueries({ queryKey: ['muestra', muestraId, 'tecnicas'] })
    }
  })
}
