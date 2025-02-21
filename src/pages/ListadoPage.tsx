// src/pages/ListadoPage.tsx
import React from 'react'
import MuestrasTable from '../customComponents/organisms/MuestrasTable'

const ListadoPage: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Listado de Muestras</h1>
      <p className="text-gray-700">
        Aquí se muestran todas las muestras registradas en el sistema.
      </p>
      <MuestrasTable />
    </div>
  )
}

export default ListadoPage
