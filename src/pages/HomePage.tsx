// src/pages/HomePage.tsx
import React from 'react'
// import { Outlet } from 'react-router-dom'

const HomePage: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Bienvenido a LIMS</h1>
      <p className="text-gray-700">
        Este es el sistema de gestión de información de laboratorio. Aquí podrás gestionar muestras,
        consultar resultados y más.
      </p>
      {/* <Outlet /> */}
    </div>
  )
}

export default HomePage
