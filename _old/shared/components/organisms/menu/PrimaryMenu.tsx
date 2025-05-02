//src/shared/components/organisms/menu/PrimaryMenu.tsx
import React from 'react'
import { useMenu } from '../../../contexts/MenuContext'
import Button, { ButtonVariants } from '../../atoms/Button'
import { useNavigate } from 'react-router-dom'

const PrimaryMenu: React.FC = () => {
  const { menuItems, activeMenu, setActiveMenu, setActiveSubMenu } = useMenu()
  const navigate = useNavigate()

  return (
    <div className="flex gap-4">
      {menuItems.map(item => (
        <Button
          key={item.id}
          variant={ButtonVariants.MENU}
          onClick={() => {
            setActiveMenu(item.id)
            setActiveSubMenu(null) // Reinicia el submenú
            if (item.to) {
              navigate(item.to)
            }
          }}
          className={`p-2 hover:bg-white hover:text-primary ${
            activeMenu === item.id ? 'border border-white text-white' : 'bg-transparent'
          }`}
        >
          {item.icon}
          <span className="ml-2">{item.label}</span>
        </Button>
      ))}
    </div>
  )
}

export default PrimaryMenu
