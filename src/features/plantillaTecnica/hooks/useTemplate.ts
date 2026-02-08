// src/features/plantillaTecnica/hooks/useTemplate.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { templateService } from '../services/templateService'
import { Template, TemplateValues } from '../interfaces/template.types'
import { STALE_TIME } from '@/shared/constants/constants'

/**
 * Hook para obtener la plantilla de una técnica proc
 */
export const useTemplate = (idTecnicaProc: number) => {
  return useQuery({
    queryKey: ['template', idTecnicaProc],
    queryFn: () => templateService.getTemplateByTecnicaProc(idTecnicaProc),
    enabled: !!idTecnicaProc && idTecnicaProc > 0,
    staleTime: STALE_TIME
  })
}

/**
 * Hook para obtener los valores guardados de un worklist
 */
export const useWorklistTemplateValues = (worklistId: number) => {
  return useQuery({
    queryKey: ['worklistTemplateValues', worklistId],
    queryFn: () => templateService.getWorklistTemplateValues(worklistId),
    enabled: !!worklistId && worklistId > 0,
    staleTime: STALE_TIME
  })
}

/**
 * Hook para guardar valores de plantilla en un worklist
 */
export const useSaveWorklistTemplateValues = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ worklistId, values }: { worklistId: number; values: TemplateValues }) =>
      templateService.saveWorklistTemplateValues(worklistId, values),
    onSuccess: (_, { worklistId }) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['worklistTemplateValues', worklistId] })
      queryClient.invalidateQueries({ queryKey: ['worklist', worklistId] })
    }
  })
}
