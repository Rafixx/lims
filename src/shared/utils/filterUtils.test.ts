/**
 * Tests para createNumericExactFilter — filtro de estado de muestras.
 *
 * Criterio de aceptación:
 *  - Seleccionar EN_PROCESO (MUESTRA, id=3) → solo muestras con estadoInfo.id === 3
 *  - Seleccionar COMPLETADA_ERROR (MUESTRA, id=7) → solo muestras con estadoInfo.id === 7
 *  - No mezclar estados de TECNICA (8-18) con estados de MUESTRA (1-7)
 */

import {
  createNumericExactFilter,
  createMultiFieldSearchFilter,
  normalizeText,
  textContains
} from './filterUtils'

// Tipo mínimo para los tests de muestra
type MuestraMini = {
  id_muestra: number
  estadoInfo?: { id: number; estado: string } | null
  id_estado?: number
}

// ─── createNumericExactFilter ─────────────────────────────────────────────────

describe('createNumericExactFilter', () => {
  // Getter con mismo patrón que MuestrasPage: estadoInfo?.id ?? id_estado
  const filterFn = createNumericExactFilter<MuestraMini>(
    m => m.estadoInfo?.id ?? m.id_estado
  )

  const muestras: MuestraMini[] = [
    { id_muestra: 1, estadoInfo: { id: 1, estado: 'REGISTRADA' },       id_estado: 1 },
    { id_muestra: 2, estadoInfo: { id: 3, estado: 'EN_PROCESO' },        id_estado: 3 },
    { id_muestra: 3, estadoInfo: { id: 3, estado: 'EN_PROCESO' },        id_estado: 3 },
    { id_muestra: 4, estadoInfo: { id: 4, estado: 'COMPLETADA' },        id_estado: 4 },
    { id_muestra: 5, estadoInfo: { id: 7, estado: 'COMPLETADA_ERROR' },  id_estado: 7 },
    // Solo estadoInfo, sin id_estado (caso real: API devuelve JOIN pero no campo directo)
    { id_muestra: 6, estadoInfo: { id: 3, estado: 'EN_PROCESO' } },
    // Solo id_estado, sin estadoInfo (fallback)
    { id_muestra: 7, estadoInfo: null, id_estado: 3 },
    // Sin estado en absoluto
    { id_muestra: 8, estadoInfo: undefined, id_estado: undefined }
  ]

  it('pasa todos los items cuando filterValue es null (no filtrar)', () => {
    expect(muestras.filter(m => filterFn(m, null))).toHaveLength(muestras.length)
  })

  it('pasa todos los items cuando filterValue es undefined', () => {
    expect(muestras.filter(m => filterFn(m, undefined))).toHaveLength(muestras.length)
  })

  it('filtra EN_PROCESO (id=3) correctamente — incluye fallback a id_estado', () => {
    const result = muestras.filter(m => filterFn(m, 3))
    // id_muestra 2, 3 (estadoInfo.id=3), 6 (estadoInfo.id=3), 7 (id_estado=3 con estadoInfo null)
    expect(result).toHaveLength(4)
    expect(result.map(m => m.id_muestra)).toEqual([2, 3, 6, 7])
  })

  it('filtra COMPLETADA_ERROR (id=7) correctamente', () => {
    const result = muestras.filter(m => filterFn(m, 7))
    expect(result).toHaveLength(1)
    expect(result[0].id_muestra).toBe(5)
  })

  it('excluye muestras sin estado cuando hay filtro activo', () => {
    const result = muestras.filter(m => filterFn(m, 3))
    expect(result.some(m => m.id_muestra === 8)).toBe(false)
  })

  it('no confunde estados de TECNICA con estados de MUESTRA', () => {
    // Estado 8 = CREADA en TECNICA; no debe coincidir con ninguna MUESTRA
    const result = muestras.filter(m => filterFn(m, 8))
    expect(result).toHaveLength(0)
  })

  it('maneja coerción string→number (simula valor del SelectFilter sin convertir)', () => {
    // Aunque MuestraFilter ya llama Number(value), este test defiende la robustez de la util
    const result = muestras.filter(m => filterFn(m, '3' as unknown as number))
    expect(result).toHaveLength(4)
  })

  it('no confunde id=0 como "sin filtro" — filtra correctamente si existiera', () => {
    const withZero: MuestraMini[] = [
      { id_muestra: 99, estadoInfo: { id: 0, estado: 'OTRO' } }
    ]
    const fn = createNumericExactFilter<MuestraMini>(m => m.estadoInfo?.id ?? m.id_estado)
    expect(fn(withZero[0], 0)).toBe(true)
    expect(fn(withZero[0], 1)).toBe(false)
  })
})

// ─── normalizeText / textContains ─────────────────────────────────────────────

describe('normalizeText', () => {
  it('convierte a minúsculas y elimina acentos', () => {
    expect(normalizeText('REGISTRADA')).toBe('registrada')
    expect(normalizeText('Completada')).toBe('completada')
    expect(normalizeText('EN_ANÁLISIS')).toBe('en_analisis')
  })

  it('devuelve string vacío para null/undefined', () => {
    expect(normalizeText(null)).toBe('')
    expect(normalizeText(undefined)).toBe('')
  })
})

describe('textContains', () => {
  it('detecta substrings case-insensitive', () => {
    expect(textContains('REGISTRADA', 'regis')).toBe(true)
    expect(textContains('en proceso', 'EN')).toBe(true)
  })

  it('devuelve true cuando searchTerm es falsy (no filtrar)', () => {
    expect(textContains('cualquier cosa', '')).toBe(true)
    expect(textContains('cualquier cosa', null)).toBe(true)
  })
})

// ─── createMultiFieldSearchFilter ────────────────────────────────────────────

describe('createMultiFieldSearchFilter', () => {
  type Item = { nombre: string; codigo: string }
  const filterFn = createMultiFieldSearchFilter<Item>(item => [item.nombre, item.codigo])

  it('busca en múltiples campos', () => {
    const items: Item[] = [
      { nombre: 'Paciente Uno', codigo: 'EXT001' },
      { nombre: 'Paciente Dos', codigo: 'EXT002' }
    ]
    expect(items.filter(i => filterFn(i, 'EXT001'))).toHaveLength(1)
    expect(items.filter(i => filterFn(i, 'Paciente'))).toHaveLength(2)
  })

  it('pasa todos si searchTerm está vacío', () => {
    const items: Item[] = [{ nombre: 'A', codigo: 'B' }]
    expect(items.filter(i => filterFn(i, ''))).toHaveLength(1)
  })
})
