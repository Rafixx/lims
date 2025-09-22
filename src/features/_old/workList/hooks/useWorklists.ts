// src/features/workList/hooks/useWorklistsNew.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { worklistService } from '../services/worklistService'
import { useNotification } from '@/shared/components/Notification/NotificationContext'
import type {
  Worklist,
  CreateWorklistRequest,
  AsignarTecnicasRequest,
  RemoverTecnicasRequest,
  AsignarTecnicoRequest
} from '../interfaces/worklist.types'

// ================================
// HOOKS PARA CRUD DE WORKLISTS
// ================================

/**
 * Hook para obtener todos los worklists
 */
export const useWorklists = () => {
  return useQuery({
    queryKey: ['worklists'],
    queryFn: () => worklistService.obtenerWorklists(),
    staleTime: 5 * 60 * 1000 // 5 minutos
  })
}

/**
 * Hook para obtener un worklist específico por ID
 */
export const useWorklist = (id: number) => {
  return useQuery({
    queryKey: ['worklist', id],
    queryFn: () => worklistService.obtenerWorklistPorId(id),
    enabled: !!id
  })
}

/**
 * Hook para crear un nuevo worklist
 */
export const useCreateWorklist = () => {
  const queryClient = useQueryClient()
  const { notify } = useNotification()

  return useMutation({
    mutationFn: (data: CreateWorklistRequest) => worklistService.crearWorklist(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['worklists'] })
      notify('Worklist creado exitosamente', 'success')
    },
    onError: error => {
      notify('Error al crear el worklist', 'error')
      console.error('Error creating worklist:', error)
    }
  })
}

/**
 * Hook para actualizar un worklist
 */
export const useUpdateWorklist = () => {
  const queryClient = useQueryClient()
  const { notify } = useNotification()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Worklist> }) =>
      worklistService.actualizarWorklist(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['worklist', id] })
      queryClient.invalidateQueries({ queryKey: ['worklists'] })
      notify('Worklist actualizado exitosamente', 'success')
    },
    onError: error => {
      notify('Error al actualizar el worklist', 'error')
      console.error('Error updating worklist:', error)
    }
  })
}

/**
 * Hook para eliminar un worklist
 */
export const useDeleteWorklist = () => {
  const queryClient = useQueryClient()
  const { notify } = useNotification()

  return useMutation({
    mutationFn: (id: number) => worklistService.eliminarWorklist(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['worklists'] })
      notify('Worklist eliminado exitosamente', 'success')
    },
    onError: error => {
      notify('Error al eliminar el worklist', 'error')
      console.error('Error deleting worklist:', error)
    }
  })
}

// ================================
// HOOKS PARA TÉCNICAS SIN ASIGNAR
// ================================

/**
 * Hook para obtener técnicas sin asignar
 */
export const useTecnicasSinAsignar = (dimTecnicasProc?: string) => {
  return useQuery({
    queryKey: ['tecnicas-sin-asignar', dimTecnicasProc],
    queryFn: () => worklistService.obtenerTecnicasSinAsignar(dimTecnicasProc),
    enabled: true
  })
}

/**
 * Hook para obtener procesos disponibles
 */
export const useProcesosDisponibles = () => {
  return useQuery({
    queryKey: ['procesos-disponibles'],
    queryFn: () => worklistService.obtenerProcesosDisponibles(),
    staleTime: 10 * 60 * 1000 // 10 minutos
  })
}

// ================================
// HOOKS PARA OPERACIONES DE WORKLIST
// ================================

/**
 * Hook para asignar técnicas a un worklist
 */
export const useAsignarTecnicas = () => {
  const queryClient = useQueryClient()
  const { notify } = useNotification()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: AsignarTecnicasRequest }) =>
      worklistService.asignarTecnicas(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['worklist', id] })
      queryClient.invalidateQueries({ queryKey: ['worklist-estadisticas', id] })
      queryClient.invalidateQueries({ queryKey: ['worklist-tecnicas-agrupadas', id] })
      queryClient.invalidateQueries({ queryKey: ['tecnicas-sin-asignar'] })
      notify('Técnicas asignadas exitosamente', 'success')
    },
    onError: error => {
      notify('Error al asignar técnicas', 'error')
      console.error('Error assigning techniques:', error)
    }
  })
}

/**
 * Hook para remover técnicas de un worklist
 */
export const useRemoverTecnicas = () => {
  const queryClient = useQueryClient()
  const { notify } = useNotification()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: RemoverTecnicasRequest }) =>
      worklistService.removerTecnicas(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['worklist', id] })
      queryClient.invalidateQueries({ queryKey: ['worklist-estadisticas', id] })
      queryClient.invalidateQueries({ queryKey: ['worklist-tecnicas-agrupadas', id] })
      queryClient.invalidateQueries({ queryKey: ['tecnicas-sin-asignar'] })
      notify('Técnicas removidas exitosamente', 'success')
    },
    onError: error => {
      notify('Error al remover técnicas', 'error')
      console.error('Error removing techniques:', error)
    }
  })
}

/**
 * Hook para obtener estadísticas de un worklist
 */
export const useWorklistEstadisticas = (id: number) => {
  return useQuery({
    queryKey: ['worklist-estadisticas', id],
    queryFn: () => worklistService.obtenerEstadisticas(id),
    enabled: !!id,
    refetchInterval: 30000 // Actualizar cada 30 segundos
  })
}

/**
 * Hook para obtener técnicas agrupadas de un worklist
 */
export const useWorklistTecnicasAgrupadas = (id: number) => {
  return useQuery({
    queryKey: ['worklist-tecnicas-agrupadas', id],
    queryFn: () => worklistService.obtenerTecnicasAgrupadas(id),
    enabled: !!id
  })
}

// ================================
// HOOKS PARA OPERACIONES DE TÉCNICA
// ================================

/**
 * Hook para asignar técnico a una técnica
 */
export const useAsignarTecnico = () => {
  const queryClient = useQueryClient()
  const { notify } = useNotification()

  return useMutation({
    mutationFn: ({ idTecnica, data }: { idTecnica: number; data: AsignarTecnicoRequest }) =>
      worklistService.asignarTecnico(idTecnica, data),
    onSuccess: () => {
      // Invalidar todas las queries relacionadas con técnicas
      queryClient.invalidateQueries({ queryKey: ['worklist-tecnicas-agrupadas'] })
      queryClient.invalidateQueries({ queryKey: ['worklist-estadisticas'] })
      notify('Técnico asignado exitosamente', 'success')
    },
    onError: error => {
      notify('Error al asignar técnico', 'error')
      console.error('Error assigning technician:', error)
    }
  })
}

/**
 * Hook para iniciar una técnica
 */
export const useIniciarTecnica = () => {
  const queryClient = useQueryClient()
  const { notify } = useNotification()

  return useMutation({
    mutationFn: (idTecnica: number) => worklistService.iniciarTecnica(idTecnica),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['worklist-tecnicas-agrupadas'] })
      queryClient.invalidateQueries({ queryKey: ['worklist-estadisticas'] })
      notify('Técnica iniciada exitosamente', 'success')
    },
    onError: error => {
      notify('Error al iniciar técnica', 'error')
      console.error('Error starting technique:', error)
    }
  })
}

/**
 * Hook para completar una técnica
 */
export const useCompletarTecnica = () => {
  const queryClient = useQueryClient()
  const { notify } = useNotification()

  return useMutation({
    mutationFn: (idTecnica: number) => worklistService.completarTecnica(idTecnica),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['worklist-tecnicas-agrupadas'] })
      queryClient.invalidateQueries({ queryKey: ['worklist-estadisticas'] })
      notify('Técnica completada exitosamente', 'success')
    },
    onError: error => {
      notify('Error al completar técnica', 'error')
      console.error('Error completing technique:', error)
    }
  })
}
