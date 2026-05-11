// src/features/muestras/__tests__/csvTemplates.test.ts

import { generatePlateTemplate } from '../utils/csvTemplateUtils'

describe('generatePlateTemplate', () => {
  let lines: string[]

  beforeEach(() => {
    lines = generatePlateTemplate().split('\n')
  })

  it('genera exactamente 97 líneas (1 cabecera + 96 posiciones)', () => {
    expect(lines).toHaveLength(97)
  })

  it('la primera línea es la cabecera correcta', () => {
    expect(lines[0]).toBe('posicion_placa,codigo_externo,observaciones')
  })

  it('la primera posición de datos es A01', () => {
    expect(lines[1].startsWith('A01')).toBe(true)
  })

  it('la última posición de datos es H12', () => {
    expect(lines[96].startsWith('H12')).toBe(true)
  })

  it('no hay posiciones duplicadas', () => {
    const posiciones = lines.slice(1).map(line => line.split(',')[0])
    const unique = new Set(posiciones)
    expect(unique.size).toBe(96)
  })
})
