// src/customComponents/organisms/MuestrasTable.tsx
import React from 'react'
import FilterBar from '../molecules/FilterBar'
import MuestraRow from '../molecules/MuestraRow'
import { useMuestras } from '../../hooks/useMuestras'
import { FilterProvider } from '../../hooks/useFilter'

const MuestrasTable: React.FC = () => {
  const { data: muestras, isLoading, isError } = useMuestras()

  if (isLoading) return <div>Cargando...</div>
  if (isError || !muestras) return <div>Error al cargar las muestras.</div>

  return (
    // Envuelvo la tabla en el Provider para que los hijos accedan al filtro
    <FilterProvider>
      <div>
        <FilterBar />
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 text-left">Identificación</th>
              <th className="p-2 text-left">Estado</th>
            </tr>
          </thead>
          <tbody>
            {muestras.map(muestra => (
              <MuestraRow key={muestra.id} muestra={muestra} />
            ))}
          </tbody>
        </table>
      </div>
    </FilterProvider>
  )
}

export default MuestrasTable
