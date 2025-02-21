//src/hooks/useFilter.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react'

export interface FilterOptions {
  productos: boolean
  tecnicas: boolean
  resultados: boolean
}

interface FilterContextProps {
  filters: FilterOptions
  setFilters: React.Dispatch<React.SetStateAction<FilterOptions>>
  toggleFilter: (filter: keyof FilterOptions) => void
}

const FilterContext = createContext<FilterContextProps | undefined>(undefined)

export const FilterProvider = ({ children }: { children: ReactNode }) => {
  const [filters, setFilters] = useState<FilterOptions>({
    productos: false,
    tecnicas: false,
    resultados: false
  })

  const toggleFilter = (filter: keyof FilterOptions) => {
    setFilters(prev => ({
      ...prev,
      [filter]: !prev[filter]
    }))
  }

  return (
    <FilterContext.Provider value={{ filters, setFilters, toggleFilter }}>
      {children}
    </FilterContext.Provider>
  )
}

export const useFilter = () => {
  const context = useContext(FilterContext)
  if (!context) {
    throw new Error('useFilter must be used within a FilterProvider')
  }
  return context
}
