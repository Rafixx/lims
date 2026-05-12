// src/features/workList/__tests__/worklistCodigo.test.ts

import { shouldGenerateCodigo } from '../utils/shouldGenerateCodigo'

describe('shouldGenerateCodigo', () => {
  it('devuelve true cuando hay proceso seleccionado y no hay nombre previo', () => {
    expect(shouldGenerateCodigo('ELISA', '')).toBe(true)
  })

  it('devuelve false cuando ya hay un nombre asignado aunque se cambie el proceso', () => {
    expect(shouldGenerateCodigo('PCR', 'L26.00042')).toBe(false)
  })

  it('devuelve false cuando no hay proceso seleccionado', () => {
    expect(shouldGenerateCodigo('', 'L26.00042')).toBe(false)
  })

  it('devuelve false cuando no hay proceso ni nombre', () => {
    expect(shouldGenerateCodigo('', '')).toBe(false)
  })
})
