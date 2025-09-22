// src/features/solicitudes/hooks/useSolicitudes.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { solicitudesService } from '../api/solicitudesService' // ✅ Cambio: ruta correcta al servicio
import type {
  // SolicitudAPIResponse,
  CreateSolicitudRequest,
  UpdateSolicitudRequest,
  UseSolicitudesReturn
} from '../interfaces/solicitudes.types' // ✅ Cambio: importar desde tipos unificados

// ============================================
// QUERY KEYS
// ============================================
export const SOLICITUDES_KEYS = {
  all: ['solicitudes'] as const,
  lists: () => [...SOLICITUDES_KEYS.all, 'list'] as const,
  list: (filters?: unknown) => [...SOLICITUDES_KEYS.lists(), filters] as const,
  details: () => [...SOLICITUDES_KEYS.all, 'detail'] as const,
  detail: (id: number) => [...SOLICITUDES_KEYS.details(), id] as const,
  stats: () => [...SOLICITUDES_KEYS.all, 'stats'] as const
}

// ============================================
// QUERIES
// ============================================

// Hook para obtener todas las solicitudes
export const useSolicitudes = (): UseSolicitudesReturn => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: SOLICITUDES_KEYS.lists(),
    queryFn: () => solicitudesService.getSolicitudes(),
    staleTime: 5 * 60 * 1000 // 5 minutos
  })

  return {
    solicitudes: data || [], // ✅ Ahora coincide con UseSolicitudesReturn
    isLoading,
    error: error as Error | null,
    refetch: async () => {
      await refetch()
    }
  }
}

// Hook para obtener una solicitud específica
export const useSolicitud = (id: number) => {
  return useQuery({
    queryKey: SOLICITUDES_KEYS.detail(id),
    queryFn: () => solicitudesService.getSolicitud(id),
    enabled: !!id && id > 0,
    staleTime: 5 * 60 * 1000
  })
}

// ============================================
// MUTATIONS
// ============================================

// Hook para crear una nueva solicitud
export const useCreateSolicitud = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateSolicitudRequest) => solicitudesService.createSolicitud(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SOLICITUDES_KEYS.all })
    }
  })
}

// Hook para actualizar una solicitud existente
export const useUpdateSolicitud = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateSolicitudRequest }) =>
      solicitudesService.updateSolicitud(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: SOLICITUDES_KEYS.detail(id) })
      queryClient.invalidateQueries({ queryKey: SOLICITUDES_KEYS.lists() })
    }
  })
}

// Hook para eliminar una solicitud
export const useDeleteSolicitud = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => solicitudesService.deleteSolicitud(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SOLICITUDES_KEYS.all })
    }
  })
}
