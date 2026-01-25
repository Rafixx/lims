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
 * Retorna un objeto con éxitos y errores para manejo granular
 */
export const useExternalizarTecnicas = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (tecnicaIds: number[]) => {
      // Procesar cada técnica individualmente para capturar errores específicos
      const results = await Promise.allSettled(
        tecnicaIds.map(async id_tecnica => {
          try {
            const result = await externalizacionesService.createExternalizacion({ id_tecnica })
            return { success: true, id_tecnica, data: result }
          } catch (error: unknown) {
            // Extraer mensaje de error del backend
            let errorMessage = 'Error desconocido'

            // Axios wraps errors in a specific structure
            if (error && typeof error === 'object') {
              const axiosError = error as {
                response?: {
                  data?: {
                    message?: string
                    error?: string
                  }
                  status?: number
                }
                message?: string
              }

              // Prioridad: mensaje del backend > mensaje de axios > mensaje genérico
              if (axiosError.response?.data?.message) {
                errorMessage = axiosError.response.data.message
              } else if (axiosError.response?.data?.error) {
                errorMessage = axiosError.response.data.error
              } else if (axiosError.message) {
                errorMessage = axiosError.message
              }

              // Log para debugging en desarrollo
              console.warn(`Error externalizando técnica ${id_tecnica}:`, {
                status: axiosError.response?.status,
                message: errorMessage,
                fullError: error
              })
            }

            return { success: false, id_tecnica, error: errorMessage }
          }
        })
      )

      // Separar éxitos y errores
      const successful = results
        .filter(r => r.status === 'fulfilled' && r.value.success)
        .map(r => (r as PromiseFulfilledResult<{ success: true; id_tecnica: number }>).value)

      const failed = results
        .filter(r => r.status === 'fulfilled' && !r.value.success)
        .map(
          r =>
            (r as PromiseFulfilledResult<{ success: false; id_tecnica: number; error: string }>)
              .value
        )

      return { successful, failed, total: tecnicaIds.length }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['externalizaciones'] })
      queryClient.invalidateQueries({ queryKey: ['muestras'] })
      queryClient.invalidateQueries({ queryKey: ['tecnicasPorMuestra'] })
      queryClient.invalidateQueries({ queryKey: ['tecnicas', 'pendientes-externalizacion'] })
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

/**
 * Hook para marcar una externalización como recibida
 * Cambia el estado de la técnica a RECIBIDA_EXT (id_estado = 18)
 */
export const useMarcarComoRecibida = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      data
    }: {
      id: number
      data: { f_recepcion: string; observaciones?: string }
    }) => externalizacionesService.marcarComoRecibida(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['externalizacion', id] })
      queryClient.invalidateQueries({ queryKey: ['externalizaciones'] })
      queryClient.invalidateQueries({ queryKey: ['muestras'] })
      queryClient.invalidateQueries({ queryKey: ['tecnicasPorMuestra'] })
    }
  })
}
