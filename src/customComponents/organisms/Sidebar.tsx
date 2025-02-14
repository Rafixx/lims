// src/customComponents/molecules/Sidebar.tsx
import React from 'react'
import { Link } from 'react-router-dom'
import { useMenu } from '../../contexts/MenuContext'

export interface MenuItem {
  icon: React.ReactNode
  label: string
  to: string
}

// Eliminamos la interfaz SidebarProps, ya que usaremos el context
export const Sidebar: React.FC = () => {
  const [isExpanded, setIsExpanded] = React.useState(false)
  // Usamos el hook del MenuContext para obtener los ítems del menú
  const { menuItems } = useMenu()

  return (
    <div
      className={`
        bg-secondary-light text-white h-full flex flex-col 
        ${isExpanded ? 'w-54' : 'w-16'} transition-all duration-300
      `}
    >
      <div className="flex-1">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.to}
            className="flex items-center p-3 hover:bg-secondary/80 cursor-pointer"
          >
            <div className="flex-shrink-0">{item.icon}</div>
            {isExpanded && <span className="ml-3">{item.label}</span>}
          </Link>
        ))}
      </div>
      <div
        className="p-3 border-t border-secondary/50 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-center">
          <span className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path d="M8.59 16.34L13.17 12 8.59 7.66 10 6.25l6 6-6 6z" />
            </svg>
          </span>
        </div>
      </div>
    </div>
  )
}
