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
  it('contiene exactamente dos formatos de 96 pocillos (row-major y column-major)', () => {
    const formatos96 = PLATE_FORMATS.filter(
      f => calcPositionsPerPlate(f.width, f.heightLetter) === 96
    )
    expect(formatos96).toHaveLength(2)
  })

  it('incluye formato 96 pocillos — numerar por filas (row)', () => {
    expect(
      PLATE_FORMATS.some(f => f.width === 12 && f.heightLetter === 'H' && f.fillDirection === 'row')
    ).toBe(true)
  })

  it('incluye formato 96 pocillos — numerar por columnas (column)', () => {
    expect(
      PLATE_FORMATS.some(
        f => f.width === 12 && f.heightLetter === 'H' && f.fillDirection === 'column'
      )
    ).toBe(true)
  })

  it('incluye formato de 48 pocillos (8×F)', () => {
    expect(PLATE_FORMATS.some(f => f.width === 8 && f.heightLetter === 'F')).toBe(true)
  })

  it('todos los formatos tienen fillDirection definido', () => {
    PLATE_FORMATS.forEach(f => {
      expect(['row', 'column']).toContain(f.fillDirection)
    })
  })
})

describe('getFormatKey', () => {
  it('sin fillDirection: retorna "12xH"', () => {
    expect(getFormatKey(12, 'H')).toBe('12xH')
  })

  it('con fillDirection row: retorna "12xH-row"', () => {
    expect(getFormatKey(12, 'H', 'row')).toBe('12xH-row')
  })

  it('con fillDirection column: retorna "12xH-column"', () => {
    expect(getFormatKey(12, 'H', 'column')).toBe('12xH-column')
  })
})

describe('findFormat', () => {
  it('encuentra el formato 12×H row-major', () => {
    const fmt = findFormat(12, 'H', 'row')
    expect(fmt).toBeDefined()
    expect(fmt?.fillDirection).toBe('row')
  })

  it('encuentra el formato 12×H column-major', () => {
    const fmt = findFormat(12, 'H', 'column')
    expect(fmt).toBeDefined()
    expect(fmt?.fillDirection).toBe('column')
  })

  it('sin fillDirection devuelve cualquier match de 12×H', () => {
    const fmt = findFormat(12, 'H')
    expect(fmt).toBeDefined()
  })

  it('retorna undefined para un formato no registrado', () => {
    expect(findFormat(99, 'Z')).toBeUndefined()
  })
})

describe('PLATE_FORMATS — dirección de llenado', () => {
  it('row-major: A01 antes que B01 en mismo lote teórico', () => {
    // Solo verifica que la descripción del formato row mencione "filas"
    const rowFmt = PLATE_FORMATS.find(f => f.fillDirection === 'row' && f.heightLetter === 'H')
    expect(rowFmt?.label).toMatch(/filas/i)
  })

  it('column-major: columnas numeradas primero', () => {
    const colFmt = PLATE_FORMATS.find(f => f.fillDirection === 'column' && f.heightLetter === 'H')
    expect(colFmt?.label).toMatch(/columnas/i)
  })
})
