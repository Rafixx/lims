// src/features/muestras/__tests__/csvTemplates.test.ts
//
// Tests para las utilidades de generación de plantillas CSV.
// Nuevo formato: codigo_placa,posicion_placa,codigo_externo,codigo_epi,observaciones

import { generatePlateTemplate, generateFullPlateTemplate } from '../utils/csvTemplateUtils'

// generatePlateTemplate: plantilla genérica de 96 posiciones
describe('generatePlateTemplate', () => {
  let content: string
  let lines: string[]

  beforeEach(() => {
    content = generatePlateTemplate('TEST-P001')
    // Eliminar BOM si existe y dividir en líneas
    lines = content.replace(/^﻿/, '').split('\n')
  })

  it('genera exactamente 97 líneas (1 cabecera + 96 posiciones)', () => {
    expect(lines).toHaveLength(97)
  })

  it('la primera línea es la cabecera correcta', () => {
    expect(lines[0]).toBe('codigo_placa,posicion_placa,codigo_externo,codigo_epi,observaciones')
  })

  it('la primera posición de datos es A01', () => {
    const fields = lines[1].split(',')
    expect(fields[0]).toBe('TEST-P001')  // codigo_placa
    expect(fields[1]).toBe('A01')         // posicion_placa
  })

  it('la última posición de datos es H12', () => {
    const fields = lines[96].split(',')
    expect(fields[1]).toBe('H12')         // posicion_placa
  })

  it('no hay posiciones duplicadas', () => {
    const posiciones = lines.slice(1).map(line => line.split(',')[1])
    const unique = new Set(posiciones)
    expect(unique.size).toBe(96)
  })

  it('codigo_externo y codigo_epi están vacíos en plantilla genérica', () => {
    // Cada fila de datos: codigo_placa,posicion_placa,,,
    lines.slice(1).forEach(line => {
      const fields = line.split(',')
      expect(fields[2]).toBe('')   // codigo_externo vacío
      expect(fields[3]).toBe('')   // codigo_epi vacío
    })
  })

  it('acepta codigoPlaca undefined y deja la columna vacía', () => {
    const csvSinCodigo = generatePlateTemplate(undefined)
    const linesSin = csvSinCodigo.replace(/^﻿/, '').split('\n')
    const fields = linesSin[1].split(',')
    expect(fields[0]).toBe('')
    expect(fields[1]).toBe('A01')
  })
})

// generateFullPlateTemplate: plantilla con posiciones de muestra
describe('generateFullPlateTemplate — row-major (por filas)', () => {
  const positions = [
    { posicion_placa: 'A01', codigo_epi: '26.00001' },
    { posicion_placa: 'A02', codigo_epi: '26.00002' },
    { posicion_placa: 'H12', codigo_epi: '26.00096' }
  ]

  let lines: string[]

  beforeEach(() => {
    const csv = generateFullPlateTemplate(12, 8, positions, 'GMS01')
    lines = csv.replace(/^﻿/, '').split('\n')
  })

  it('cabecera correcta', () => {
    expect(lines[0]).toBe('codigo_placa,posicion_placa,codigo_externo,codigo_epi,observaciones')
  })

  it('solo genera filas para las posiciones recibidas', () => {
    expect(lines.length - 1).toBe(3)
  })

  it('ordena por codigo_epi: primera A01 (26.00001), segunda A02 (26.00002)', () => {
    expect(lines[1].split(',')[1]).toBe('A01')
    expect(lines[2].split(',')[1]).toBe('A02')
  })

  it('última posición H12 (EPI más alto)', () => {
    expect(lines[3].split(',')[1]).toBe('H12')
  })

  it('codigo_epi se incluye en las posiciones con muestra', () => {
    const a01 = lines[1].split(',')
    expect(a01[3]).toBe('26.00001')
    expect(a01[0]).toBe('GMS01')
  })

  it('posiciones no proporcionadas no aparecen en el CSV', () => {
    const a03 = lines.find(l => l.split(',')[1] === 'A03')
    expect(a03).toBeUndefined()
  })

  it('codigo_externo siempre vacío en plantilla (para rellenar)', () => {
    lines.slice(1).forEach(line => {
      expect(line.split(',')[2]).toBe('')
    })
  })

  it('acepta codigo_externo alfanumérico en parseo (letras y números)', () => {
    // Verificación que el formato de la plantilla no impone restricción numérica.
    // Los parsers de importación aceptan cualquier string en codigo_externo.
    // Aquí solo verificamos que la posición de la columna es la #3 (index 2).
    const header = lines[0].split(',')
    expect(header[2]).toBe('codigo_externo')
  })
})

describe('generateFullPlateTemplate — ordenamiento por codigo_epi', () => {
  it('ordena las posiciones por codigo_epi ascendente', () => {
    const positions = [
      { posicion_placa: 'B01', codigo_epi: '26.00003' },
      { posicion_placa: 'A01', codigo_epi: '26.00001' },
      { posicion_placa: 'A02', codigo_epi: '26.00002' }
    ]
    const csv = generateFullPlateTemplate(12, 8, positions, 'GMS')
    const lines = csv.replace(/^﻿/, '').split('\n')
    // Orden esperado por EPI: A01 (26.00001), A02 (26.00002), B01 (26.00003)
    expect(lines[1].split(',')[1]).toBe('A01')
    expect(lines[2].split(',')[1]).toBe('A02')
    expect(lines[3].split(',')[1]).toBe('B01')
  })

  it('posiciones sin EPI van al final, ordenadas por posicion_placa', () => {
    const positions = [
      { posicion_placa: 'C01', codigo_epi: null },
      { posicion_placa: 'A01', codigo_epi: '26.00001' },
      { posicion_placa: 'B01', codigo_epi: null }
    ]
    const csv = generateFullPlateTemplate(12, 8, positions, 'GMS')
    const lines = csv.replace(/^﻿/, '').split('\n')
    // Con EPI primero
    expect(lines[1].split(',')[1]).toBe('A01')
    // Sin EPI al final, por orden alfanumérico de posicion_placa
    expect(lines[2].split(',')[1]).toBe('B01')
    expect(lines[3].split(',')[1]).toBe('C01')
  })

  it('solo genera filas para las posiciones recibidas (no rellena el resto de la placa)', () => {
    const positions = [
      { posicion_placa: 'A01', codigo_epi: '26.00001' },
      { posicion_placa: 'A02', codigo_epi: '26.00002' }
    ]
    const csv = generateFullPlateTemplate(12, 8, positions, 'GMS')
    const lines = csv.replace(/^﻿/, '').split('\n')
    expect(lines).toHaveLength(3) // cabecera + 2 posiciones
  })
})
