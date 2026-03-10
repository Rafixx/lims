import { useMutation, useQueryClient } from '@tanstack/react-query'
import muestrasService from '../services/muestras.services'
import { RegistroMasivoRequest, RegistroMasivoResult } from '../interfaces/registroMasivo.types'

export const letterToNumber = (letter: string): number => {
  const upper = letter.toUpperCase()
  if (upper.length !== 1 || upper < 'A' || upper > 'Z') return 0
  return upper.charCodeAt(0) - 64
}

export const calcPositionsPerPlate = (width: number, heightLetter: string): number => {
  const h = letterToNumber(heightLetter)
  if (h === 0 || width <= 0) return 0
  return width * h
}

export const calcPlatesNeeded = (totalMuestras: number, posPerPlate: number): number => {
  if (posPerPlate <= 0 || totalMuestras <= 0) return 0
  return Math.ceil(totalMuestras / posPerPlate)
}

export const calcEmptyPositions = (totalMuestras: number, posPerPlate: number): number => {
  if (posPerPlate <= 0 || totalMuestras <= 0) return 0
  const plates = calcPlatesNeeded(totalMuestras, posPerPlate)
  return plates * posPerPlate - totalMuestras
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
