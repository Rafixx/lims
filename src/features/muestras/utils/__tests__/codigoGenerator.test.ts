// src/features/muestras/utils/__tests__/codigoGenerator.test.ts

import {
  generateCodigoFromPattern,
  generateCodigoEpi,
  generateCodigoExterno,
  generateMuestraCodigos,
  validateCodigoPattern,
  CODIGO_PATTERNS
} from '../codigoGenerator'

describe('codigoGenerator', () => {
  describe('generateCodigoEpi', () => {
    it('debe generar código EPI con el formato por defecto', () => {
      const codigo = generateCodigoEpi()
      // Formato esperado: [AÑO]/[MES][DIA]00[HORA]
      // Ejemplo: "2025/11100014"
      expect(codigo).toMatch(/^\d{4}\/\d{6}\d{2}$/)
    })

    it('debe contener año actual', () => {
      const codigo = generateCodigoEpi()
      const currentYear = new Date().getFullYear()
      expect(codigo).toContain(currentYear.toString())
    })
  })

  describe('generateCodigoExterno', () => {
    it('debe generar código externo con el formato por defecto', () => {
      const codigo = generateCodigoExterno()
      // Formato esperado: EXT_[MES][YY]_[RND:4]
      // Ejemplo: "EXT_1125_7432"
      expect(codigo).toMatch(/^EXT_\d{4}_\d{4}$/)
    })

    it('debe empezar con prefijo EXT', () => {
      const codigo = generateCodigoExterno()
      expect(codigo.startsWith('EXT_')).toBe(true)
    })
  })

  describe('generateMuestraCodigos', () => {
    it('debe generar ambos códigos', () => {
      const codigos = generateMuestraCodigos()

      expect(codigos).toHaveProperty('codigo_epi')
      expect(codigos).toHaveProperty('codigo_externo')
      expect(typeof codigos.codigo_epi).toBe('string')
      expect(typeof codigos.codigo_externo).toBe('string')
      expect(codigos.codigo_epi.length).toBeGreaterThan(0)
      expect(codigos.codigo_externo.length).toBeGreaterThan(0)
    })
  })

  describe('generateCodigoFromPattern', () => {
    it('debe reemplazar placeholder [AÑO]', () => {
      const codigo = generateCodigoFromPattern('TEST-[AÑO]')
      const currentYear = new Date().getFullYear()
      expect(codigo).toBe(`TEST-${currentYear}`)
    })

    it('debe reemplazar placeholder [YYYY]', () => {
      const codigo = generateCodigoFromPattern('TEST-[YYYY]')
      const currentYear = new Date().getFullYear()
      expect(codigo).toBe(`TEST-${currentYear}`)
    })

    it('debe reemplazar placeholder [YY]', () => {
      const codigo = generateCodigoFromPattern('TEST-[YY]')
      const currentYear = new Date().getFullYear().toString().slice(-2)
      expect(codigo).toBe(`TEST-${currentYear}`)
    })

    it('debe reemplazar placeholder [MES]', () => {
      const codigo = generateCodigoFromPattern('TEST-[MES]')
      const currentMonth = String(new Date().getMonth() + 1).padStart(2, '0')
      expect(codigo).toBe(`TEST-${currentMonth}`)
    })

    it('debe reemplazar placeholder [MM]', () => {
      const codigo = generateCodigoFromPattern('TEST-[MM]')
      const currentMonth = String(new Date().getMonth() + 1).padStart(2, '0')
      expect(codigo).toBe(`TEST-${currentMonth}`)
    })

    it('debe reemplazar placeholder [DIA]', () => {
      const codigo = generateCodigoFromPattern('TEST-[DIA]')
      expect(codigo).toMatch(/^TEST-\d{2}$/)
    })

    it('debe reemplazar placeholder [HORA]', () => {
      const codigo = generateCodigoFromPattern('TEST-[HORA]')
      expect(codigo).toMatch(/^TEST-\d{2}$/)
    })

    it('debe reemplazar placeholder [RND:4]', () => {
      const codigo = generateCodigoFromPattern('TEST-[RND:4]')
      expect(codigo).toMatch(/^TEST-\d{4}$/)
    })

    it('debe reemplazar placeholder [RAND:3]', () => {
      const codigo = generateCodigoFromPattern('TEST-[RAND:3]')
      expect(codigo).toMatch(/^TEST-\d{3}$/)
    })

    it('debe reemplazar múltiples placeholders', () => {
      const codigo = generateCodigoFromPattern('[YYYY]-[MM]-[DD]')
      expect(codigo).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    })

    it('debe generar números aleatorios diferentes en cada llamada', () => {
      const codigo1 = generateCodigoFromPattern('[RND:6]')
      const codigo2 = generateCodigoFromPattern('[RND:6]')

      // Es extremadamente improbable que sean iguales
      expect(codigo1).not.toBe(codigo2)
    })

    it('debe manejar patrones complejos', () => {
      const codigo = generateCodigoFromPattern('MUE-[YYYY][MM][DD]-[HH][mm]-[RND:4]')
      expect(codigo).toMatch(/^MUE-\d{8}-\d{4}-\d{4}$/)
    })
  })

  describe('validateCodigoPattern', () => {
    it('debe validar código que coincide con patrón simple', () => {
      const isValid = validateCodigoPattern('TEST-2025', 'TEST-[AÑO]')
      expect(isValid).toBe(true)
    })

    it('debe validar código que coincide con patrón complejo', () => {
      const isValid = validateCodigoPattern('2025/11100014', '[AÑO]/[MES][DIA]00[HORA]')
      expect(isValid).toBe(true)
    })

    it('debe rechazar código que no coincide', () => {
      const isValid = validateCodigoPattern('INVALID', '[AÑO]/[MES][DIA]00[HORA]')
      expect(isValid).toBe(false)
    })

    it('debe validar código con números aleatorios', () => {
      const isValid = validateCodigoPattern('TEST-1234', 'TEST-[RND:4]')
      expect(isValid).toBe(true)
    })

    it('debe rechazar longitud incorrecta', () => {
      const isValid = validateCodigoPattern('TEST-12', 'TEST-[RND:4]')
      expect(isValid).toBe(false)
    })
  })

  describe('CODIGO_PATTERNS', () => {
    it('debe contener todos los patrones EPI', () => {
      expect(CODIGO_PATTERNS.EPI_DEFAULT).toBeDefined()
      expect(CODIGO_PATTERNS.EPI_SIMPLE).toBeDefined()
      expect(CODIGO_PATTERNS.EPI_TIMESTAMP).toBeDefined()
      expect(CODIGO_PATTERNS.EPI_SEQUENTIAL).toBeDefined()
    })

    it('debe contener todos los patrones EXT', () => {
      expect(CODIGO_PATTERNS.EXT_DEFAULT).toBeDefined()
      expect(CODIGO_PATTERNS.EXT_SIMPLE).toBeDefined()
      expect(CODIGO_PATTERNS.EXT_DATE).toBeDefined()
      expect(CODIGO_PATTERNS.EXT_SEQUENTIAL).toBeDefined()
    })

    it('patrones predefinidos deben generar códigos válidos', () => {
      Object.values(CODIGO_PATTERNS).forEach(pattern => {
        const codigo = generateCodigoFromPattern(pattern)
        expect(codigo.length).toBeGreaterThan(0)
        expect(codigo).not.toContain('[')
        expect(codigo).not.toContain(']')
      })
    })
  })

  describe('edge cases', () => {
    it('debe manejar patrón vacío', () => {
      const codigo = generateCodigoFromPattern('')
      expect(codigo).toBe('')
    })

    it('debe manejar patrón sin placeholders', () => {
      const codigo = generateCodigoFromPattern('STATIC')
      expect(codigo).toBe('STATIC')
    })

    it('debe generar números con padding correcto', () => {
      const codigo = generateCodigoFromPattern('[RND:5]')
      expect(codigo).toMatch(/^\d{5}$/)
      expect(codigo.length).toBe(5)
    })

    it('debe manejar múltiples [RND] en un patrón', () => {
      const codigo = generateCodigoFromPattern('[RND:2]-[RND:3]-[RND:4]')
      expect(codigo).toMatch(/^\d{2}-\d{3}-\d{4}$/)
    })
  })
})
