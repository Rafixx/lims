// src/features/workList/hooks/useWorklistStats.ts

import { useMemo } from 'react'
import { Tecnica } from '../interfaces/worklist.types'
import { ESTADO_TECNICA } from '@/shared/interfaces/estados.types'

interface WorklistStats {
  totalTecnicas: number
  tecnicasEnProgreso: number
  tecnicasCompletadas: number
  porcentajeProgreso: number
  allTecnicasHaveResults: boolean
  allTecnicasHaveTecnicoLab: boolean
}

/**
 * Hook para calcular estadísticas del worklist
 * Usa id_estado (número) en lugar de strings para mayor precisión
 */
export const useWorklistStats = (tecnicas: Tecnica[]): WorklistStats => {
  return useMemo(() => {
    const totalTecnicas = tecnicas.length

    // Contar técnicas en progreso (usando id_estado)
    // Estados considerados "en progreso": PENDIENTE, ASIGNADA, EN_PROCESO, EN_REVISION, PAUSADA, REINTENTANDO
    const tecnicasEnProgreso = tecnicas.filter(
      tecnica =>
        tecnica.id_estado === ESTADO_TECNICA.PENDIENTE ||
        tecnica.id_estado === ESTADO_TECNICA.ASIGNADA ||
        tecnica.id_estado === ESTADO_TECNICA.EN_PROCESO ||
        tecnica.id_estado === ESTADO_TECNICA.EN_REVISION ||
        tecnica.id_estado === ESTADO_TECNICA.PAUSADA ||
        tecnica.id_estado === ESTADO_TECNICA.REINTENTANDO
    ).length

    // Contar técnicas completadas
    const tecnicasCompletadas = tecnicas.filter(
      tecnica => tecnica.id_estado === ESTADO_TECNICA.COMPLETADA_TECNICA
    ).length

    // Calcular porcentaje de progreso
    const porcentajeProgreso =
      totalTecnicas > 0 ? Math.round((tecnicasCompletadas / totalTecnicas) * 100) : 0

    // Verificar si todas las técnicas tienen resultados
    const allTecnicasHaveResults =
      totalTecnicas > 0 &&
      tecnicas.every(tecnica => {
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

    const allTecnicasHaveTecnicoLab =
      totalTecnicas > 0 &&
      tecnicas.every(tecnica => {
        return Boolean(tecnica.tecnico_resp?.id_usuario)
      })

    return {
      totalTecnicas,
      tecnicasEnProgreso,
      tecnicasCompletadas,
      porcentajeProgreso,
      allTecnicasHaveResults,
      allTecnicasHaveTecnicoLab
    }
  }, [tecnicas])
}
