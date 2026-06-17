export type PlateFormat = {
  label: string
  width: number
  heightLetter: string
  fillDirection: 'row' | 'column'
}

export const PLATE_FORMATS: PlateFormat[] = [
  {
    label: '96 pocillos — numerar por filas (A01, A02 … A12, B01 …)',
    width: 12,
    heightLetter: 'H',
    fillDirection: 'row'
  },
  {
    label: '96 pocillos — numerar por columnas (A01, B01 … H01, A02 …)',
    width: 12,
    heightLetter: 'H',
    fillDirection: 'column'
  },
  {
    label: '48 pocillos — 8 columnas × 6 filas (A–F)',
    width: 8,
    heightLetter: 'F',
    fillDirection: 'row'
  }
]

export const calcPositionsPerPlate = (width: number, heightLetter: string): number => {
  if (!heightLetter || width <= 0) return 0
  const height = heightLetter.toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0) + 1
  return width * height
}

export const calcPlatesNeeded = (totalMuestras: number, posPerPlate: number): number => {
  if (posPerPlate <= 0 || totalMuestras <= 0) return 0
  return Math.ceil(totalMuestras / posPerPlate)
}

export const calcEmptyPositions = (
  totalMuestras: number,
  posPerPlate: number,
  numPlates: number
): number => {
  if (posPerPlate <= 0 || numPlates <= 0) return 0
  return posPerPlate * numPlates - totalMuestras
}

export const getFormatKey = (
  width: number,
  heightLetter: string,
  fillDirection?: 'row' | 'column'
): string => `${width}x${heightLetter}${fillDirection ? `-${fillDirection}` : ''}`

export const findFormat = (
  width: number,
  heightLetter: string,
  fillDirection?: 'row' | 'column'
): PlateFormat | undefined =>
  PLATE_FORMATS.find(
    f =>
      f.width === width &&
      f.heightLetter === heightLetter &&
      (fillDirection === undefined || f.fillDirection === fillDirection)
  )
