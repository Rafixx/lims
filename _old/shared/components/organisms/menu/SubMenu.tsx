//src/shared/components/organisms/menu/SubMenu.tsx
import React from 'react'
import { useMenu } from '../../../contexts/MenuContext'
import Button, { ButtonVariants } from '../../atoms/Button'
import { useNavigate } from 'react-router-dom'

const SubMenu: React.FC = () => {
  const { menuItems, activeMenu, activeSubMenu, setActiveSubMenu } = useMenu()
  const navigate = useNavigate()
  const currentMenu = menuItems.find(item => item.id === activeMenu)

  if (!currentMenu || !currentMenu.children) return null

  return (
    <div className="flex h-14 border-b border-primary py-2 gap-4 bg-white text-primary justify-center">
      {currentMenu.children.map(subItem => (
        <Button
          key={subItem.id}
          variant={ButtonVariants.MENU}
          onClick={() => {
            setActiveSubMenu(subItem.id)
            if (subItem.to) {
              navigate(subItem.to)
            }
          }}
          className={`p-2 hover:bg-white hover:text-primary hover:border border-primary ${
            activeSubMenu === subItem.id
              ? 'bg-white text-primary border border-primary'
              : 'bg-transparent'
          }`}
        >
          {subItem.icon}
          <span className="ml-2">{subItem.label}</span>
        </Button>
      ))}
    </div>
  )
}

export default SubMenu
