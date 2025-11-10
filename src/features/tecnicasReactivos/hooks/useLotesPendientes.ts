// src/features/tecnicasReactivos/hooks/useLotesPendientes.ts

import { useQuery } from '@tanstack/react-query'
import { tecnicaReactivoService } from '../services/tecnicaReactivoService'

/**
 * Hook para obtener el número de lotes pendientes de un worklist
 * Usa el endpoint optimizado que incluye estadísticas
 */
export const useLotesPendientes = (worklistId: number) => {
  return useQuery({
    queryKey: ['lotesPendientes', worklistId],
    queryFn: async () => {
      // Usar endpoint optimizado que incluye estadísticas
      const data = await tecnicaReactivoService.getWorklistTecnicasReactivosOptimizado(worklistId)

      return {
        total: data.estadisticas.totalReactivos,
        pendientes: data.estadisticas.lotesPendientes,
        completados: data.estadisticas.lotesCompletos
      }
    },
    enabled: !!worklistId && worklistId > 0,
    staleTime: 30000 // 30 segundos - se actualiza frecuentemente
  })
}
