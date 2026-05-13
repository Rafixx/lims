import { aggregateTecnicaStates } from './aggregateTecnicaStates'
import { Tecnica, TecnicaAgrupada } from '../interfaces/muestras.types'

const makeTecnica = (overrides: Partial<Tecnica>): Tecnica =>
  ({
    id_tecnica: 1,
    muestra: { id_muestra: 1 } as any,
    ...overrides
  } as Tecnica)

const makeAgrupada = (overrides: Partial<TecnicaAgrupada>): TecnicaAgrupada =>
  ({
    proceso_nombre: 'PCR',
    total_posiciones: 0,
    pendientes: 0,
    asignadas: 0,
    en_proceso: 0,
    completadas: 0,
    resultado_erroneo: 0,
    primera_tecnica_id: 1,
    ...overrides
  })

describe('aggregateTecnicaStates', () => {
  it('returns all zeros for empty array', () => {
    expect(aggregateTecnicaStates([])).toEqual({
      pendientes: 0, asignadas: 0, en_proceso: 0, completadas: 0, resultado_erroneo: 0
    })
  })

  describe('TecnicaAgrupada[]', () => {
    it('sums counts from all agrupadas', () => {
      const agrupadas = [
        makeAgrupada({ pendientes: 2, asignadas: 1, en_proceso: 0, completadas: 3, resultado_erroneo: 0 }),
        makeAgrupada({ proceso_nombre: 'ELISA', pendientes: 0, asignadas: 0, en_proceso: 2, completadas: 1, resultado_erroneo: 1, primera_tecnica_id: 2 })
      ]
      expect(aggregateTecnicaStates(agrupadas)).toEqual({
        pendientes: 2, asignadas: 1, en_proceso: 2, completadas: 4, resultado_erroneo: 1
      })
    })

    it('handles single agrupada with all zeros', () => {
      expect(aggregateTecnicaStates([makeAgrupada({})])).toEqual({
        pendientes: 0, asignadas: 0, en_proceso: 0, completadas: 0, resultado_erroneo: 0
      })
    })
  })

  describe('Tecnica[] (tubos)', () => {
    it('counts técnica without worklist as pendiente', () => {
      const t = makeTecnica({ estadoInfo: { id: 1, estado: 'Pendiente' } as any })
      expect(aggregateTecnicaStates([t])).toEqual({
        pendientes: 1, asignadas: 0, en_proceso: 0, completadas: 0, resultado_erroneo: 0
      })
    })

    it('counts técnica with worklist as asignada', () => {
      const t = makeTecnica({
        id_estado: 5,
        estadoInfo: { id: 5, estado: 'Asignada' } as any,
        worklist: { id_worklist: 10, nombre: 'WL-001' }
      })
      expect(aggregateTecnicaStates([t])).toEqual({
        pendientes: 0, asignadas: 1, en_proceso: 0, completadas: 0, resultado_erroneo: 0
      })
    })

    it('counts técnica with estado "En proceso" as en_proceso', () => {
      const t = makeTecnica({
        estadoInfo: { id: 7, estado: 'En proceso' } as any,
        worklist: { id_worklist: 10, nombre: 'WL-001' }
      })
      expect(aggregateTecnicaStates([t])).toEqual({
        pendientes: 0, asignadas: 0, en_proceso: 1, completadas: 0, resultado_erroneo: 0
      })
    })

    it('counts técnica with estado "Completada" as completada', () => {
      const t = makeTecnica({ estadoInfo: { id: 9, estado: 'Completada' } as any })
      expect(aggregateTecnicaStates([t])).toEqual({
        pendientes: 0, asignadas: 0, en_proceso: 0, completadas: 1, resultado_erroneo: 0
      })
    })

    it('counts técnica with estado containing "error" as resultado_erroneo', () => {
      const t = makeTecnica({ estadoInfo: { id: 11, estado: 'Resultado erróneo' } as any })
      expect(aggregateTecnicaStates([t])).toEqual({
        pendientes: 0, asignadas: 0, en_proceso: 0, completadas: 0, resultado_erroneo: 1
      })
    })

    it('skips cancelled técnicas (id_estado 13)', () => {
      const t = makeTecnica({ id_estado: 13, estadoInfo: { id: 13, estado: 'Cancelada' } as any })
      expect(aggregateTecnicaStates([t])).toEqual({
        pendientes: 0, asignadas: 0, en_proceso: 0, completadas: 0, resultado_erroneo: 0
      })
    })

    it('aggregates mixed states correctly', () => {
      const tecnicas = [
        makeTecnica({ id_tecnica: 1, estadoInfo: { id: 1, estado: 'Pendiente' } as any }),
        makeTecnica({ id_tecnica: 2, estadoInfo: { id: 5, estado: 'Asignada' } as any, worklist: { id_worklist: 1, nombre: 'WL' } }),
        makeTecnica({ id_tecnica: 3, id_estado: 13, estadoInfo: { id: 13, estado: 'Cancelada' } as any }),
        makeTecnica({ id_tecnica: 4, estadoInfo: { id: 9, estado: 'Completada' } as any })
      ]
      expect(aggregateTecnicaStates(tecnicas)).toEqual({
        pendientes: 1, asignadas: 1, en_proceso: 0, completadas: 1, resultado_erroneo: 0
      })
    })
  })
})
