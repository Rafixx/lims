// src/pages/MuestrasPage.tsx
import React from 'react'
import { useMuestras } from '../hooks/useMuestras'
import { useMuestraSync } from '../hooks/useMuestraSync'
import UpdateMuestraButton from '../components/UpdateMuestrasButton'

const getBackgroundClass = (estado: string): string => {
  switch (estado) {
    case 'Pendiente':
      return 'bg-red-200'
    case 'En Proceso':
      return 'bg-yellow-200'
    case 'Actualizado':
      return 'bg-green-200'
    default:
      return 'bg-gray-100'
  }
}

const MuestrasPage: React.FC = () => {
  const { data: muestras, isLoading, error } = useMuestras()
  useMuestraSync()

  if (isLoading) return <div>Cargando muestras...</div>
  if (error) return <div>Error al cargar las muestras.</div>

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Listado de Muestras</h1>
      <ul>
        {muestras?.map(muestra => (
          <li
            key={muestra.id}
            className={`border p-4 mb-2 flex justify-between items-center ${getBackgroundClass(muestra.estado)}`}
          >
            <div>
              <p className="font-semibold">{muestra.codigoInterno}</p>
              <p>{muestra.estado}</p>
            </div>
            <div>
              {/* Botón individual para actualizar el estado de esta muestra */}
              <UpdateMuestraButton id={muestra.id} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default MuestrasPage
