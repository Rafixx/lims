//src/shared/components/organisms/menu/menuConfig.tsx
import React from 'react'
import {
  FiHome,
  FiUsers,
  FiPrinter,
  FiLayers,
  FiList,
  FiBarChart2,
  FiSettings
} from 'react-icons/fi'

export interface MenuItem {
  id: string
  icon?: React.ReactNode
  label: string
  to?: string
  children?: MenuItem[]
}

export const menuConfig: MenuItem[] = [
  {
    id: 'inicio',
    // icon: <FiHome size={20} />,
    label: 'Inicio',
    to: '/home'
  },
  {
    id: 'solicitudes',
    label: 'Solicitudes',
    children: [
      {
        id: 'muestras',
        // icon: <FiUsers size={20} />,
        label: 'Muestras',
        to: '/solicitudes/muestras'
      },
      {
        id: 'tecnicas',
        // icon: <FiPrinter size={20} />,
        label: 'Técnicas',
        to: '/solicitudes/tecnicas'
      },
      {
        id: 'pruebas',
        // icon: <FiPrinter size={20} />,
        label: 'Pruebas',
        to: '/solicitudes/pruebas'
      },
      {
        id: 'estudios',
        // icon: <FiPrinter size={20} />,
        label: 'Estudios',
        to: '/solicitudes/estudios'
      }
    ]
  },
  {
    id: 'listasTrabajo',
    label: 'Listas de trabajo',
    children: [
      {
        id: 'listasTrabajo',
        // icon: <FiLayers size={20} />,
        label: 'Listas de trabajo de técnicas',
        to: '/listasTrabajo'
      }
    ]
  },
  {
    id: 'catalogo',
    label: 'Catálogo',
    children: [
      {
        id: 'aparatos',
        // icon: <FiBarChart2 size={20} />,
        label: 'Aparatos',
        to: '/catalogo/aparatos'
      },
      {
        id: 'pipetas',
        // icon: <FiBarChart2 size={20} />,
        label: 'Pipetas',
        to: '/catalogo/pipetas'
      },
      {
        id: 'reactivos',
        // icon: <FiBarChart2 size={20} />,
        label: 'Reactivos',
        to: '/catalogo/reactivos'
      },
      {
        id: 'usuarios',
        // icon: <FiBarChart2 size={20} />,
        label: 'Usuarios',
        to: '/catalogo/usuarios'
      },
      {
        id: 'estudios',
        // icon: <FiBarChart2 size={20} />,
        label: 'Estudios',
        to: '/catalogo/estudios'
      },
      {
        id: 'procesos',
        // icon: <FiBarChart2 size={20} />,
        label: 'Procesos',
        to: '/catalogo/procesos'
      },
      {
        id: 'tiposResultado',
        // icon: <FiBarChart2 size={20} />,
        label: 'Tipos de resultado',
        to: '/catalogo/tiposResultado'
      }
    ]
  },
  {
    id: 'descargas',
    label: 'Descargas',
    children: [
      {
        id: 'graficos_d',
        // icon: <FiBarChart2 size={20} />,
        label: 'Gráficos',
        to: '/estadistica/graficos'
      },
      {
        id: 'reportes_d',
        // icon: <FiList size={20} />,
        label: 'Reportes',
        to: '/estadistica/reportes'
      }
    ]
  }
]
