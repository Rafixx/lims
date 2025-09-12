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
