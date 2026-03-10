import { useCallback, useEffect, useMemo, useState } from 'react'

interface Options {
  defaultSortKey?: string
  defaultSortDirection?: 'asc' | 'desc'
  defaultPageSize?: number
}

/**
 * Hook para ordenar y paginar una lista de items.
 * Se encadena después de useListFilters: recibe filteredItems y devuelve
 * paginatedItems + estado de sort y paginación para conectar con la UI.
 */
export const useSortAndPaginate = <T extends object>(
  items: T[],
  { defaultSortKey, defaultSortDirection = 'asc', defaultPageSize = 20 }: Options = {}
) => {
  const [sortKey, setSortKey] = useState<string | undefined>(defaultSortKey)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(defaultSortDirection)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(defaultPageSize)

  // Volver a la página 1 cuando cambia el array de items (filtro aplicado)
  useEffect(() => {
    setPage(1)
  }, [items])

  const onSort = useCallback(
    (key: string) => {
      if (sortKey === key) {
        setSortDirection(d => (d === 'asc' ? 'desc' : 'asc'))
      } else {
        setSortKey(key)
        setSortDirection('asc')
      }
      setPage(1)
    },
    [sortKey]
  )

  const sorted = useMemo(() => {
    if (!sortKey) return items
    return [...items].sort((a, b) => {
      const aVal = (a as Record<string, unknown>)[sortKey]
      const bVal = (b as Record<string, unknown>)[sortKey]
      if (aVal == null && bVal == null) return 0
      if (aVal == null) return 1
      if (bVal == null) return -1
      const cmp = String(aVal).localeCompare(String(bVal), 'es', {
        sensitivity: 'base',
        numeric: true
      })
      return sortDirection === 'asc' ? cmp : -cmp
    })
  }, [items, sortKey, sortDirection])

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize))
  const safePage = Math.min(page, totalPages)

  const paginatedItems = useMemo(() => {
    const start = (safePage - 1) * pageSize
    return sorted.slice(start, start + pageSize)
  }, [sorted, safePage, pageSize])

  return {
    sortKey,
    sortDirection,
    onSort,
    page: safePage,
    setPage,
    pageSize,
    setPageSize,
    totalPages,
    paginatedItems
  }
}
