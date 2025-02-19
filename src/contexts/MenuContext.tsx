// src/contexts/MenuContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react'
import { FiHome, FiUser, FiSettings, FiList, FiBarChart2, FiLayers } from 'react-icons/fi'
import { MenuItem } from '../customComponents/organisms/Sidebar'
import { useUser } from './UserContext'

export type MenuState = 'inicio' | 'resultados' | 'estadistica'

interface MenuContextValue {
  menuState: MenuState
  menuItems: MenuItem[]
  setMenuState: (state: MenuState) => void
}

const MenuContext = createContext<MenuContextValue | undefined>(undefined)

export const MenuProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Obtenemos el nombre de usuario desde UserContext.
  const { username } = useUser()
  const [menuState, setMenuState] = useState<MenuState>('inicio')

  // Definimos el menú base, que siempre se mostrará.
  const baseMenuItems: MenuItem[] = [
    { icon: <FiHome size={20} />, label: 'Inicio', to: '/' },
    { icon: <FiUser size={20} />, label: username || 'Usuario', to: '/profile' }
  ]

  // Derivamos los ítems dinámicos según el estado del menú.
  let dynamicMenuItems: MenuItem[] = []
  switch (menuState) {
    case 'inicio':
      dynamicMenuItems = [
        { icon: <FiSettings size={20} />, label: 'Ajustes', to: '/settings' },
        { icon: <FiSettings size={20} />, label: 'Maquinas', to: '/settings/maquinas' }
      ]
      break
    case 'resultados':
      dynamicMenuItems = [
        { icon: <FiList size={20} />, label: 'Listado', to: '/resultados/listado' },
        { icon: <FiSettings size={20} />, label: 'Filtros', to: '/resultados/filtros' },
        { icon: <FiLayers size={20} />, label: 'Muestras', to: '/resultados/muestras' }
      ]
      break
    case 'estadistica':
      dynamicMenuItems = [
        { icon: <FiBarChart2 size={20} />, label: 'Gráficos', to: '/estadistica/graficos' },
        { icon: <FiList size={20} />, label: 'Reportes', to: '/estadistica/reportes' }
      ]
      break
    default:
      dynamicMenuItems = []
  }

  // Combinamos el menú base con el dinámico.
  const menuItems: MenuItem[] = [...baseMenuItems, ...dynamicMenuItems]

  const value: MenuContextValue = { menuState, menuItems, setMenuState }

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>
}

export const useMenu = (): MenuContextValue => {
  const context = useContext(MenuContext)
  if (!context) {
    throw new Error('useMenu debe usarse dentro de MenuProvider')
  }
  return context
}
