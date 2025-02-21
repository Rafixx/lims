//src/customComponents/molecules/FilterBar.tsx
import React from 'react'
import FilterCheckbox from '../atoms/FilterCheckBox'
import { useFilter } from '../../hooks/useFilter'

const FilterBar: React.FC = () => {
  const { filters, setFilters } = useFilter()

  const handleCheckboxChange = (field: keyof typeof filters, value: boolean) => {
    let updatedFilters = { ...filters, [field]: value }

    if (field === 'productos' && !value) {
      updatedFilters = { ...updatedFilters, tecnicas: false, resultados: false }
    }
    if (field === 'tecnicas' && !value) {
      updatedFilters = { ...updatedFilters, resultados: false }
    }

    setFilters(updatedFilters)
  }

  return (
    <div className="p-4 bg-gray-100 flex items-center space-x-6">
      <FilterCheckbox
        label="Productos"
        checked={filters.productos}
        onChange={value => handleCheckboxChange('productos', value)}
      />
      <FilterCheckbox
        label="Técnicas"
        checked={filters.tecnicas}
        onChange={value => handleCheckboxChange('tecnicas', value)}
        visible={filters.productos}
      />
      <FilterCheckbox
        label="Resultados"
        checked={filters.resultados}
        onChange={value => handleCheckboxChange('resultados', value)}
        visible={filters.productos && filters.tecnicas}
      />
    </div>
  )
}

export default FilterBar
