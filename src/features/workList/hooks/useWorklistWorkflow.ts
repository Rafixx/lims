// src/features/workList/hooks/useWorklistWorkflow.ts

import { useMemo } from 'react'
import { Tecnica } from '../interfaces/worklist.types'
import { ESTADO_TECNICA } from '@/shared/interfaces/estados.types'

/**
 * Estados del flujo de trabajo del Worklist
 *
 * Flujo secuencial:
 * CREATED → TECNICO_ASSIGNED → TECNICAS_STARTED → RESULTS_IMPORTED
 */
export enum WorklistWorkflowState {
  /** Estado inicial - worklist recién creado */
  CREATED = 'CREATED',

  /** Técnico asignado a todas las técnicas */
  TECNICO_ASSIGNED = 'TECNICO_ASSIGNED',

  /** Técnicas iniciadas (after clicked on "Iniciar Técnicas") */
  TECNICAS_STARTED = 'TECNICAS_STARTED',

  /** Resultados importados */
  RESULTS_IMPORTED = 'RESULTS_IMPORTED'
}

/**
 * Permisos de acciones según el estado del workflow
 */
export interface WorkflowPermissions {
  canAssignTecnico: boolean
  canStartTecnicas: boolean
  canImportResults: boolean
  canManagePlantillaTecnica: boolean
  canManageLotes: boolean
}

/**
 * Estado completo del workflow
 */
interface WorklistWorkflow {
  currentState: WorklistWorkflowState
  permissions: WorkflowPermissions
  canTransitionTo: (nextState: WorklistWorkflowState) => boolean
}

/**
 * Hook para gestionar el flujo de trabajo del worklist
 * Determina qué acciones están disponibles según el estado actual
 */
export const useWorklistWorkflow = (tecnicas: Tecnica[]): WorklistWorkflow => {
  const workflow = useMemo(() => {
    const totalTecnicas = tecnicas.length

    // Verificar si todas las técnicas tienen técnico asignado
    // El backend puede devolver tecnico_resp con diferentes estructuras
    const allTecnicasHaveTecnico =
      totalTecnicas > 0 &&
      tecnicas.every(tecnica => {
        const tecnicoResp = tecnica.tecnico_resp

        if (!tecnicoResp) return false

        // Verificar diferentes estructuras posibles del backend:
        // 1. Objeto con id_usuario: { id_usuario: number, nombre: string }
        if ('id_usuario' in tecnicoResp && tecnicoResp.id_usuario) return true

        // 2. Objeto con nombre: { nombre: string }
        if ('nombre' in tecnicoResp && tecnicoResp.nombre) return true

        return false
      })

    // Verificar si las técnicas han sido iniciadas
    // Consideramos que están iniciadas si TODAS tienen id_estado diferente de PENDIENTE (> 1)
    // Y todas tienen técnico asignado
    const tecnicasStarted =
      totalTecnicas > 0 &&
      allTecnicasHaveTecnico &&
      tecnicas.every(
        tecnica =>
          tecnica.id_estado !== undefined && tecnica.id_estado === ESTADO_TECNICA.EN_PROCESO
      )

    // Verificar si tienen resultados importados
    const hasResults =
      totalTecnicas > 0 &&
      tecnicas.some(tecnica => {
        return Boolean(
          tecnica.resultados &&
            tecnica.resultados.length > 0 &&
            tecnica.resultados.some(
              resultado =>
                resultado.valor !== null ||
                resultado.valor_texto ||
                resultado.valor_fecha ||
                resultado.tipo_res
            )
        )
      })

    // Determinar el estado actual del workflow (orden de prioridad)
    let currentState: WorklistWorkflowState

    if (hasResults) {
      currentState = WorklistWorkflowState.RESULTS_IMPORTED
    } else if (tecnicasStarted) {
      currentState = WorklistWorkflowState.TECNICAS_STARTED
    } else if (allTecnicasHaveTecnico) {
      currentState = WorklistWorkflowState.TECNICO_ASSIGNED
    } else {
      currentState = WorklistWorkflowState.CREATED
    }

    // Definir permisos según el estado actual
    const permissions: WorkflowPermissions = getPermissionsForState(currentState)

    // Función para validar transiciones de estado
    const canTransitionTo = (nextState: WorklistWorkflowState): boolean => {
      return isValidTransition(currentState, nextState)
    }

    return {
      currentState,
      permissions,
      canTransitionTo
    }
  }, [tecnicas])

  return workflow
}

/**
 * Obtiene los permisos para un estado dado
 *
 * Matriz de permisos:
 * | Estado               | Técnico | Iniciar | Importar | Plantilla | Lotes |
 * |----------------------|---------|---------|----------|-----------|-------|
 * | CREATED              |    ✅   |    ❌   |    ❌    |     ❌    |   ❌  |
 * | TECNICO_ASSIGNED     |    ✅   |    ✅   |    ❌    |     ❌    |   ❌  |
 * | TECNICAS_STARTED     |    ❌   |    ❌   |    ✅    |     ❌    |   ✅  |
 * | RESULTS_IMPORTED     |    ❌   |    ❌   |    ❌    |     ✅    |   ✅  |
 */
function getPermissionsForState(state: WorklistWorkflowState): WorkflowPermissions {
  switch (state) {
    case WorklistWorkflowState.CREATED:
      // Worklist recién creado - solo puede asignar técnico
      return {
        canAssignTecnico: true,
        canStartTecnicas: false,
        canImportResults: false,
        canManagePlantillaTecnica: false,
        canManageLotes: false
      }

    case WorklistWorkflowState.TECNICO_ASSIGNED:
      // Técnico asignado - puede iniciar técnicas o seguir asignando
      return {
        canAssignTecnico: true,
        canStartTecnicas: true,
        canImportResults: false,
        canManagePlantillaTecnica: false,
        canManageLotes: false
      }

    case WorklistWorkflowState.TECNICAS_STARTED:
      // Técnicas iniciadas - puede importar resultados y gestionar lotes
      return {
        canAssignTecnico: false,
        canStartTecnicas: false,
        canImportResults: true,
        canManagePlantillaTecnica: false,
        canManageLotes: true
      }

    case WorklistWorkflowState.RESULTS_IMPORTED:
      // Resultados importados - solo puede gestionar plantilla y lotes
      return {
        canAssignTecnico: false,
        canStartTecnicas: false,
        canImportResults: false,
        canManagePlantillaTecnica: true,
        canManageLotes: true
      }

    default:
      // Por defecto, todo bloqueado
      return {
        canAssignTecnico: false,
        canStartTecnicas: false,
        canImportResults: false,
        canManagePlantillaTecnica: false,
        canManageLotes: false
      }
  }
}

/**
 * Valida si una transición de estado es permitida
 */
function isValidTransition(from: WorklistWorkflowState, to: WorklistWorkflowState): boolean {
  const validTransitions: Record<WorklistWorkflowState, WorklistWorkflowState[]> = {
    [WorklistWorkflowState.CREATED]: [WorklistWorkflowState.TECNICO_ASSIGNED],

    [WorklistWorkflowState.TECNICO_ASSIGNED]: [WorklistWorkflowState.TECNICAS_STARTED],

    [WorklistWorkflowState.TECNICAS_STARTED]: [WorklistWorkflowState.RESULTS_IMPORTED],

    [WorklistWorkflowState.RESULTS_IMPORTED]: []
  }

  return validTransitions[from]?.includes(to) ?? false
}

/**
 * Mensajes de ayuda según el estado
 */
export function getWorkflowHelpMessage(state: WorklistWorkflowState): string {
  switch (state) {
    case WorklistWorkflowState.CREATED:
      return 'Asigna un técnico a cada técnica para continuar'

    case WorklistWorkflowState.TECNICO_ASSIGNED:
      return 'Haz clic en "Iniciar Técnicas" para comenzar el trabajo'

    case WorklistWorkflowState.TECNICAS_STARTED:
      return 'Importa los resultados de las técnicas realizadas'

    case WorklistWorkflowState.RESULTS_IMPORTED:
      return 'Gestiona la plantilla técnica y los lotes de reactivos'

    default:
      return ''
  }
}

/**
 * Obtiene el tooltip para un botón deshabilitado
 */
export function getDisabledTooltip(
  action: keyof WorkflowPermissions,
  currentState: WorklistWorkflowState
): string {
  const messages: Record<
    WorklistWorkflowState,
    Partial<Record<keyof WorkflowPermissions, string>>
  > = {
    [WorklistWorkflowState.CREATED]: {
      canStartTecnicas: 'Primero asigna un técnico a todas las técnicas',
      canImportResults: 'Primero debes asignar técnicos e iniciar las técnicas',
      canManagePlantillaTecnica: 'Primero debes importar los resultados',
      canManageLotes: 'Primero debes iniciar las técnicas'
    },

    [WorklistWorkflowState.TECNICO_ASSIGNED]: {
      canImportResults: 'Primero haz clic en "Iniciar Técnicas"',
      canManagePlantillaTecnica: 'Primero debes iniciar las técnicas e importar resultados',
      canManageLotes: 'Primero haz clic en "Iniciar Técnicas"'
    },

    [WorklistWorkflowState.TECNICAS_STARTED]: {
      canAssignTecnico: 'No puedes cambiar técnicos después de iniciar las técnicas',
      canStartTecnicas: 'Las técnicas ya han sido iniciadas',
      canManagePlantillaTecnica: 'Primero debes importar los resultados'
    },

    [WorklistWorkflowState.RESULTS_IMPORTED]: {
      canAssignTecnico: 'No puedes cambiar técnicos después de importar resultados',
      canStartTecnicas: 'Las técnicas ya han sido iniciadas',
      canImportResults: 'Los resultados ya han sido importados'
    }
  }

  return messages[currentState]?.[action] || 'Esta acción no está disponible en este momento'
}
