import { useCallback, useState } from 'react'
import { useQuery, useMutation, useQueryClient, UseQueryResult } from '@tanstack/react-query'
import { worklistService } from '../services/worklistService'
import {
  Worklist,
  Tecnica,
  CreateWorklistRequest,
  CodigoWorklistResponse
} from '../interfaces/worklist.types'
import { TecnicaProc } from '@/shared/interfaces/dim_tables.types'
import { STALE_TIME } from '@/shared/constants/constants'

export const useWorklists = () => {
  const { data, isLoading, error, refetch }: UseQueryResult<Worklist[], Error> = useQuery({
    queryKey: ['worklists'],
    queryFn: async () => worklistService.getWorklists(),
    staleTime: STALE_TIME,
    placeholderData: [] // Valor inicial para data
  })

  return {
    worklists: data || [],
    isLoading,
    error,
    refetch
  }
}

// Hook para obtener un worklist específico
export const useWorklist = (id: number) => {
  const { data, isLoading, error, refetch }: UseQueryResult<Worklist, Error> = useQuery({
    queryKey: ['worklist', id],
    queryFn: async () => worklistService.getWorklist(id),
    enabled: !!id && id > 0,
    staleTime: STALE_TIME
  })

  return {
    worklist: data || null,
    isLoading,
    error,
    refetch
  }
}

export const useTecnicasByWorklist = (id: number) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['worklist', id, 'tecnicas'],
    queryFn: async () => worklistService.getTecnicasByWorklist(id),
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

export const usePosiblesTecnicasProc = () => {
  const { data, isLoading, error, refetch }: UseQueryResult<TecnicaProc[], Error> = useQuery({
    queryKey: ['posiblesTecnicasProc'],
    queryFn: async () => worklistService.getPosiblesTecnicasProc(),
    staleTime: STALE_TIME
  })
  return {
    posiblesTecnicasProc: data || [],
    isLoading,
    error,
    refetch
  }
}

export const usePosiblesTecnicas = (tecnicaProc: string) => {
  const { data, isLoading, error, refetch }: UseQueryResult<Tecnica[], Error> = useQuery({
    queryKey: ['posiblesTecnicas', tecnicaProc],
    queryFn: async () => worklistService.getPosiblesTecnicas(tecnicaProc),
    enabled: !!tecnicaProc, // Solo ejecuta si hay un proceso seleccionado
    staleTime: STALE_TIME
  })

  return {
    posiblesTecnicas: data || [],
    isLoading,
    error,
    refetch
  }
}

export const useCreateWorklist = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateWorklistRequest) => worklistService.createWorklist(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['worklists'] })
      queryClient.invalidateQueries({ queryKey: ['posiblesTecnicasProc'] })
    }
  })
}

export const useUpdateWorklist = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Worklist> }) =>
      worklistService.updateWorklist(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['worklist', id] })
      queryClient.invalidateQueries({ queryKey: ['worklists'] })
    }
  })
}

export const useSetTecnicoLab = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ worklistId, tecnicoId }: { worklistId: number; tecnicoId: number }) =>
      worklistService.setTecnicoLab(worklistId, tecnicoId),
    onSuccess: (_, { worklistId }) => {
      queryClient.invalidateQueries({ queryKey: ['worklist', worklistId] })
      queryClient.invalidateQueries({ queryKey: ['worklists'] })
    }
  })
}

export const useDeleteWorklist = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => worklistService.deleteWorklist(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['worklists'] })
    }
  })
}

export const useNextWorklistCodigo = () => {
  const [codigoWorklist, setCodigoWorklist] = useState<CodigoWorklistResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchCodigo = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await worklistService.getNextWorklistCode()
      setCodigoWorklist(response)
      return response
    } catch (err) {
      const errorInstance =
        err instanceof Error ? err : new Error('No se pudo obtener el código del worklist')
      setError(errorInstance)
      throw errorInstance
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    codigoWorklist,
    isLoading,
    error,
    fetchCodigo
  }
}
