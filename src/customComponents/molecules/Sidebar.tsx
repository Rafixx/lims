// src/customComponents/molecules/Sidebar.tsx
import React, { useState } from 'react'
import { FiChevronRight, FiHome, FiSettings, FiUser } from 'react-icons/fi'

interface SidebarItem {
  icon: React.ReactNode
  label: string
}

const sidebarItems: SidebarItem[] = [
  { icon: <FiHome size={20} />, label: 'Inicio' },
  { icon: <FiUser size={20} />, label: 'Perfil' },
  { icon: <FiSettings size={20} />, label: 'Ajustes' }
]

export const Sidebar: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div
      className={`
        bg-secondary text-white h-full flex flex-col 
        ${isExpanded ? 'w-64' : 'w-16'} transition-all duration-300
      `}
    >
      {/* Área de items del menú */}
      <div className="flex-1">
        {sidebarItems.map((item, index) => (
          <div key={index} className="flex items-center p-3 hover:bg-secondary/80 cursor-pointer">
            <div className="flex-shrink-0">{item.icon}</div>
            {isExpanded && <span className="ml-3">{item.label}</span>}
          </div>
        ))}
      </div>
      {/* Botón para expandir/colapsar el menú */}
      <div
        className="p-3 border-t border-secondary/50 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-center">
          <FiChevronRight
            className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
            size={20}
          />
        </div>
      </div>
    </div>
  )
}
