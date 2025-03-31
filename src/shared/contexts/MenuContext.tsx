//src/shared/contexts/MenuContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react'
import { MenuItem, menuConfig } from '../components/organisms/menu/menuConfig'

export interface MenuContextValue {
  activeMenu: string
  setActiveMenu: (menuId: string) => void
  activeSubMenu: string | null
  setActiveSubMenu: (submenuId: string | null) => void
  menuItems: MenuItem[]
}

const MenuContext = createContext<MenuContextValue | undefined>(undefined)

export const MenuProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeMenu, setActiveMenu] = useState<string>('inicio')
  const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null)

  const value: MenuContextValue = {
    activeMenu,
    setActiveMenu,
    activeSubMenu,
    setActiveSubMenu,
    menuItems: menuConfig
  }

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>
}

export const useMenu = (): MenuContextValue => {
  const context = useContext(MenuContext)
  if (!context) {
    throw new Error('useMenu must be used within MenuProvider')
  }
  return context
}
