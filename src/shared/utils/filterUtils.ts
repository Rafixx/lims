/**
 * Utilidades para filtros con normalización de texto
 * Manejo consistente de mayúsculas/minúsculas y caracteres especiales
 */

/**
 * Normaliza texto para comparaciones case-insensitive
 * Elimina acentos, convierte a minúsculas y recorta espacios
 */
export const normalizeText = (text: string | undefined | null): string => {
  if (!text) return ''

  return text
    .toString()
    .toLowerCase()
    .normalize('NFD') // Descompone caracteres acentuados
    .replace(/[\u0300-\u036f]/g, '') // Elimina diacríticos (acentos)
    .trim()
}

/**
 * Compara dos textos de manera case-insensitive y sin acentos
 */
export const textEquals = (
  text1: string | undefined | null,
  text2: string | undefined | null
): boolean => {
  return normalizeText(text1) === normalizeText(text2)
}

/**
 * Verifica si un texto contiene a otro (case-insensitive)
 */
export const textContains = (
  text: string | undefined | null,
  searchTerm: string | undefined | null
): boolean => {
  if (!searchTerm) return true
  if (!text) return false

  return normalizeText(text).includes(normalizeText(searchTerm))
}

/**
 * Función de filtro genérica para comparación exacta de strings
 */
export const createExactFilter = <T>(getFieldValue: (item: T) => string | undefined | null) => {
  return (item: T, filterValue: unknown): boolean => {
    const value = filterValue as string
    if (!value) return true

    return textEquals(getFieldValue(item), value)
  }
}

/**
 * Función de filtro genérica para comparación exacta de números
 */
export const createNumericExactFilter = <T>(
  getFieldValue: (item: T) => number | undefined | null
) => {
  return (item: T, filterValue: unknown): boolean => {
    if (filterValue === null || filterValue === undefined) return true

    const value = filterValue as number
    const itemValue = getFieldValue(item)

    return itemValue === value
  }
}

/**
 * Función de filtro genérica para búsqueda por contenido
 */
export const createSearchFilter = <T>(getFieldValue: (item: T) => string | undefined | null) => {
  return (item: T, searchTerm: unknown): boolean => {
    const term = searchTerm as string
    return textContains(getFieldValue(item), term)
  }
}

/**
 * Función de filtro genérica para múltiples campos de búsqueda
 */
export const createMultiFieldSearchFilter = <T>(
  getFieldValues: (item: T) => (string | undefined | null)[]
) => {
  return (item: T, searchTerm: unknown): boolean => {
    const term = searchTerm as string
    if (!term) return true

    const fields = getFieldValues(item)
    return fields.some(field => textContains(field, term))
  }
}

/**
 * Función de filtro para fechas - solo hoy
 */
export const createTodayFilter = <T>(getDateValue: (item: T) => string | undefined | null) => {
  return (item: T, showOnlyToday: unknown): boolean => {
    const onlyToday = showOnlyToday as boolean
    if (!onlyToday) return true

    const today = new Date().toISOString().split('T')[0]
    const itemDate = getDateValue(item)?.split('T')[0]

    return itemDate === today
  }
}

/**
 * Función de filtro para rangos de fechas
 */
export const createDateRangeFilter = <T>(getDateValue: (item: T) => string | undefined | null) => {
  return (item: T, dateRange: unknown): boolean => {
    const range = dateRange as { start?: string; end?: string }
    if (!range?.start && !range?.end) return true

    const itemDate = getDateValue(item)
    if (!itemDate) return false

    const date = new Date(itemDate)

    if (range.start && date < new Date(range.start)) return false
    if (range.end && date > new Date(range.end)) return false

    return true
  }
}

/**
 * Función de filtro para arrays (si el item pertenece a una lista)
 */
export const createArrayContainsFilter = <T>(
  getFieldValue: (item: T) => string | undefined | null
) => {
  return (item: T, allowedValues: unknown): boolean => {
    const values = allowedValues as string[]
    if (!values || values.length === 0) return true

    const itemValue = getFieldValue(item)
    if (!itemValue) return false

    return values.some(value => textEquals(itemValue, value))
  }
}

/**
 * Función de filtro booleana genérica
 */
export const createBooleanFilter = <T>(getFieldValue: (item: T) => boolean | undefined | null) => {
  return (item: T, filterValue: unknown): boolean => {
    const value = filterValue as boolean
    if (value === false) return true // Si el filtro no está activo, mostrar todos

    return Boolean(getFieldValue(item)) === value
  }
}
