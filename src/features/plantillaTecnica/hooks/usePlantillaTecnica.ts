// src/features/plantillaTecnica/hooks/usePlantillaTecnica.ts

import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { plantillaTecnicaService } from '../services/plantillaTecnicaService'
import { TecnicaProc } from '../interfaces/plantillaTecnica.types'
import { STALE_TIME } from '@/shared/constants/constants'

/**
 * Hook para obtener información de la plantilla técnica
 * @param idTecnicaProc ID de la técnica proc
 */
export const usePlantillaTecnica = (idTecnicaProc: number) => {
  const { data, isLoading, error, refetch }: UseQueryResult<TecnicaProc, Error> = useQuery({
    queryKey: ['plantillaTecnica', idTecnicaProc],
    queryFn: async () => plantillaTecnicaService.getPlantillaTecnica(idTecnicaProc),
    enabled: !!idTecnicaProc && idTecnicaProc > 0,
    staleTime: STALE_TIME
  })

  return {
    plantillaTecnica: data || null,
    isLoading,
    error,
    refetch
  }
}
