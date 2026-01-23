import { useQuery, useMutation, useQueryClient, UseQueryResult } from '@tanstack/react-query'
import externalizacionesService from '../services/externalizaciones.service'
import { Externalizacion, ExternalizacionFormData } from '../interfaces/externalizaciones.types'
import { STALE_TIME } from '@/shared/constants/constants'

export const useExternalizaciones = () => {
  const { data, isLoading, error, refetch }: UseQueryResult<Externalizacion[], Error> = useQuery({
    queryKey: ['externalizaciones'],
    queryFn: async () => externalizacionesService.getExternalizaciones(),
    staleTime: STALE_TIME,
    placeholderData: []
  })

  return {
    externalizaciones: data || [],
    isLoading,
    error,
    refetch
  }
}

export const useExternalizacionesPendientes = () => {
  const { data, isLoading, error, refetch }: UseQueryResult<Externalizacion[], Error> = useQuery({
    queryKey: ['externalizaciones', 'pendientes'],
    queryFn: async () => externalizacionesService.getExternalizacionesPendientes(),
    staleTime: STALE_TIME,
    placeholderData: []
  })

  return {
    externalizaciones: data || [],
    isLoading,
    error,
    refetch
  }
}

export const useExternalizacion = (id?: number) => {
  const { data, isLoading, error, refetch }: UseQueryResult<Externalizacion, Error> = useQuery({
    queryKey: ['externalizacion', id],
    queryFn: async () => externalizacionesService.getExternalizacion(id!),
    staleTime: STALE_TIME,
    enabled: !!id && id > 0,
    placeholderData: undefined
  })

  return {
    externalizacion: data,
    isLoading,
    error,
    refetch
  }
}

export const useCreateExternalizacion = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ExternalizacionFormData) =>
      externalizacionesService.createExternalizacion(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['externalizaciones'] })
    }
  })
}

export const useUpdateExternalizacion = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ExternalizacionFormData> }) =>
      externalizacionesService.updateExternalizacion(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['externalizacion', id] })
      queryClient.invalidateQueries({ queryKey: ['externalizaciones'] })
    }
  })
}

export const useDeleteExternalizacion = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => externalizacionesService.deleteExternalizacion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['externalizaciones'] })
    }
  })
}

export const useRegistrarRecepcion = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      data
    }: {
      id: number
      data: { f_recepcion?: string; updated_by: number }
    }) => externalizacionesService.registrarRecepcion(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['externalizacion', id] })
      queryClient.invalidateQueries({ queryKey: ['externalizaciones'] })
    }
  })
}

export const useRegistrarRecepcionDatos = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      data
    }: {
      id: number
      data: { f_recepcion_datos?: string; updated_by: number }
    }) => externalizacionesService.registrarRecepcionDatos(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['externalizacion', id] })
      queryClient.invalidateQueries({ queryKey: ['externalizaciones'] })
    }
  })
}

/**
 * Hook para externalizar una o múltiples técnicas
 * Crea una externalización por cada técnica proporcionada
 */
export const useExternalizarTecnicas = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (tecnicaIds: number[]) => {
      // Crear una externalización por cada técnica
      const promises = tecnicaIds.map(id_tecnica =>
        externalizacionesService.createExternalizacion({ id_tecnica })
      )
      return Promise.all(promises)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['externalizaciones'] })
      queryClient.invalidateQueries({ queryKey: ['muestras'] })
      queryClient.invalidateQueries({ queryKey: ['tecnicasPorMuestra'] })
    }
  })
}

/**
 * Hook para enviar múltiples externalizaciones
 * Actualiza datos comunes y cambia estado a ENVIADA_EXT (id_estado = 17)
 */
export const useEnviarExternalizaciones = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      externalizacionIds,
      data
    }: {
      externalizacionIds: number[]
      data: {
        servicio: string
        agencia: string
        id_centro: number | null
        id_tecnico_resp: number | null
        f_envio: string
        observaciones?: string
      }
    }) => {
      return externalizacionesService.enviarExternalizaciones(externalizacionIds, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['externalizaciones'] })
      queryClient.invalidateQueries({ queryKey: ['muestras'] })
      queryClient.invalidateQueries({ queryKey: ['tecnicasPorMuestra'] })
    }
  })
}
