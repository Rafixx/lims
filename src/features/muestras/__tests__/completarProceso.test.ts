// Tests para la lógica de "completar proceso" de muestras
import { canCompleteMuestra, ESTADOS_FINALES_MUESTRA } from '../utils/canCompleteMuestra'
import { ESTADO_MUESTRA } from '@/shared/interfaces/estados.types'
import { Muestra } from '../interfaces/muestras.types'

const makeMuestra = (overrides: Partial<Muestra>): Muestra => ({
  id_muestra: 1,
  tipo_array: null,
  ...overrides
})

describe('canCompleteMuestra', () => {
  it('muestra sin id_estado puede completarse', () => {
    const muestra = makeMuestra({})
    expect(canCompleteMuestra(muestra)).toBe(true)
  })

  it('muestra con estadoInfo nulo puede completarse', () => {
    const muestra = makeMuestra({ estadoInfo: null })
    expect(canCompleteMuestra(muestra)).toBe(true)
  })

  it('muestra con estado COMPLETADA (4) NO puede completarse', () => {
    const muestra = makeMuestra({
      estadoInfo: {
        id: ESTADO_MUESTRA.COMPLETADA,
        estado: 'COMPLETADA',
        entidad: 'MUESTRA',
        activo: true,
        es_inicial: false,
        es_final: true
      }
    })
    expect(canCompleteMuestra(muestra)).toBe(false)
  })

  it('muestra con estado COMPLETADA_ERROR (7) NO puede completarse', () => {
    const muestra = makeMuestra({
      estadoInfo: {
        id: ESTADO_MUESTRA.COMPLETADA_ERROR,
        estado: 'COMPLETADA_ERROR',
        entidad: 'MUESTRA',
        activo: true,
        es_inicial: false,
        es_final: true
      }
    })
    expect(canCompleteMuestra(muestra)).toBe(false)
  })

  it('muestra con estado RECHAZADA (5) NO puede completarse', () => {
    const muestra = makeMuestra({
      estadoInfo: {
        id: ESTADO_MUESTRA.RECHAZADA,
        estado: 'RECHAZADA',
        entidad: 'MUESTRA',
        activo: true,
        es_inicial: false,
        es_final: true
      }
    })
    expect(canCompleteMuestra(muestra)).toBe(false)
  })

  it('muestra con estado EN_PROCESO (3) SÍ puede completarse', () => {
    const muestra = makeMuestra({
      estadoInfo: {
        id: ESTADO_MUESTRA.EN_PROCESO,
        estado: 'EN_PROCESO',
        entidad: 'MUESTRA',
        activo: true,
        es_inicial: false,
        es_final: false
      }
    })
    expect(canCompleteMuestra(muestra)).toBe(true)
  })

  it('muestra con estado REGISTRADA (1) SÍ puede completarse', () => {
    const muestra = makeMuestra({
      estadoInfo: {
        id: ESTADO_MUESTRA.REGISTRADA,
        estado: 'REGISTRADA',
        entidad: 'MUESTRA',
        activo: true,
        es_inicial: true,
        es_final: false
      }
    })
    expect(canCompleteMuestra(muestra)).toBe(true)
  })

  it('muestra con id_estado fallback (sin estadoInfo) y estado COMPLETADA NO puede completarse', () => {
    const muestra = makeMuestra({ id_estado: ESTADO_MUESTRA.COMPLETADA })
    expect(canCompleteMuestra(muestra)).toBe(false)
  })

  it('muestra con id_estado fallback y estado EN_PROCESO SÍ puede completarse', () => {
    const muestra = makeMuestra({ id_estado: ESTADO_MUESTRA.EN_PROCESO })
    expect(canCompleteMuestra(muestra)).toBe(true)
  })
})

describe('ESTADOS_FINALES_MUESTRA', () => {
  it('incluye COMPLETADA, COMPLETADA_ERROR y RECHAZADA', () => {
    expect(ESTADOS_FINALES_MUESTRA).toContain(ESTADO_MUESTRA.COMPLETADA)
    expect(ESTADOS_FINALES_MUESTRA).toContain(ESTADO_MUESTRA.COMPLETADA_ERROR)
    expect(ESTADOS_FINALES_MUESTRA).toContain(ESTADO_MUESTRA.RECHAZADA)
  })

  it('no incluye EN_PROCESO ni REGISTRADA', () => {
    expect(ESTADOS_FINALES_MUESTRA).not.toContain(ESTADO_MUESTRA.EN_PROCESO)
    expect(ESTADOS_FINALES_MUESTRA).not.toContain(ESTADO_MUESTRA.REGISTRADA)
  })
})
