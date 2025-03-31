// src/pages/NotFoundPage.tsx
import React from 'react'
import { Link } from 'react-router-dom'

const NotFoundPage: React.FC = () => {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-5xl font-bold mb-4">404</h1>
      <p className="text-xl mb-8">Página no encontrada</p>
      <Link
        to="/"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none"
      >
        Volver al inicio
      </Link>
    </main>
  )
}

export default NotFoundPage
