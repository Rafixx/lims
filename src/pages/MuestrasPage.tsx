// src/pages/MuestrasPage.tsx
import React from 'react'
import { useMuestras, getClassEstado } from '../hooks/useMuestras'
import { useMuestraSync } from '../hooks/useMuestraSync'
import UpdateMuestraButton from '../components/UpdateMuestrasButton'

const MuestrasPage: React.FC = () => {
  const { data: muestras, isLoading, error } = useMuestras()
  useMuestraSync()

  if (isLoading) return <div>Cargando muestras...</div>
  if (error) return <div>Error al cargar las muestras.</div>

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Actualizar estado de Muestras</h1>
      <ul className="w-1/3">
        {muestras?.map(muestra => (
          <li
            key={muestra.id}
            className={`border p-2 mb-2 flex justify-between items-center ${getClassEstado(muestra.estado)}`}
          >
            <div>
              <span className="font-semibold">{muestra.codigoInterno}</span>
              <span className="text-sm ml-2">{muestra.estado}</span>
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
