import {
  LucideHome,
  LucideFileText,
  LucideListCheck,
  Beaker,
  LucideSettings,
  Database,
  TestTube,
  Building,
  Folder,
  Users,
  UserCheck,
  CheckCircle,
  MapPin,
  Cpu,
  Pipette,
  FlaskConical,
  LucideIcon
} from 'lucide-react'

// Tipos para la nueva estructura de menú
export interface MenuItemBase {
  path: string
  label: string
  icon: LucideIcon
  description?: string
}

export interface MenuItemWithChildren {
  label: string
  icon: LucideIcon
  isCollapsible: true
  children: MenuItemBase[]
}

export type MenuItem = MenuItemBase | MenuItemWithChildren

// Funciones principales del LIMS (siempre visibles)
export const mainMenuItems: MenuItemBase[] = [
  {
    path: '/dashboard',
    label: 'Inicio',
    icon: LucideHome,
    description: 'Panel principal'
  },
  {
    path: '/muestras',
    label: 'Muestras',
    icon: TestTube,
    description: 'Gestión de muestras de laboratorio'
  },
  // {
  //   path: '/solicitudes',
  //   label: 'Solicitudes',
  //   icon: LucideFileText,
  //   description: 'Solicitudes y técnicas'
  // },
  {
    path: '/worklist',
    label: 'Listas de trabajo',
    icon: LucideListCheck,
    description: 'Gestión de listas de trabajo'
  }
]

// Maestros y configuración (agrupados y colapsables)
export const configMenuItems: MenuItemWithChildren = {
  label: 'Configuración',
  icon: LucideSettings,
  isCollapsible: true,
  children: [
    {
      path: '/pruebas',
      label: 'Pruebas',
      icon: Beaker,
      description: 'Catálogo de pruebas de laboratorio'
    },
    {
      path: '/centros',
      label: 'Centros',
      icon: Building,
      description: 'Centros sanitarios y laboratorios'
    },
    {
      path: '/pacientes',
      label: 'Pacientes',
      icon: Users,
      description: 'Gestión de pacientes'
    },
    {
      path: '/clientes',
      label: 'Clientes',
      icon: UserCheck,
      description: 'Gestión de clientes'
    },
    {
      path: '/criterios-validacion',
      label: 'Criterios de Validación',
      icon: CheckCircle,
      description: 'Criterios para validación de resultados'
    },
    {
      path: '/ubicaciones',
      label: 'Ubicaciones',
      icon: MapPin,
      description: 'Gestión de ubicaciones'
    },
    {
      path: '/maquinas',
      label: 'Máquinas',
      icon: Cpu,
      description: 'Equipos y máquinas de laboratorio'
    },
    {
      path: '/pipetas',
      label: 'Pipetas',
      icon: Pipette,
      description: 'Pipetas y equipos de medición'
    },
    {
      path: '/reactivos',
      label: 'Reactivos',
      icon: FlaskConical,
      description: 'Reactivos y componentes químicos'
    },
    {
      path: '/tipos-muestra',
      label: 'Tipos de Muestra',
      icon: Folder,
      description: 'Clasificación de muestras'
    }
  ]
}

// Menú completo del sidebar (estructura jerárquica)
export const sidebarMenuStructure: MenuItem[] = [...mainMenuItems, configMenuItems]

// Cards para la página principal (solo funciones principales + acceso rápido a maestros)
export const homePageMainCards: MenuItemBase[] = [
  {
    path: '/muestras',
    label: 'Muestras',
    icon: TestTube,
    description: 'Gestión de muestras de laboratorio'
  },
  // {
  //   path: '/solicitudes',
  //   label: 'Solicitudes',
  //   icon: LucideFileText,
  //   description: 'Solicitudes y técnicas'
  // },
  {
    path: '/worklist',
    label: 'Listas de trabajo',
    icon: LucideListCheck,
    description: 'Gestión de listas de trabajo'
  }
]

// Card especial para maestros en dashboard (acceso rápido)
export const homePageConfigCard: MenuItemBase = {
  path: '/maestros',
  label: 'Configuración',
  icon: Database,
  description: 'Maestros y configuración del sistema'
}
