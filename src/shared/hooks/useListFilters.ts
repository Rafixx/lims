import { useCallback, useMemo, useState } from 'react'

// src/shared/hooks/useListFilters.ts
interface FilterConfig<T> {
  [key: string]: {
    type: 'select' | 'toggle' | 'date' | 'search'
    defaultValue: unknown
    filterFn: (item: T, value: unknown) => boolean
  }
}

export const useListFilters = <T>(items: T[], filterConfig: FilterConfig<T>) => {
  const [filters, setFilters] = useState(() => {
    const initial: Record<string, unknown> = {}
    Object.entries(filterConfig).forEach(([key, config]) => {
      initial[key] = config.defaultValue
    })
    return initial
  })

  const updateFilter = useCallback((key: string, value: unknown) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }, [])

  const clearFilters = useCallback(() => {
    const cleared: Record<string, unknown> = {}
    Object.entries(filterConfig).forEach(([key, config]) => {
      cleared[key] = config.defaultValue
    })
    setFilters(cleared)
  }, [filterConfig])

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      return Object.entries(filters).every(([key, value]) => {
        const config = filterConfig[key]
        if (!config) return true

        // Si es el valor por defecto, no filtrar
        if (value === config.defaultValue) return true

        return config.filterFn(item, value)
      })
    })
  }, [items, filters, filterConfig])

  const hasActiveFilters = useMemo(() => {
    return Object.entries(filters).some(([key, value]) => {
      return value !== filterConfig[key].defaultValue
    })
  }, [filters, filterConfig])

  return {
    filters,
    filteredItems,
    hasActiveFilters,
    updateFilter,
    clearFilters
  }
}
