// src/features/workList/utils/worklistCodigoGenerator.ts

/**
 * Generador de códigos para Worklists
 * Genera códigos únicos basados en fecha y tipo de técnica
 */

/**
 * Pad con ceros a la izquierda
 */
function padZero(num: number, length: number): string {
  return num.toString().padStart(length, '0')
}

/**
 * Genera un número aleatorio entre min y max (inclusive)
 */
function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Genera un código para worklist con el patrón: LT/[AÑO][MES][TECNICA_PROC]
 *
 * @param tecnicaProc - Nombre del proceso técnico (opcional, se puede pasar vacío)
 * @returns Código generado
 *
 * @example
 * ```typescript
 * // Sin proceso definido
 * generateWorklistCodigo()
 * // Resultado: "LT/202511-TEMP"
 *
 * // Con proceso definido
 * generateWorklistCodigo('PCR')
 * // Resultado: "LT/202511-PCR"
 *
 * // Con proceso largo (se acorta automáticamente)
 * generateWorklistCodigo('Microbiología Avanzada')
 * // Resultado: "LT/202511-MICROBIO"
 * ```
 */
export function generateWorklistCodigo(tecnicaProc?: string): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = padZero(now.getMonth() + 1, 2)

  // Procesar el nombre de la técnica
  let tecnicaSuffix = 'TEMP'

  if (tecnicaProc && tecnicaProc.trim().length > 0) {
    // Limpiar y normalizar el nombre de la técnica
    tecnicaSuffix = tecnicaProc
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '') // Remover caracteres especiales
      .substring(0, 8) // Limitar a 8 caracteres
  }

  return `LT/${year}${month}-${tecnicaSuffix}`
}

/**
 * Genera un código con patrón personalizado para worklist
 *
 * Placeholders soportados:
 * - [AÑO] o [YYYY] - Año completo (4 dígitos)
 * - [YY] - Año corto (2 dígitos)
 * - [MES] o [MM] - Mes con cero a la izquierda
 * - [DIA] o [DD] - Día con cero a la izquierda
 * - [HORA] o [HH] - Hora con cero a la izquierda
 * - [TECNICA] - Nombre de la técnica procesado
 * - [RND:N] - Número aleatorio de N dígitos
 *
 * @param pattern - Patrón a usar
 * @param tecnicaProc - Nombre del proceso técnico
 * @returns Código generado según el patrón
 *
 * @example
 * ```typescript
 * generateWorklistCodigoFromPattern('WL-[YYYY]-[MM]-[TECNICA]', 'PCR')
 * // Resultado: "WL-2025-11-PCR"
 *
 * generateWorklistCodigoFromPattern('[AÑO][MES][DIA]-[TECNICA]-[RND:3]', 'Microbiología')
 * // Resultado: "20251110-MICROBIO-742"
 * ```
 */
export function generateWorklistCodigoFromPattern(pattern: string, tecnicaProc?: string): string {
  const now = new Date()

  // Extraer componentes de fecha/hora
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  const day = now.getDate()
  const hours = now.getHours()

  let codigo = pattern

  // Reemplazar placeholders de fecha/hora
  codigo = codigo.replace(/\[AÑO\]|\[YYYY\]/g, year.toString())
  codigo = codigo.replace(/\[YY\]/g, year.toString().slice(-2))
  codigo = codigo.replace(/\[MES\]|\[MM\]/g, padZero(month, 2))
  codigo = codigo.replace(/\[DIA\]|\[DD\]/g, padZero(day, 2))
  codigo = codigo.replace(/\[HORA\]|\[HH\]/g, padZero(hours, 2))

  // Procesar técnica
  let tecnicaSuffix = 'TEMP'
  if (tecnicaProc && tecnicaProc.trim().length > 0) {
    tecnicaSuffix = tecnicaProc
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .substring(0, 8)
  }

  // Reemplazar placeholder de técnica
  codigo = codigo.replace(/\[TECNICA\]/g, tecnicaSuffix)

  // Reemplazar placeholders de números aleatorios
  codigo = codigo.replace(/\[RND:(\d+)\]/g, (_, digits) => {
    const numDigits = parseInt(digits)
    const min = Math.pow(10, numDigits - 1)
    const max = Math.pow(10, numDigits) - 1
    return randomNumber(min, max).toString()
  })

  return codigo
}

/**
 * Patrones predefinidos para códigos de worklist
 */
export const WORKLIST_CODIGO_PATTERNS = {
  DEFAULT: 'LT/[AÑO][MES]-[TECNICA]',
  SIMPLE: 'WL-[YYYY]-[MM]-[TECNICA]',
  WITH_DAY: 'LT/[YYYY][MM][DD]-[TECNICA]',
  WITH_RANDOM: 'LT-[YY][MM]-[TECNICA]-[RND:3]',
  TIMESTAMP: '[YYYY][MM][DD][HH]-[TECNICA]'
} as const

/**
 * Genera código usando el patrón por defecto
 * Patrón: LT/[AÑO][MES]-[TECNICA]
 */
export function generateDefaultWorklistCodigo(tecnicaProc?: string): string {
  return generateWorklistCodigoFromPattern(WORKLIST_CODIGO_PATTERNS.DEFAULT, tecnicaProc)
}
