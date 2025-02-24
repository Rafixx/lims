// src/contexts/MenuContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react'
import {
  // FiHome,
  FiUser,
  FiSettings,
  FiList,
  FiBarChart2,
  FiLayers,
  FiFileText,
  FiPrinter,
  FiSearch,
  FiUsers
} from 'react-icons/fi'
import { MenuItem } from '../customComponents/organisms/Sidebar'

export type MenuState = 'inicio' | 'resultados' | 'estadistica' | 'configuracion'

interface MenuContextValue {
  menuState: MenuState
  menuItems: MenuItem[]
  setMenuState: (state: MenuState) => void
  menuBackgroundColor: string
  menuHoverColor: string
}

const MenuContext = createContext<MenuContextValue | undefined>(undefined)

export const MenuProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Obtenemos el nombre de usuario desde UserContext.
  const [menuState, setMenuState] = useState<MenuState>('inicio')

  // Definimos el menú base, que siempre se mostrará.
  const baseMenuItems: MenuItem[] = [] //[{ icon: <FiHome size={20} />, label: 'Inicio', to: '/' }]

  // Derivamos los ítems dinámicos según el estado del menú.
  let dynamicMenuItems: MenuItem[] = []
  switch (menuState) {
    case 'inicio':
      dynamicMenuItems = [
        // { icon: <FiSettings size={20} />, label: 'Ajustes', to: '/settings' },
        { icon: <FiUser size={20} />, label: 'Usuario', to: '/profile' }
      ]
      break
    case 'configuracion':
      dynamicMenuItems = [
        { icon: <FiUsers size={20} />, label: 'Usuarios', to: '/configuracion/usuarios' },
        { icon: <FiPrinter size={20} />, label: 'Maquinas', to: '/configuracion/maquinas' },
        { icon: <FiFileText size={20} />, label: 'Productos', to: '/configuracion/productos' },
        { icon: <FiSearch size={20} />, label: 'Tecnicas', to: '/configuracion/tecnicas' }
      ]
      break
    case 'resultados':
      dynamicMenuItems = [
        { icon: <FiLayers size={20} />, label: 'Muestras', to: '/resultados/muestras' },
        { icon: <FiList size={20} />, label: 'Listado', to: '/resultados/listado' },
        { icon: <FiSettings size={20} />, label: 'Filtros', to: '/resultados/filtros' }
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

  // Definimos colores para cada menú:
  const backgroundColors: Record<MenuState, string> = {
    inicio: 'bg-blue-500',
    resultados: 'bg-green-500',
    estadistica: 'bg-purple-500',
    configuracion: 'bg-orange-500'
  }

  const hoverColors: Record<MenuState, string> = {
    inicio: 'hover:bg-blue-400/80',
    resultados: 'hover:bg-green-400/80',
    estadistica: 'hover:bg-purple-400/80',
    configuracion: 'hover:bg-orange-400/80'
  }

  const value: MenuContextValue = {
    menuState,
    menuItems,
    setMenuState,
    menuBackgroundColor: backgroundColors[menuState],
    menuHoverColor: hoverColors[menuState]
  }
  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>
}

export const useMenu = (): MenuContextValue => {
  const context = useContext(MenuContext)
  if (!context) {
    throw new Error('useMenu debe usarse dentro de MenuProvider')
  }
  return context
}
