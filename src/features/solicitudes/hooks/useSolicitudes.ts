// src/features/solicitudes/hooks/useSolicitudes.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getSolicitudes,
  createSolicitud,
  updateSolicitud,
  deleteSolicitud
} from '../services/solicitudService'
import { CreateSolicitudDTO } from '../interfaces/dto.types'

export const useSolicitudes = () => {
  return useQuery({
    queryKey: ['solicitudes'],
    queryFn: getSolicitudes
  })
}

export const useCreateSolicitud = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createSolicitud,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['solicitudes'] })
    }
  })
}

export const useUpdateSolicitud = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateSolicitudDTO> }) =>
      updateSolicitud(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['solicitudes'] })
    }
  })
}

export const useDeleteSolicitud = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteSolicitud,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['solicitudes'] })
    }
  })
}
