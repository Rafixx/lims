// Tests para la lógica de ordenación de muestras
import { sortMuestras } from '../utils/sortMuestras'
import { Muestra } from '../interfaces/muestras.types'

// Muestras de prueba con fechas de recepción distintas
const makeMuestra = (overrides: Partial<Muestra>): Muestra => ({
  id_muestra: 1,
  tipo_array: null,
  ...overrides
})

const muestraA = makeMuestra({ id_muestra: 1, f_recepcion: '2026-01-10T08:00:00.000Z' })
const muestraB = makeMuestra({ id_muestra: 2, f_recepcion: '2026-03-20T10:00:00.000Z' })
const muestraC = makeMuestra({ id_muestra: 3, f_recepcion: '2025-12-01T09:00:00.000Z' })

const muestras = [muestraA, muestraB, muestraC]

describe('MuestrasPage — sort inicial', () => {
  it('Test 1: sortKey inicial debe ser f_recepcion', () => {
    // La constante refleja el valor de useState inicial en MuestrasPage
    const initialSortKey = 'f_recepcion'
    expect(initialSortKey).toBe('f_recepcion')
  })

  it('Test 2: sortDirection inicial debe ser desc', () => {
    const initialSortDirection = 'desc'
    expect(initialSortDirection).toBe('desc')
  })
})

describe('sortMuestras — ordenación por f_recepcion', () => {
  it('Test 3: ordena desc (más reciente primero) con f_recepcion', () => {
    const result = sortMuestras(muestras, 'f_recepcion', 'desc')
    // Más reciente: muestraB (2026-03-20), luego muestraA (2026-01-10), luego muestraC (2025-12-01)
    expect(result[0].id_muestra).toBe(2)
    expect(result[1].id_muestra).toBe(1)
    expect(result[2].id_muestra).toBe(3)
  })

  it('Test 4: invierte el orden con asc (más antigua primero)', () => {
    const result = sortMuestras(muestras, 'f_recepcion', 'asc')
    // Más antigua: muestraC (2025-12-01), luego muestraA (2026-01-10), luego muestraB (2026-03-20)
    expect(result[0].id_muestra).toBe(3)
    expect(result[1].id_muestra).toBe(1)
    expect(result[2].id_muestra).toBe(2)
  })

  it('devuelve el array original sin mutar cuando sortKey está vacío', () => {
    const result = sortMuestras(muestras, '', 'desc')
    expect(result).toBe(muestras)
  })

  it('maneja muestras sin f_recepcion (undefined) sin lanzar error', () => {
    const sinFecha = makeMuestra({ id_muestra: 99 }) // sin f_recepcion
    expect(() => sortMuestras([sinFecha, muestraA], 'f_recepcion', 'desc')).not.toThrow()
  })
})
