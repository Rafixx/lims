/**
 * Hooks personalizados para la gestión de estados
 * Proveen una interfaz reactiva para trabajar con el EstadosService
 */

import { useState, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { estadosService } from '../services/estadosService'
import type {
  CambioEstadoResponse,
  EntidadTipo,
  UseCambiarEstadoOptions
} from '../interfaces/estados.types'

// Claves de consulta para React Query
export const estadosQueryKeys = {
  all: ['estados'] as const,
  byEntidad: (entidad: EntidadTipo) => [...estadosQueryKeys.all, entidad] as const,
  disponibles: (entidad: EntidadTipo, estadoActual?: number) =>
    [...estadosQueryKeys.byEntidad(entidad), 'disponibles', estadoActual] as const,
  estadisticas: (entidad: EntidadTipo) =>
    [...estadosQueryKeys.byEntidad(entidad), 'estadisticas'] as const
}

/**
 * Hook para obtener todos los estados de una entidad
 */
export const useEstados = (entidad: EntidadTipo) => {
  return useQuery({
    queryKey: estadosQueryKeys.byEntidad(entidad),
    queryFn: () => estadosService.getEstadosPorEntidad(entidad),
    staleTime: 1000 * 60 * 5, // Los estados no cambian frecuentemente
    gcTime: 1000 * 60 * 10,
    retry: 3
  })
}

/**
 * Hook para obtener estados disponibles para transición
 */
export const useEstadosDisponibles = (entidad: EntidadTipo, estadoActual?: number) => {
  return useQuery({
    queryKey: estadosQueryKeys.disponibles(entidad, estadoActual),
    queryFn: () => estadosService.getEstadosDisponibles(entidad, estadoActual),
    enabled: !!entidad,
    staleTime: 1000 * 60 * 2, // Menos tiempo ya que puede cambiar con el estado actual
    retry: 2
  })
}

/**
 * Hook para cambiar estado de muestra
 */
export const useCambiarEstadoMuestra = (options?: UseCambiarEstadoOptions) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      nuevoEstadoId,
      comentario
    }: {
      id: number
      nuevoEstadoId: number
      comentario?: string
    }) => estadosService.cambiarEstadoMuestra(id, nuevoEstadoId, comentario),

    onSuccess: (data: CambioEstadoResponse) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['muestras'] })
      queryClient.invalidateQueries({ queryKey: estadosQueryKeys.byEntidad('MUESTRA') })

      // Callback de éxito
      options?.onSuccess?.(data)
    },

    onError: (error: Error) => {
      console.error('Error al cambiar estado de muestra:', error)
      options?.onError?.(error)
    }
  })
}

/**
 * Hook para cambiar estado de técnica
 */
export const useCambiarEstadoTecnica = (options?: UseCambiarEstadoOptions) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      nuevoEstadoId,
      comentario
    }: {
      id: number
      nuevoEstadoId: number
      comentario?: string
    }) => estadosService.cambiarEstadoTecnica(id, nuevoEstadoId, comentario),

    onSuccess: (data: CambioEstadoResponse) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['tecnicas'] })
      queryClient.invalidateQueries({ queryKey: estadosQueryKeys.byEntidad('TECNICA') })

      // Callback de éxito
      options?.onSuccess?.(data)
    },

    onError: (error: Error) => {
      console.error('Error al cambiar estado de técnica:', error)
      options?.onError?.(error)
    }
  })
}

/**
 * Hook unificado para cambiar estados según la entidad
 */
export const useCambiarEstado = (entidad: EntidadTipo, options?: UseCambiarEstadoOptions) => {
  const cambiarEstadoMuestra = useCambiarEstadoMuestra(options)
  const cambiarEstadoTecnica = useCambiarEstadoTecnica(options)

  const cambiarEstado = useCallback(
    (id: number, nuevoEstadoId: number, comentario?: string) => {
      if (entidad === 'MUESTRA') {
        return cambiarEstadoMuestra.mutateAsync({ id, nuevoEstadoId, comentario })
      } else {
        return cambiarEstadoTecnica.mutateAsync({ id, nuevoEstadoId, comentario })
      }
    },
    [entidad, cambiarEstadoMuestra, cambiarEstadoTecnica]
  )

  // 🔧 Memoizar reset para evitar loop infinito en useEffect de componentes
  const reset = useCallback(() => {
    cambiarEstadoMuestra.reset()
    cambiarEstadoTecnica.reset()
  }, [cambiarEstadoMuestra, cambiarEstadoTecnica])

  return {
    cambiarEstado,
    isLoading: cambiarEstadoMuestra.isPending || cambiarEstadoTecnica.isPending,
    error: cambiarEstadoMuestra.error || cambiarEstadoTecnica.error,
    isSuccess: cambiarEstadoMuestra.isSuccess || cambiarEstadoTecnica.isSuccess,
    reset
  }
}

/**
 * Hook para obtener estadísticas de estados
 */
export const useEstadisticasEstados = (entidad: EntidadTipo) => {
  return useQuery({
    queryKey: estadosQueryKeys.estadisticas(entidad),
    queryFn: () => estadosService.getEstadisticasEstados(entidad),
    staleTime: 1000 * 60 * 5,
    retry: 2
  })
}

/**
 * Hook para validar transiciones de estado
 */
export const useValidarTransicion = () => {
  const [isValidating, setIsValidating] = useState(false)

  const validarTransicion = useCallback(
    async (entidad: EntidadTipo, estadoActual: number, estadoDestino: number) => {
      setIsValidating(true)
      try {
        const esValida = await estadosService.validarTransicion(
          entidad,
          estadoActual,
          estadoDestino
        )
        return esValida
      } catch (error) {
        console.error('Error validando transición:', error)
        return false
      } finally {
        setIsValidating(false)
      }
    },
    []
  )

  return { validarTransicion, isValidating }
}

/**
 * Hook para obtener el estado inicial de una entidad
 */
export const useEstadoInicial = (entidad: EntidadTipo) => {
  return useQuery({
    queryKey: [...estadosQueryKeys.byEntidad(entidad), 'inicial'],
    queryFn: () => estadosService.getEstadoInicial(entidad),
    staleTime: 1000 * 60 * 10, // Los estados iniciales rara vez cambian
    retry: 2
  })
}

/**
 * Hook para manejar el contexto completo de estados de una entidad
 */
export const useEstadosContext = (entidad: EntidadTipo, estadoActual?: number) => {
  const { data: estados, isLoading: loadingEstados, error: errorEstados } = useEstados(entidad)
  const {
    data: estadosDisponibles,
    isLoading: loadingDisponibles,
    error: errorDisponibles
  } = useEstadosDisponibles(entidad, estadoActual)
  const { data: estadoInicial } = useEstadoInicial(entidad)

  // Encontrar la información del estado actual
  const estadoActualInfo = estados?.find(estado => estado.id === estadoActual)

  // Determinar si el estado actual es final
  const esEstadoFinal = estadoActualInfo?.es_final || false

  return {
    estados: estados || [],
    estadosDisponibles: estadosDisponibles || [],
    estadoActualInfo,
    estadoInicial,
    esEstadoFinal,
    isLoading: loadingEstados || loadingDisponibles,
    error: errorEstados || errorDisponibles
  }
}
