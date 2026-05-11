import { useMutation, useQueryClient } from '@tanstack/react-query'
import muestrasService from '../services/muestras.services'
import { RegistroMasivoRequest, RegistroMasivoResult } from '../interfaces/registroMasivo.types'
import {
  calcPositionsPerPlate as calcPositionsPerPlateUtil,
  calcPlatesNeeded as calcPlatesNeededUtil,
  calcEmptyPositions as calcEmptyPositionsUtil,
} from '../utils/plateFormats'

// Re-export from plateFormats for backward compatibility with existing consumers
export const calcPositionsPerPlate = calcPositionsPerPlateUtil
export const calcPlatesNeeded = calcPlatesNeededUtil

export const calcEmptyPositions = (totalMuestras: number, posPerPlate: number): number => {
  if (posPerPlate <= 0 || totalMuestras <= 0) return 0
  const plates = calcPlatesNeededUtil(totalMuestras, posPerPlate)
  return calcEmptyPositionsUtil(totalMuestras, posPerPlate, plates)
}

export const useRegistroMasivo = () => {
  const queryClient = useQueryClient()

  return useMutation<RegistroMasivoResult, Error, RegistroMasivoRequest>({
    mutationFn: (data: RegistroMasivoRequest) => muestrasService.registroMasivo(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['muestras'] })
    }
  })
}
