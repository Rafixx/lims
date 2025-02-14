// src/layouts/Layout.tsx
import React from 'react'
import { Sidebar } from '../customComponents/organisms/Sidebar'
import { Footer } from '../customComponents/organisms/Footer'

interface LayoutProps {
  children?: React.ReactNode
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg flex flex-col w-full max-w-6xl h-screen mx-auto">
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-6">{children}</main>
        </div>
        <Footer />
      </div>
    </div>
  )
}
