// src/features/tecnicasReactivos/hooks/useTecnicasReactivos.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { tecnicaReactivoService } from '../services/tecnicaReactivoService'
import type {
  CreateTecnicaReactivoData,
  UpdateTecnicaReactivoData,
  BatchUpdateItem
} from '../interfaces/tecnicaReactivo.types'
import { STALE_TIME } from '@/shared/constants/constants'

export { useLotesPendientes } from './useLotesPendientes'

/**
 * Hook para obtener técnicas con reactivos de un worklist (ENDPOINT OPTIMIZADO)
 */
export const useWorklistTecnicasReactivosOptimizado = (worklistId: number) => {
  return useQuery({
    queryKey: ['worklistTecnicasReactivosOptimizado', worklistId],
    queryFn: () => tecnicaReactivoService.getWorklistTecnicasReactivosOptimizado(worklistId),
    enabled: !!worklistId && worklistId > 0,
    staleTime: STALE_TIME
  })
}

/**
 * Hook para obtener técnicas con reactivos de un worklist (ENDPOINT LEGACY)
 * @deprecated Usar useWorklistTecnicasReactivosOptimizado en su lugar
 */
export const useWorklistTecnicasReactivos = (worklistId: number) => {
  return useQuery({
    queryKey: ['worklistTecnicasReactivos', worklistId],
    queryFn: () => tecnicaReactivoService.getWorklistTecnicasReactivos(worklistId),
    enabled: !!worklistId && worklistId > 0,
    staleTime: STALE_TIME
  })
}

/**
 * Hook para crear relación técnica-reactivo
 */
export const useCreateTecnicaReactivo = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateTecnicaReactivoData) =>
      tecnicaReactivoService.createTecnicaReactivo(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['worklistTecnicasReactivos'] })
    }
  })
}

/**
 * Hook para actualizar relación técnica-reactivo
 */
export const useUpdateTecnicaReactivo = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTecnicaReactivoData }) =>
      tecnicaReactivoService.updateTecnicaReactivo(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['worklistTecnicasReactivos'] })
      queryClient.invalidateQueries({ queryKey: ['lotesPendientes'] })
    }
  })
}

/**
 * Hook para batch update/create de lotes (NUEVO ENDPOINT)
 */
export const useBatchUpsertLotes = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (updates: BatchUpdateItem[]) => tecnicaReactivoService.batchUpsertLotes(updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['worklistTecnicasReactivos'] })
      queryClient.invalidateQueries({ queryKey: ['worklistTecnicasReactivosOptimizado'] })
      queryClient.invalidateQueries({ queryKey: ['lotesPendientes'] })
    }
  })
}

/**
 * Hook para actualizar o crear lote y volumen usando id_tecnica e id_reactivo
 * @deprecated Usar useBatchUpsertLotes para mejor performance
 */
export const useUpsertLoteVolumen = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      idTecnica,
      idReactivo,
      idTecnicaReactivo,
      data
    }: {
      idTecnica: number
      idReactivo: number
      idTecnicaReactivo?: number
      data: UpdateTecnicaReactivoData
    }) => tecnicaReactivoService.upsertLoteVolumen(idTecnica, idReactivo, idTecnicaReactivo, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['worklistTecnicasReactivos'] })
      queryClient.invalidateQueries({ queryKey: ['lotesPendientes'] })
    }
  })
}

/**
 * Hook para eliminar relación técnica-reactivo
 */
export const useDeleteTecnicaReactivo = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => tecnicaReactivoService.deleteTecnicaReactivo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['worklistTecnicasReactivos'] })
    }
  })
}
