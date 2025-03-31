// src/features/listadoSolicitudes/components/FilterDrawer.tsx
import React, { useState } from 'react'
import { Filter } from '../hooks/useFilteredSolicitudes'
import { SolicitudesFiltro } from '../filtros/components/solicitudes.filtro'
import { MuestrasFiltro } from '../filtros/components/muestras.filtro'

interface FilterDrawerProps {
  onApplyFilters: (filters: Filter[]) => void
}

export const FilterDrawer: React.FC<FilterDrawerProps> = ({ onApplyFilters }) => {
  const [activeFilters, setActiveFilters] = useState<Filter[]>([])

  // Restringimos el tipo de 'category' al mismo que se espera en Filter
  const handleAddFilter = (filter: Filter) => {
    // Reemplaza cualquier filtro existente con el mismo category y field.
    const newFilters = activeFilters.filter(
      f => !(f.category === filter.category && f.field === filter.field)
    )
    newFilters.push(filter)
    setActiveFilters(newFilters)
    onApplyFilters(newFilters)
  }

  const handleRemoveFilter = (filterId: string) => {
    const newFilters = activeFilters.filter(f => f.id !== filterId)
    setActiveFilters(newFilters)
    onApplyFilters(newFilters)
  }

  const handleClearFilters = () => {
    setActiveFilters([])
    onApplyFilters([])
  }

  return (
    <aside className="h-full p-4">
      {/* Sección única para los filtros activos */}
      <div className="p-4 ">
        {activeFilters.length > 0 && <h2 className="text-lg font-bold">Filtros Activos</h2>}
        <div className="mt-2 flex flex-wrap gap-2">
          {activeFilters.map(filter => (
            <span
              key={filter.id}
              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs uppercase rounded-xl flex items-center"
            >
              {filter.field}: {filter.value}
              <button
                onClick={() => handleRemoveFilter(filter.id)}
                className="ml-1 text-red-500 font-bold focus:outline-none"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        {activeFilters.length > 0 && (
          <button
            onClick={handleClearFilters}
            className="mt-2 text-sm text-blue-600 hover:underline focus:outline-none"
          >
            Eliminar todos los filtros
          </button>
        )}
      </div>

      {/* Componentes de filtros específicos */}
      <SolicitudesFiltro
        activeFilters={activeFilters.filter(f => f.category === 'solicitudes')}
        onAddFilter={handleAddFilter}
        onRemoveFilter={handleRemoveFilter}
      />
      <MuestrasFiltro
        activeFilters={activeFilters.filter(f => f.category === 'muestras')}
        onAddFilter={handleAddFilter}
        onRemoveFilter={handleRemoveFilter}
      />
      {/* Puedes añadir otros componentes de filtro para 'estudios', 'procesos', etc. */}
    </aside>
  )
}
