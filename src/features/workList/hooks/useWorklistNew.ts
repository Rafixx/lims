// src/features/workList/hooks/useWorklist.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { worklistService } from '../services/worklistService'
import { AsignacionTecnico } from '../interfaces/worklist.types'

// Hook para obtener técnicas pendientes
export const useTecnicasPendientes = () => {
  return useQuery({
    queryKey: ['worklist', 'tecnicas-pendientes'],
    queryFn: worklistService.getTecnicasPendientes,
    refetchInterval: 30000 // Refresca cada 30 segundos
  })
}

// Hook para obtener técnicas agrupadas por proceso
export const useTecnicasAgrupadasPorProceso = () => {
  return useQuery({
    queryKey: ['worklist', 'tecnicas-agrupadas'],
    queryFn: worklistService.getTecnicasAgrupadasPorProceso,
    refetchInterval: 30000,
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 20000 // Los datos son válidos por 20 segundos
  })
}

// Hook para obtener técnicas con información del proceso
export const useTecnicasPendientesConProceso = () => {
  return useQuery({
    queryKey: ['worklist', 'tecnicas-con-proceso'],
    queryFn: worklistService.getTecnicasPendientesConProceso,
    refetchInterval: 30000
  })
}

// Hook para obtener estadísticas del worklist
export const useWorklistStats = () => {
  return useQuery({
    queryKey: ['worklist', 'estadisticas'],
    queryFn: worklistService.getWorklistStats,
    refetchInterval: 60000 // Refresca cada minuto
  })
}

// Hook para obtener procesos pendientes
export const useProcesosPendientes = () => {
  return useQuery({
    queryKey: ['worklist', 'procesos-pendientes'],
    queryFn: worklistService.getProcesosPendientes,
    refetchInterval: 30000
  })
}

// Hook para obtener conteo de técnicas pendientes
export const useConteoTecnicasPendientes = () => {
  return useQuery({
    queryKey: ['worklist', 'conteo'],
    queryFn: worklistService.getConteoTecnicasPendientes,
    refetchInterval: 30000
  })
}

// Hook para obtener técnicas de un proceso específico
export const useTecnicasPorProceso = (idTecnicaProc: number | null) => {
  return useQuery({
    queryKey: ['worklist', 'proceso', idTecnicaProc, 'tecnicas'],
    queryFn: () => worklistService.getTecnicasPendientesPorProceso(idTecnicaProc!),
    enabled: !!idTecnicaProc,
    refetchInterval: 30000,
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 20000
  })
}

// Hook para validar si existe un proceso
export const useExisteProcesoConTecnicasPendientes = (idTecnicaProc: number | null) => {
  return useQuery({
    queryKey: ['worklist', 'proceso', idTecnicaProc, 'existe'],
    queryFn: () => worklistService.existeProcesoConTecnicasPendientes(idTecnicaProc!),
    enabled: !!idTecnicaProc
  })
}

// Hook para asignar técnico
export const useAsignarTecnico = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (asignacion: AsignacionTecnico) => worklistService.asignarTecnico(asignacion),
    onSuccess: () => {
      // Invalidar queries relacionadas para refrescar los datos
      queryClient.invalidateQueries({ queryKey: ['worklist'] })
    }
  })
}

// Hook para iniciar técnica
export const useIniciarTecnica = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (idTecnica: number) => worklistService.iniciarTecnica(idTecnica),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['worklist'] })
    }
  })
}

// Hook para completar técnica
export const useCompletarTecnica = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ idTecnica, comentarios }: { idTecnica: number; comentarios?: string }) =>
      worklistService.completarTecnica(idTecnica, comentarios),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['worklist'] })
    }
  })
}
