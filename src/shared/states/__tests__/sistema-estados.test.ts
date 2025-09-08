/**
 * Tests unitarios para el sistema centralizado de estados
 */

import {
  APP_STATES,
  ESTADOS_CONFIG,
  esTransicionValida,
  getEstadosPermitidos,
  getEstadoConfig,
  esEstadoFinal,
  toAppEstado,
  contarPorEstado,
  ordenarPorPrioridad,
  tieneMayorPrioridad,
  type AppEstado
} from '../index'

describe('Sistema Centralizado de Estados', () => {
  describe('Constantes de Estados', () => {
    test('debe tener todos los módulos de estados definidos', () => {
      expect(APP_STATES).toHaveProperty('SOLICITUD')
      expect(APP_STATES).toHaveProperty('TECNICA')
      expect(APP_STATES).toHaveProperty('MUESTRA')
      expect(APP_STATES).toHaveProperty('USUARIO')
      expect(APP_STATES).toHaveProperty('SISTEMA')
    })

    test('debe tener estados únicos (sin duplicados)', () => {
      const todosLosEstados = Object.values(APP_STATES).flatMap(categoria =>
        Object.values(categoria)
      )
      const estadosUnicos = new Set(todosLosEstados)

      expect(estadosUnicos.size).toBe(todosLosEstados.length)
    })
  })

  describe('Configuración de Estados', () => {
    test('debe tener configuración para todos los estados', () => {
      const estados = Object.values(APP_STATES).flatMap(categoria => Object.values(categoria))

      estados.forEach(estado => {
        expect(ESTADOS_CONFIG).toHaveProperty(estado)
        const config = ESTADOS_CONFIG[estado]
        expect(config).toHaveProperty('label')
        expect(config).toHaveProperty('description')
        expect(config).toHaveProperty('color')
        expect(config).toHaveProperty('priority')
      })
    })

    test('debe tener prioridades válidas', () => {
      Object.values(ESTADOS_CONFIG).forEach(config => {
        expect(config.priority).toBeGreaterThan(0)
        expect(Number.isInteger(config.priority)).toBe(true)
      })
    })
  })

  describe('Transiciones de Estados', () => {
    test('debe validar transiciones correctas de solicitudes', () => {
      expect(
        esTransicionValida(APP_STATES.SOLICITUD.PENDIENTE, APP_STATES.SOLICITUD.EN_PROCESO)
      ).toBe(true)

      expect(
        esTransicionValida(APP_STATES.SOLICITUD.EN_PROCESO, APP_STATES.SOLICITUD.COMPLETADA)
      ).toBe(true)
    })

    test('debe rechazar transiciones inválidas', () => {
      expect(
        esTransicionValida(APP_STATES.SOLICITUD.COMPLETADA, APP_STATES.SOLICITUD.PENDIENTE)
      ).toBe(false)

      expect(
        esTransicionValida(APP_STATES.SOLICITUD.PENDIENTE, APP_STATES.TECNICA.EN_PROGRESO)
      ).toBe(false)
    })

    test('debe obtener estados permitidos correctamente', () => {
      const permitidos = getEstadosPermitidos(APP_STATES.SOLICITUD.PENDIENTE)

      expect(permitidos).toContain(APP_STATES.SOLICITUD.EN_PROCESO)
      expect(permitidos).toContain(APP_STATES.SOLICITUD.CANCELADA)
      expect(permitidos).not.toContain(APP_STATES.SOLICITUD.COMPLETADA)
    })
  })

  describe('Helpers de Estado', () => {
    test('debe obtener configuración de estado correctamente', () => {
      const config = getEstadoConfig(APP_STATES.SOLICITUD.PENDIENTE)

      expect(config.label).toBe('Pendiente')
      expect(config.color).toBe('amber')
      expect(config.priority).toBe(2)
    })

    test('debe detectar estados finales', () => {
      expect(esEstadoFinal(APP_STATES.SOLICITUD.COMPLETADA)).toBe(true)
      expect(esEstadoFinal(APP_STATES.SOLICITUD.PENDIENTE)).toBe(false)
    })

    test('debe validar estados correctamente', () => {
      expect(toAppEstado('PENDIENTE')).toBe('PENDIENTE')
      expect(toAppEstado('ESTADO_INVALIDO')).toBe(null)
    })
  })

  describe('Utilidades de Ordenación', () => {
    test('debe ordenar por prioridad correctamente', () => {
      const estados = [
        APP_STATES.SOLICITUD.COMPLETADA, // prioridad 5
        APP_STATES.SOLICITUD.EN_PROCESO, // prioridad 1
        APP_STATES.SOLICITUD.PENDIENTE // prioridad 2
      ]

      const ordenados = ordenarPorPrioridad(estados)

      expect(ordenados[0]).toBe(APP_STATES.SOLICITUD.EN_PROCESO)
      expect(ordenados[1]).toBe(APP_STATES.SOLICITUD.PENDIENTE)
      expect(ordenados[2]).toBe(APP_STATES.SOLICITUD.COMPLETADA)
    })

    test('debe comparar prioridades correctamente', () => {
      expect(
        tieneMayorPrioridad(
          APP_STATES.SOLICITUD.EN_PROCESO, // prioridad 1
          APP_STATES.SOLICITUD.PENDIENTE // prioridad 2
        )
      ).toBe(true)

      expect(
        tieneMayorPrioridad(
          APP_STATES.SOLICITUD.COMPLETADA, // prioridad 5
          APP_STATES.SOLICITUD.EN_PROCESO // prioridad 1
        )
      ).toBe(false)
    })
  })

  describe('Métricas y Análisis', () => {
    test('debe contar estados correctamente', () => {
      const solicitudes = [
        { estado: APP_STATES.SOLICITUD.PENDIENTE },
        { estado: APP_STATES.SOLICITUD.PENDIENTE },
        { estado: APP_STATES.SOLICITUD.EN_PROCESO },
        { estado: APP_STATES.SOLICITUD.COMPLETADA }
      ]

      const conteos = contarPorEstado(solicitudes, s => s.estado)

      expect(conteos[APP_STATES.SOLICITUD.PENDIENTE]).toBe(2)
      expect(conteos[APP_STATES.SOLICITUD.EN_PROCESO]).toBe(1)
      expect(conteos[APP_STATES.SOLICITUD.COMPLETADA]).toBe(1)
    })
  })

  describe('Casos Edge', () => {
    test('debe manejar estados inválidos', () => {
      expect(() => getEstadoConfig('' as unknown as AppEstado)).not.toThrow()
      expect(() => getEstadoConfig('INVALID' as unknown as AppEstado)).not.toThrow()
    })

    test('debe manejar listas vacías', () => {
      expect(ordenarPorPrioridad([])).toEqual([])
      expect(contarPorEstado([], () => APP_STATES.SOLICITUD.PENDIENTE)).toEqual({})
    })
  })
})
