/**
 * Hook para gestión de solicitudes usando el servicio centralizado
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getSolicitudes,
  getSolicitud,
  createSolicitud,
  updateSolicitud,
  deleteSolicitud
} from '../services/solicitudService'
import { CreateSolicitudDTO } from '../interfaces/dto.types'
import { SolicitudAPIResponse } from '../interfaces/api.types'

// ================================
// HOOKS DE CONSULTA
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
// HOOKS DE MUTACIÓN
// ================================

/**
 * Hook para crear nuevas solicitudes
 */
export const useCreateSolicitud = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateSolicitudDTO) => createSolicitud(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['solicitudes'] })
    },
    onError: error => {
      console.error('Error creando solicitud:', error)
    }
  })
}

/**
 * Hook para actualizar solicitudes existentes
 */
export const useUpdateSolicitud = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateSolicitudDTO> }) =>
      updateSolicitud(id, data),
    onSuccess: (updatedSolicitud: SolicitudAPIResponse) => {
      queryClient.setQueryData(['solicitud', updatedSolicitud.id_solicitud], updatedSolicitud)
      queryClient.invalidateQueries({ queryKey: ['solicitudes'] })
    },
    onError: error => {
      console.error('Error actualizando solicitud:', error)
    }
  })
}

/**
 * Hook para eliminar solicitudes
 */
export const useDeleteSolicitud = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteSolicitud,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['solicitudes'] })
    },
    onError: error => {
      console.error('Error eliminando solicitud:', error)
    }
  })
}
