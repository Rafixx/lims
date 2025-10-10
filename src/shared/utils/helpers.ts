export const formatDate = (dateString?: string) =>
  dateString ? new Date(dateString).toISOString().split('T')[0].replace(/-/g, '/') : undefined

export const normalizeDates = <T>(obj: T): T => {
  if (Array.isArray(obj)) {
    return obj.map(normalizeDates) as T
  }

  if (typeof obj === 'object' && obj !== null) {
    const result = {} as Record<string, unknown>
    for (const key in obj) {
      const value = (obj as Record<string, unknown>)[key]
      if (typeof value === 'string' && isIsoDate(value)) {
        result[key] = value.split('T')[0] // YYYY-MM-DD
      } else {
        result[key] = normalizeDates(value)
      }
    }
    return result as T
  }

  return obj
}

export const isIsoDate = (value: string): boolean => {
  // ISO 8601: 2025-05-01T00:00:00.000Z
  return /^\d{4}-\d{2}-\d{2}T/.test(value)
}

export const getColSpanClass = (span: number): string => {
  const spanMap: Record<number, string> = {
    1: 'col-span-1',
    2: 'col-span-2',
    3: 'col-span-3',
    4: 'col-span-4',
    5: 'col-span-5',
    6: 'col-span-6',
    7: 'col-span-7',
    8: 'col-span-8',
    9: 'col-span-9',
    10: 'col-span-10',
    11: 'col-span-11',
    12: 'col-span-12'
  }
  return spanMap[span] || 'col-span-1'
}

/**
 * Formatea una fecha en formato dd/MM/yyyy HH:mm
 * Usado para mostrar fechas con hora y minutos en las listas
 * @param dateString - String de fecha ISO o compatible con Date
 * @returns Fecha formateada o '-' si no es válida
 */
export const formatDateTime = (dateString?: string | null): string => {
  if (!dateString) return '-'
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return '-'

    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')

    return `${day}/${month}/${year} ${hours}:${minutes}`
  } catch {
    return '-'
  }
}

/**
 * Formatea una fecha en formato corto español (ej: "15 ene 2025")
 * Usado para mostrar fechas de forma compacta en tarjetas
 * @param dateString - String de fecha ISO o compatible con Date
 * @returns Fecha formateada o '-' si no es válida
 */
export const formatDateShort = (dateString?: string | null): string => {
  if (!dateString) return '-'
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return '-'

    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  } catch {
    return '-'
  }
}

// export const formatDate = (dateString?: string | null, hourMinute: boolean = false): string => {
//   if (!dateString) return 'N/A'

//   try {
//     const date = new Date(dateString)
//     if (isNaN(date.getTime())) return 'N/A'

//     return date.toLocaleDateString('es-ES', {
//       year: 'numeric',
//       month: '2-digit',
//       day: '2-digit'
//       // hour: '2-digit',
//       // minute: '2-digit'
//     })
//   } catch {
//     return 'N/A'
//   }
// }
