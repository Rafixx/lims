// src/features/workList/hooks/useWorklistNew.ts
// Hook mejorado que integra el sistema de estados centralizado

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState, useMemo } from 'react'
import { useNotification } from '@/shared/components/Notification/NotificationContext'
import { useStateAnalytics } from '@/shared/hooks/useStateManager'
import { APP_STATES, type TecnicaEstado } from '@/shared/states'
import {
  contarPorEstado,
  filtrarYOrdenarPorEstado,
  getEstadisticasEstados
} from '@/shared/utils/stateHelpers'
import { worklistService } from '../services/worklistService'
import type { EstadisticasWorklist } from '../interfaces/worklist.types'

// ============================================
// HOOK PRINCIPAL CON GESTIÓN DE ESTADOS
// ============================================

export const useWorklistWithStates = () => {
  const queryClient = useQueryClient()
  const { notify } = useNotification()
  const [filtrosEstado, setFiltrosEstado] = useState<TecnicaEstado[]>([])
  const [ordenamiento, setOrdenamiento] = useState<'prioridad' | 'fecha' | 'estado'>('prioridad')

  // ============================================
  // QUERIES CON INTEGRACIÓN DE ESTADOS
  // ============================================

  const {
    data: tecnicasRaw = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['worklist', 'tecnicas-pendientes'],
    queryFn: worklistService.getTecnicasPendientesConProceso,
    refetchInterval: 30000,
    staleTime: 20000
  })

  // ============================================
  // ANÁLISIS DE ESTADOS USANDO SISTEMA CENTRALIZADO
  // ============================================

  const estadisticas = useMemo((): EstadisticasWorklist => {
    const conteos = contarPorEstado(tecnicasRaw, t => t.estado)
    const estadisticasGenerales = getEstadisticasEstados(tecnicasRaw, t => t.estado)

    return {
      total_tecnicas_pendientes: conteos[APP_STATES.TECNICA.PENDIENTE] || 0,
      total_procesos: new Set(tecnicasRaw.map(t => t.id_tecnica_proc)).size,
      total_tecnicas_en_progreso: conteos[APP_STATES.TECNICA.EN_PROGRESO] || 0,
      total_tecnicas_completadas_hoy: conteos[APP_STATES.TECNICA.COMPLETADA] || 0,
      promedio_tiempo_procesamiento: null, // Calcular en backend
      conteo_por_estado: conteos,
      estados_criticos: estadisticasGenerales
        .filter(e => e.config.priority <= 2) // Estados con prioridad alta
        .map(e => e.estado)
        .filter((estado): estado is TecnicaEstado =>
          Object.values(APP_STATES.TECNICA).includes(estado as TecnicaEstado)
        )
    }
  }, [tecnicasRaw])

  // ============================================
  // FILTRADO Y ORDENAMIENTO CON SISTEMA DE ESTADOS
  // ============================================

  const tecnicasFiltradas = useMemo(() => {
    let result = tecnicasRaw

    // Filtrar por estado si hay filtros activos
    if (filtrosEstado.length > 0) {
      result = result.filter(tecnica => filtrosEstado.includes(tecnica.estado))
    }

    // Ordenar usando utilidades del sistema de estados
    if (ordenamiento === 'estado') {
      result = filtrarYOrdenarPorEstado(result, t => t.estado)
    } else {
      // Ordenamiento personalizado por fecha o prioridad
      result = [...result].sort((a, b) => {
        if (ordenamiento === 'fecha') {
          return new Date(b.fecha_estado).getTime() - new Date(a.fecha_estado).getTime()
        }
        // Por defecto, usar prioridad del estado
        return (
          filtrarYOrdenarPorEstado([a, b], t => t.estado).indexOf(a) -
          filtrarYOrdenarPorEstado([a, b], t => t.estado).indexOf(b)
        )
      })
    }

    return result
  }, [tecnicasRaw, filtrosEstado, ordenamiento])

  // ============================================
  // ANALYTICS USANDO HOOK CENTRALIZADO
  // ============================================

  const analytics = useStateAnalytics(tecnicasRaw, tecnica => tecnica.estado)

  // ============================================
  // MUTATIONS CON VALIDACIÓN DE TRANSICIONES
  // ============================================

  const cambiarEstadoMutation = useMutation({
    mutationFn: async ({
      idTecnica,
      estadoActual,
      nuevoEstado
    }: {
      idTecnica: number
      estadoActual: TecnicaEstado
      nuevoEstado: TecnicaEstado
    }) => {
      // Validar transición usando sistema centralizado
      const { esTransicionValida } = await import('@/shared/utils/stateHelpers')

      if (!esTransicionValida(estadoActual, nuevoEstado)) {
        throw new Error(`Transición no válida de ${estadoActual} a ${nuevoEstado}`)
      }

      // Ejecutar cambio según el nuevo estado
      switch (nuevoEstado) {
        case APP_STATES.TECNICA.EN_PROGRESO:
          return worklistService.iniciarTecnica(idTecnica)
        case APP_STATES.TECNICA.COMPLETADA:
          return worklistService.completarTecnica(idTecnica)
        default:
          throw new Error(`Estado no manejado: ${nuevoEstado}`)
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['worklist'] })
      notify(`Técnica actualizada a ${variables.nuevoEstado}`, 'success')
    },
    onError: error => {
      notify(`Error al cambiar estado: ${error.message}`, 'error')
    }
  })

  // ============================================
  // FUNCIONES DE CONTROL
  // ============================================

  const toggleFiltroEstado = (estado: TecnicaEstado) => {
    setFiltrosEstado(prev =>
      prev.includes(estado) ? prev.filter(e => e !== estado) : [...prev, estado]
    )
  }

  const limpiarFiltros = () => {
    setFiltrosEstado([])
  }

  const cambiarEstadoTecnica = (
    idTecnica: number,
    estadoActual: TecnicaEstado,
    nuevoEstado: TecnicaEstado
  ) => {
    cambiarEstadoMutation.mutate({ idTecnica, estadoActual, nuevoEstado })
  }

  // ============================================
  // RETURN INTERFACE
  // ============================================

  return {
    // Datos
    tecnicas: tecnicasFiltradas,
    tecnicasRaw,
    estadisticas,
    analytics,

    // Estados de carga
    isLoading,
    error,
    isUpdating: cambiarEstadoMutation.isPending,

    // Filtros y ordenamiento
    filtrosEstado,
    ordenamiento,
    setOrdenamiento,
    toggleFiltroEstado,
    limpiarFiltros,

    // Acciones
    cambiarEstadoTecnica,
    refetch
  }
}
