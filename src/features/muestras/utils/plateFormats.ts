export type PlateFormat = {
  label: string
  width: number
  heightLetter: string
}

export const PLATE_FORMATS: PlateFormat[] = [
  { label: '96 pocillos — 12 columnas × 8 filas (A–H)', width: 12, heightLetter: 'H' },
  { label: '96 pocillos — 8 columnas × 12 filas (A–L)', width: 8, heightLetter: 'L' },
  { label: '48 pocillos — 8 columnas × 6 filas (A–F)', width: 8, heightLetter: 'F' },
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

export const getFormatKey = (width: number, heightLetter: string): string =>
  `${width}x${heightLetter}`

export const findFormat = (width: number, heightLetter: string): PlateFormat | undefined =>
  PLATE_FORMATS.find(f => f.width === width && f.heightLetter === heightLetter)
