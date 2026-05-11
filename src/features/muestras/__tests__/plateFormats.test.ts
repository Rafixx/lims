import {
  calcPositionsPerPlate,
  calcPlatesNeeded,
  calcEmptyPositions,
  getFormatKey,
  findFormat,
  PLATE_FORMATS,
} from '../utils/plateFormats'

describe('calcPositionsPerPlate', () => {
  it('calcula correctamente 12 columnas × 8 filas (H) = 96', () => {
    expect(calcPositionsPerPlate(12, 'H')).toBe(96)
  })

  it('calcula correctamente 8 columnas × 12 filas (L) = 96', () => {
    // L es la 12ª letra del alfabeto
    expect(calcPositionsPerPlate(8, 'L')).toBe(96)
  })

  it('calcula correctamente 8 columnas × 6 filas (F) = 48', () => {
    expect(calcPositionsPerPlate(8, 'F')).toBe(48)
  })

  it('retorna 0 si width <= 0', () => {
    expect(calcPositionsPerPlate(0, 'H')).toBe(0)
    expect(calcPositionsPerPlate(-1, 'H')).toBe(0)
  })

  it('retorna 0 si heightLetter está vacío', () => {
    expect(calcPositionsPerPlate(12, '')).toBe(0)
  })

  it('acepta heightLetter en minúsculas', () => {
    expect(calcPositionsPerPlate(12, 'h')).toBe(96)
  })
})

describe('calcPlatesNeeded', () => {
  it('usa Math.ceil: 97 muestras / 96 por placa = 2 placas', () => {
    expect(calcPlatesNeeded(97, 96)).toBe(2)
  })

  it('exacto: 96 muestras / 96 por placa = 1 placa', () => {
    expect(calcPlatesNeeded(96, 96)).toBe(1)
  })

  it('mínimo: 1 muestra / 96 por placa = 1 placa', () => {
    expect(calcPlatesNeeded(1, 96)).toBe(1)
  })

  it('retorna 0 si totalMuestras es 0', () => {
    expect(calcPlatesNeeded(0, 96)).toBe(0)
  })

  it('retorna 0 si posPerPlate es 0', () => {
    expect(calcPlatesNeeded(96, 0)).toBe(0)
  })

  it('retorna 0 si totalMuestras es negativo', () => {
    expect(calcPlatesNeeded(-5, 96)).toBe(0)
  })
})

describe('calcEmptyPositions', () => {
  it('97 muestras, 96 por placa, 2 placas → 95 vacías', () => {
    expect(calcEmptyPositions(97, 96, 2)).toBe(95)
  })

  it('96 muestras, 96 por placa, 1 placa → 0 vacías', () => {
    expect(calcEmptyPositions(96, 96, 1)).toBe(0)
  })

  it('1 muestra, 96 por placa, 1 placa → 95 vacías', () => {
    expect(calcEmptyPositions(1, 96, 1)).toBe(95)
  })

  it('retorna 0 si numPlates es 0', () => {
    expect(calcEmptyPositions(10, 96, 0)).toBe(0)
  })

  it('retorna 0 si posPerPlate es 0', () => {
    expect(calcEmptyPositions(10, 0, 1)).toBe(0)
  })
})

describe('PLATE_FORMATS', () => {
  it('contiene al menos los dos formatos de 96 pocillos', () => {
    const formatos96 = PLATE_FORMATS.filter(f => calcPositionsPerPlate(f.width, f.heightLetter) === 96)
    expect(formatos96.length).toBeGreaterThanOrEqual(2)
  })

  it('incluye el formato 12×H (12 columnas, 8 filas)', () => {
    expect(PLATE_FORMATS.some(f => f.width === 12 && f.heightLetter === 'H')).toBe(true)
  })

  it('incluye el formato 8×L (8 columnas, 12 filas)', () => {
    expect(PLATE_FORMATS.some(f => f.width === 8 && f.heightLetter === 'L')).toBe(true)
  })
})

describe('getFormatKey', () => {
  it('retorna "12xH" para formato 12×H', () => {
    expect(getFormatKey(12, 'H')).toBe('12xH')
  })

  it('retorna "8xL" para formato 8×L', () => {
    expect(getFormatKey(8, 'L')).toBe('8xL')
  })
})

describe('findFormat', () => {
  it('encuentra el formato 12×H', () => {
    const fmt = findFormat(12, 'H')
    expect(fmt).toBeDefined()
    expect(fmt?.width).toBe(12)
    expect(fmt?.heightLetter).toBe('H')
  })

  it('retorna undefined para un formato no registrado', () => {
    expect(findFormat(99, 'Z')).toBeUndefined()
  })
})
