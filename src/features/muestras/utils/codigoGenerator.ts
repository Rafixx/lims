// src/features/muestras/utils/codigoGenerator.ts

/**
 * Generador de códigos aleatorios para muestras
 * Soporta diferentes patrones con placeholders
 */

type CodigoPattern = string

/**
 * Genera un número aleatorio entre min y max (inclusive)
 */
function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Pad con ceros a la izquierda
 */
function padZero(num: number, length: number): string {
  return num.toString().padStart(length, '0')
}

/**
 * Genera un código aleatorio basado en un patrón
 *
 * Placeholders soportados:
 * - [AÑO] o [YYYY] - Año completo (4 dígitos): 2025
 * - [YY] - Año corto (2 dígitos): 25
 * - [MES] o [MM] - Mes con cero a la izquierda: 01-12
 * - [DIA] o [DD] - Día con cero a la izquierda: 01-31
 * - [HORA] o [HH] - Hora con cero a la izquierda: 00-23
 * - [MINUTO] o [mm] - Minuto con cero a la izquierda: 00-59
 * - [SEGUNDO] o [ss] - Segundo con cero a la izquierda: 00-59
 * - [RND:N] - Número aleatorio de N dígitos: [RND:3] = 001-999
 * - [RAND:N] - Similar a [RND:N]
 * - [SEQ:N] - Contador secuencial de N dígitos (simulado con random por ahora)
 *
 * @example
 * ```typescript
 * // Patrón: "[AÑO]/[MES][DIA]00[HORA]"
 * // Resultado: "2025/11100014"
 *
 * // Patrón: "EXT_[MES][YY]_[RND:4]"
 * // Resultado: "EXT_1125_7432"
 *
 * // Patrón: "MUE-[YYYY]-[MM]-[RND:5]"
 * // Resultado: "MUE-2025-11-08247"
 * ```
 */
export function generateCodigoFromPattern(pattern: CodigoPattern): string {
  const now = new Date()

  // Extraer componentes de fecha/hora
  const year = now.getFullYear()
  const month = now.getMonth() + 1 // 1-12
  const day = now.getDate()
  const hours = now.getHours()
  const minutes = now.getMinutes()
  const seconds = now.getSeconds()

  let codigo = pattern

  // Reemplazar placeholders de fecha/hora
  codigo = codigo.replace(/\[AÑO\]|\[YYYY\]/g, year.toString())
  codigo = codigo.replace(/\[YY\]/g, year.toString().slice(-2))
  codigo = codigo.replace(/\[MES\]|\[MM\]/g, padZero(month, 2))
  codigo = codigo.replace(/\[DIA\]|\[DD\]/g, padZero(day, 2))
  codigo = codigo.replace(/\[HORA\]|\[HH\]/g, padZero(hours, 2))
  codigo = codigo.replace(/\[MINUTO\]|\[mm\]/g, padZero(minutes, 2))
  codigo = codigo.replace(/\[SEGUNDO\]|\[ss\]/g, padZero(seconds, 2))

  // Reemplazar placeholders de números aleatorios
  // [RND:3] o [RAND:3] → número de 3 dígitos
  codigo = codigo.replace(/\[(RND|RAND):(\d+)\]/g, (_, __, digits) => {
    const numDigits = parseInt(digits)
    const min = Math.pow(10, numDigits - 1)
    const max = Math.pow(10, numDigits) - 1
    return randomNumber(min, max).toString()
  })

  // Reemplazar placeholders de secuencia (por ahora simulado con random)
  // [SEQ:4] → contador de 4 dígitos
  codigo = codigo.replace(/\[SEQ:(\d+)\]/g, (_, digits) => {
    const numDigits = parseInt(digits)
    const min = Math.pow(10, numDigits - 1)
    const max = Math.pow(10, numDigits) - 1
    return randomNumber(min, max).toString()
  })

  return codigo
}

/**
 * Genera código EPI con patrón por defecto
 * Patrón: [AÑO]/[MES][DIA]00[HORA]
 *
 * @example
 * // Resultado: "2025/11100014"
 */
export function generateCodigoEpi(): string {
  return generateCodigoFromPattern('[AÑO]/[MES][DIA]00[HORA]')
}

/**
 * Genera código externo con patrón por defecto
 * Patrón: EXT_[MES][YY]_[RND:4]
 *
 * @example
 * // Resultado: "EXT_1125_7432"
 */
export function generateCodigoExterno(): string {
  return generateCodigoFromPattern('EXT_[MES][YY]_[RND:4]')
}

/**
 * Genera un código EPI personalizado
 * @param pattern - Patrón personalizado (opcional)
 */
export function generateCustomCodigoEpi(pattern?: string): string {
  return generateCodigoFromPattern(pattern || '[AÑO]/[MES][DIA]00[HORA]')
}

/**
 * Genera un código externo personalizado
 * @param pattern - Patrón personalizado (opcional)
 */
export function generateCustomCodigoExterno(pattern?: string): string {
  return generateCodigoFromPattern(pattern || 'EXT_[MES][YY]_[RND:4]')
}

/**
 * Valida si un código sigue un patrón específico (básico)
 */
export function validateCodigoPattern(codigo: string, pattern: string): boolean {
  // Convertir el patrón a regex (básico)
  const regexPattern = pattern
    .replace(/\[AÑO\]|\[YYYY\]/g, '\\d{4}')
    .replace(/\[YY\]/g, '\\d{2}')
    .replace(
      /\[MES\]|\[MM\]|\[DIA\]|\[DD\]|\[HORA\]|\[HH\]|\[MINUTO\]|\[mm\]|\[SEGUNDO\]|\[ss\]/g,
      '\\d{2}'
    )
    .replace(/\[(RND|RAND|SEQ):(\d+)\]/g, (_, __, digits) => `\\d{${digits}}`)
    .replace(/\//g, '\\/')
    .replace(/_/g, '_')

  const regex = new RegExp(`^${regexPattern}$`)
  return regex.test(codigo)
}

/**
 * Patrones predefinidos comunes
 */
export const CODIGO_PATTERNS = {
  // Patrones para código EPI
  EPI_DEFAULT: '[AÑO]/[MES][DIA]00[HORA]',
  EPI_SIMPLE: '[YYYY]-[MM]-[RND:4]',
  EPI_TIMESTAMP: '[YYYY][MM][DD][HH][mm][ss]',
  EPI_SEQUENTIAL: 'EPI-[YYYY]-[SEQ:5]',

  // Patrones para código externo
  EXT_DEFAULT: 'EXT_[MES][YY]_[RND:4]',
  EXT_SIMPLE: 'EXT-[RND:6]',
  EXT_DATE: 'EXT-[YYYY][MM][DD]-[RND:3]',
  EXT_SEQUENTIAL: 'EXT-[SEQ:8]'
} as const

/**
 * Genera ambos códigos (EPI y externo) en un solo objeto
 */
export function generateMuestraCodigos(): {
  codigo_epi: string
  codigo_externo: string
} {
  return {
    codigo_epi: generateCodigoEpi(),
    codigo_externo: generateCodigoExterno()
  }
}
