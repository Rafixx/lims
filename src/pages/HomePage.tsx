// src/pages/HomePage.tsx
import React from 'react'
import ProfilePage from './ProfilePage'
import MuestrasPage from './MuestrasPage'

const HomePage: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Bienvenido a LIMS</h1>
      <p className="text-gray-700">
        Este es el sistema de gestión de información de laboratorio. Aquí podrás gestionar muestras,
        consultar resultados y más.
      </p>
      <ProfilePage />
      <MuestrasPage />
      {/* Agrega más componentes o información relevante para la página principal */}
    </div>
  )
}

export default HomePage
