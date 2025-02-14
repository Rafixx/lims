// src/pages/MuestrasPage.tsx
import React from 'react'
import { useMuestras } from '../hooks/useMuestras'
import { useMuestraSync } from '../hooks/useMuestraSync'
import UpdateMuestrasButton from '../components/UpdateMuestrasButton'
import Card from '../customComponents/molecules/Card'

const MuestrasPage: React.FC = () => {
  // Activa la sincronización en tiempo real con Socket.io
  useMuestraSync()

  const { data, isLoading, error } = useMuestras()

  if (isLoading) return <div>Cargando...</div>
  if (error) return <div>Error al cargar las muestras.</div>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Lista de Muestras</h1>
      <div className="mb-4">
        <UpdateMuestrasButton />
      </div>
      <Card title="Muestras">
        <ul>
          {data &&
            data.map(muestra => (
              <li
                key={muestra.id}
                className={`p-2 rounded mb-2 text-white ${
                  muestra.estado === 'Actualizado'
                    ? 'bg-accent/40 text-primary'
                    : 'bg-primary-light/100'
                }`}
              >
                {muestra.codigoInterno} - {muestra.estado}
              </li>
            ))}
        </ul>
      </Card>
    </div>
  )
}

export default MuestrasPage
