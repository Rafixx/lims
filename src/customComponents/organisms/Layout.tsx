// src/customComponents/organisms/Layout.tsx
import React, { JSX } from 'react'
import { Sidebar } from '../molecules/Sidebar'

interface LayoutProps {
  children: React.ReactNode
}

export const Layout: React.FC<LayoutProps> = ({ children }): JSX.Element => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-lg flex flex-col w-full max-w-6xl">
        {/* Contenedor principal: Sidebar + Contenido */}
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-6">{children}</main>
        </div>
        {/* Footer fijo */}
        <footer className="bg-gray-200 p-4 text-center">LIMS 2025</footer>
      </div>
    </div>
  )
}
