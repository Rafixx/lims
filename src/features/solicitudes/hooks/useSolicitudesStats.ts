/**
 * Hook para gestión de solicitudes usando el servicio centralizado
 * Incluye operaciones CRUD básicas y funciones avanzadas de estadísticas y filtros
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getSolicitudes,
  getSolicitud,
  createSolicitud,
  updateSolicitud,
  deleteSolicitud,
  getSolicitudesStats,
  getSolicitudesFiltradas,
  getEstadosDisponibles,
  getClientesConSolicitudes,
  getPruebasConSolicitudes
} from '../services/solicitudService'
import { CreateSolicitudDTO } from '../interfaces/dto.types'
import { SolicitudAPIResponse } from '../interfaces/api.types'
import { FiltrosSolicitudes } from '../interfaces/stats.types'

// ================================
// HOOKS DE CONSULTA BÁSICOS
// ================================

/**
 * Hook para obtener lista de solicitudes
 */
export const useSolicitudes = () => {
  return useQuery({
    queryKey: ['solicitudes'],
    queryFn: getSolicitudes,
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
    retry: 2
  })
}

/**
 * Hook para obtener una solicitud específica por ID
 */
export const useSolicitudById = (id: number) => {
  return useQuery({
    queryKey: ['solicitud', id],
    queryFn: () => getSolicitud(id),
    enabled: Boolean(id),
    staleTime: 2 * 60 * 1000, // 2 minutos
    retry: 1
  })
}

// ================================
// HOOKS DE ESTADÍSTICAS Y FILTROS
// ================================

/**
 * Hook para obtener estadísticas de solicitudes
 */
export const useSolicitudesStats = () => {
  return useQuery({
    queryKey: ['solicitudes', 'stats'],
    queryFn: getSolicitudesStats,
    staleTime: 2 * 60 * 1000, // 2 minutos - las stats pueden cambiar frecuentemente
    refetchOnWindowFocus: true,
    retry: 2
  })
}

/**
 * Hook para obtener solicitudes filtradas
 */
export const useSolicitudesFiltradas = (filtros: FiltrosSolicitudes) => {
  return useQuery({
    queryKey: ['solicitudes', 'filtradas', filtros],
    queryFn: () => getSolicitudesFiltradas(filtros),
    staleTime: 1 * 60 * 1000, // 1 minuto - filtros necesitan datos frescos
    refetchOnWindowFocus: false,
    retry: 2,
    enabled: true // Siempre habilitado, pero se puede condicionar según filtros
  })
}

/**
 * Hook para obtener estados disponibles
 */
export const useEstadosDisponibles = () => {
  return useQuery({
    queryKey: ['solicitudes', 'estados'],
    queryFn: getEstadosDisponibles,
    staleTime: 30 * 60 * 1000, // 30 minutos - los estados no cambian frecuentemente
    refetchOnWindowFocus: false,
    retry: 1
  })
}

/**
 * Hook para obtener clientes con solicitudes
 */
export const useClientesConSolicitudes = () => {
  return useQuery({
    queryKey: ['solicitudes', 'clientes'],
    queryFn: getClientesConSolicitudes,
    staleTime: 10 * 60 * 1000, // 10 minutos
    refetchOnWindowFocus: false,
    retry: 2
  })
}

/**
 * Hook para obtener pruebas con solicitudes
 */
export const usePruebasConSolicitudes = () => {
  return useQuery({
    queryKey: ['solicitudes', 'pruebas'],
    queryFn: getPruebasConSolicitudes,
    staleTime: 10 * 60 * 1000, // 10 minutos
    refetchOnWindowFocus: false,
    retry: 2
  })
}

// ================================
// HOOKS DE MUTACIÓN
// ================================

/**
 * Hook para crear una nueva solicitud
 */
export const useCreateSolicitud = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createSolicitud,
    onSuccess: () => {
      // Invalidar múltiples queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['solicitudes'] })
      queryClient.invalidateQueries({ queryKey: ['solicitudes', 'stats'] })
      queryClient.invalidateQueries({ queryKey: ['solicitudes', 'filtradas'] })
      queryClient.invalidateQueries({ queryKey: ['solicitudes', 'clientes'] })
      queryClient.invalidateQueries({ queryKey: ['solicitudes', 'pruebas'] })
    },
    onError: error => {
      console.error('Error creating solicitud:', error)
    }
  })
}

/**
 * Hook para actualizar una solicitud existente
 */
export const useUpdateSolicitud = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateSolicitudDTO> }) =>
      updateSolicitud(id, data),
    onSuccess: (updatedSolicitud: SolicitudAPIResponse) => {
      // Invalidar las queries generales
      queryClient.invalidateQueries({ queryKey: ['solicitudes'] })
      queryClient.invalidateQueries({ queryKey: ['solicitudes', 'stats'] })
      queryClient.invalidateQueries({ queryKey: ['solicitudes', 'filtradas'] })

      // Actualizar el cache específico de la solicitud
      queryClient.setQueryData(['solicitud', updatedSolicitud.id_solicitud], updatedSolicitud)
    },
    onError: error => {
      console.error('Error updating solicitud:', error)
    }
  })
}

/**
 * Hook para eliminar una solicitud
 */
export const useDeleteSolicitud = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteSolicitud,
    onSuccess: (_, deletedId) => {
      // Invalidar queries
      queryClient.invalidateQueries({ queryKey: ['solicitudes'] })
      queryClient.invalidateQueries({ queryKey: ['solicitudes', 'stats'] })
      queryClient.invalidateQueries({ queryKey: ['solicitudes', 'filtradas'] })

      // Remover del cache específico
      queryClient.removeQueries({ queryKey: ['solicitud', deletedId] })
    },
    onError: error => {
      console.error('Error deleting solicitud:', error)
    }
  })
}
