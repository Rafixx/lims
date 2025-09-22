import { LucideHome, LucideFileText, LucideListCheck } from 'lucide-react'

export const sideBarMenuItems = [
  { path: '/dashboard', label: 'Inicio', icon: LucideHome },
  { path: '/muestras', label: 'Muestras', icon: LucideFileText },
  { path: '/solicitudes', label: 'Técnicas', icon: LucideFileText },
  { path: '/pruebas', label: 'Pruebas', icon: LucideFileText },
  { path: '/solicitudes', label: 'Estudios', icon: LucideFileText },
  { path: '/worklist', label: 'Work Lists', icon: LucideListCheck }
]

export const homePageMenuCards = [
  // { path: '/dashboard', label: 'Inicio', icon: LucideHome },
  { path: '/solicitudes', label: 'Solicitudes', icon: LucideFileText },
  { path: '/muestras', label: 'Muestras', icon: LucideFileText },
  { path: '/solicitudes', label: 'Técnicas', icon: LucideFileText },
  { path: '/pruebas', label: 'Pruebas', icon: LucideFileText },
  { path: '/solicitudes', label: 'Estudios', icon: LucideFileText },
  { path: '/worklist', label: 'Work Lists', icon: LucideListCheck }
]
