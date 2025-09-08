/**
 * Hook personalizado para gestión centralizada de estados
 * Proporciona funcionalidades avanzadas para trabajar con el sistema de estados
 */

import { useState, useCallback, useMemo } from 'react'
import { type AppEstado } from '../constants/appStates'
import {
  esTransicionValida,
  getEstadosPermitidos,
  getEstadoConfig,
  esEstadoFinal,
  toAppEstado,
  contarPorEstado,
  getEstadisticasEstados,
  ordenarPorPrioridad
} from '../utils/stateHelpers'

// ================================
// TIPOS
// ================================

export interface UseStateManagerOptions {
  initialState?: AppEstado
  onStateChange?: (newState: AppEstado, previousState: AppEstado) => void
  onInvalidTransition?: (currentState: AppEstado, attemptedState: AppEstado) => void
}

export interface StateManagerResult {
  // Estado actual
  currentState: AppEstado | null
  config: ReturnType<typeof getEstadoConfig> | null

  // Acciones de cambio de estado
  setState: (newState: AppEstado | string) => boolean
  forceSetState: (newState: AppEstado | string) => void
  resetState: () => void

  // Información de transiciones
  allowedStates: AppEstado[]
  canTransitionTo: (state: AppEstado) => boolean
  isFinalState: boolean

  // Historial
  history: AppEstado[]
  canUndo: boolean
  undo: () => boolean

  // Validaciones
  isValidState: (state: string) => boolean
}

// ================================
// HOOK PRINCIPAL
// ================================

export const useStateManager = (options: UseStateManagerOptions = {}): StateManagerResult => {
  const { initialState, onStateChange, onInvalidTransition } = options

  // Estados internos
  const [currentState, setCurrentState] = useState<AppEstado | null>(initialState || null)
  const [history, setHistory] = useState<AppEstado[]>(initialState ? [initialState] : [])

  // Configuración del estado actual
  const config = useMemo(() => {
    return currentState ? getEstadoConfig(currentState) : null
  }, [currentState])

  // Estados permitidos desde el estado actual
  const allowedStates = useMemo(() => {
    return currentState ? getEstadosPermitidos(currentState) : []
  }, [currentState])

  // Verificar si es estado final
  const isFinalState = useMemo(() => {
    return currentState ? esEstadoFinal(currentState) : false
  }, [currentState])

  // Función para cambiar estado con validación
  const setState = useCallback(
    (newState: AppEstado | string) => {
      const estadoParsed = typeof newState === 'string' ? toAppEstado(newState) : newState

      if (!estadoParsed) {
        console.warn(`⚠️ Estado inválido: ${newState}`)
        return false
      }

      // Si no hay estado actual, establecer directamente
      if (!currentState) {
        const previousState = currentState
        setCurrentState(estadoParsed)
        setHistory(prev => [...prev, estadoParsed])
        if (onStateChange && previousState) {
          onStateChange(estadoParsed, previousState)
        }
        return true
      }

      // Validar transición
      if (!esTransicionValida(currentState, estadoParsed)) {
        console.warn(`⚠️ Transición inválida: ${currentState} → ${estadoParsed}`)
        onInvalidTransition?.(currentState, estadoParsed)
        return false
      }

      // Realizar cambio de estado
      const previousState = currentState
      setCurrentState(estadoParsed)
      setHistory(prev => [...prev, estadoParsed])
      onStateChange?.(estadoParsed, previousState)
      return true
    },
    [currentState, onStateChange, onInvalidTransition]
  )

  // Función para forzar cambio de estado sin validación
  const forceSetState = useCallback(
    (newState: AppEstado | string) => {
      const estadoParsed = typeof newState === 'string' ? toAppEstado(newState) : newState

      if (!estadoParsed) {
        console.warn(`⚠️ Estado inválido: ${newState}`)
        return
      }

      const previousState = currentState
      setCurrentState(estadoParsed)
      setHistory(prev => [...prev, estadoParsed])
      if (onStateChange && previousState) {
        onStateChange(estadoParsed, previousState)
      }
    },
    [currentState, onStateChange]
  )

  // Función para resetear estado
  const resetState = useCallback(() => {
    setCurrentState(initialState || null)
    setHistory(initialState ? [initialState] : [])
  }, [initialState])

  // Función para verificar si puede transicionar a un estado
  const canTransitionTo = useCallback(
    (state: AppEstado) => {
      return currentState ? esTransicionValida(currentState, state) : true
    },
    [currentState]
  )

  // Función para deshacer último cambio
  const undo = useCallback(() => {
    if (history.length <= 1) return false

    const newHistory = history.slice(0, -1)
    const previousState = newHistory[newHistory.length - 1]

    setHistory(newHistory)
    setCurrentState(previousState || null)

    return true
  }, [history])

  // Función para validar estados
  const isValidState = useCallback((state: string) => {
    return toAppEstado(state) !== null
  }, [])

  return {
    // Estado actual
    currentState,
    config,

    // Acciones
    setState,
    forceSetState,
    resetState,

    // Información de transiciones
    allowedStates,
    canTransitionTo,
    isFinalState,

    // Historial
    history,
    canUndo: history.length > 1,
    undo,

    // Validaciones
    isValidState
  }
}

// ================================
// HOOKS ESPECIALIZADOS
// ================================

/**
 * Hook específico para manejar estados de solicitudes
 */
export const useSolicitudStateManager = (initialState?: AppEstado) => {
  return useStateManager({
    initialState,
    onStateChange: (newState, previousState) => {
      console.log(`📝 Solicitud: ${previousState} → ${newState}`)
    }
  })
}

/**
 * Hook específico para manejar estados de técnicas
 */
export const useTecnicaStateManager = (initialState?: AppEstado) => {
  return useStateManager({
    initialState,
    onStateChange: (newState, previousState) => {
      console.log(`🧪 Técnica: ${previousState} → ${newState}`)
    }
  })
}

/**
 * Hook para analizar una colección de elementos con estados
 */
export const useStateAnalytics = <T>(items: T[], getEstado: (item: T) => AppEstado) => {
  const estadisticas = useMemo(() => {
    return getEstadisticasEstados(items, getEstado)
  }, [items, getEstado])

  const conteos = useMemo(() => {
    return contarPorEstado(items, getEstado)
  }, [items, getEstado])

  const estadosOrdenados = useMemo(() => {
    const estadosUnicos = [...new Set(items.map(getEstado))]
    return ordenarPorPrioridad(estadosUnicos)
  }, [items, getEstado])

  const itemsPorPrioridad = useMemo(() => {
    return items.sort((a, b) => {
      const estadoA = getEstado(a)
      const estadoB = getEstado(b)
      const configA = getEstadoConfig(estadoA)
      const configB = getEstadoConfig(estadoB)
      return configA.priority - configB.priority
    })
  }, [items, getEstado])

  return {
    estadisticas,
    conteos,
    estadosOrdenados,
    itemsPorPrioridad,
    totalItems: items.length
  }
}
