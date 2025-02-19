// src/customComponents/molecules/Sidebar.tsx
import React from 'react'
import { Link } from 'react-router-dom'
import { useMenu } from '../../contexts/MenuContext'

export interface MenuItem {
  icon: React.ReactNode
  label: string
  to: string
}

export const Sidebar: React.FC = () => {
  const [isExpanded, setIsExpanded] = React.useState(false)
  const { menuItems, menuBackgroundColor, menuHoverColor } = useMenu()

  return (
    <div
      className={`
        ${menuBackgroundColor} text-white h-full flex flex-col 
        ${isExpanded ? 'w-54' : 'w-16'} transition-all duration-300
      `}
    >
      <div className="flex-1">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.to}
            className={`
              flex items-center p-3 cursor-pointer 
              ${menuHoverColor} 
            `}
          >
            <div className="flex-shrink-0">{item.icon}</div>
            {isExpanded && <span className="ml-3">{item.label}</span>}
          </Link>
        ))}
      </div>
      <div
        className={`p-3 border-t border-white/20 cursor-pointer ${menuHoverColor}`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className={`flex items-center justify-center ${menuHoverColor}`}>
          <span className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M8.59 16.34L13.17 12 8.59 7.66 10 6.25l6 6-6 6z" />
            </svg>
          </span>
        </div>
      </div>
    </div>
  )
}
