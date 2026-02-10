import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  sidebarMenuStructure,
  MenuItemBase,
  MenuItemWithChildren
} from '@/shared/config/menuConfig'
import { ChevronDown, ChevronRight, ChevronLeft, X } from 'lucide-react'

interface SidebarProps {
  isCollapsed: boolean
  onToggleCollapse: () => void
  isMobileOpen?: boolean
  onMobileClose?: () => void
}

const MenuItem = ({ item, isCollapsed }: { item: MenuItemBase; isCollapsed: boolean }) => {
  const Icon = item.icon

  return (
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
          isActive
            ? 'bg-secondary-50 text-secondary-700 font-semibold'
            : 'text-surface-700 hover:bg-white hover:text-surface-900'
        }`
      }
      title={isCollapsed ? item.label : undefined}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      {!isCollapsed && <span>{item.label}</span>}
    </NavLink>
  )
}

const CollapsibleMenuItem = ({
  item,
  isCollapsed
}: {
  item: MenuItemWithChildren
  isCollapsed: boolean
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const Icon = item.icon
  const ChevronIcon = isExpanded ? ChevronDown : ChevronRight

  if (isCollapsed) {
    return (
      <NavLink
        to="/maestros"
        className={({ isActive }) =>
          `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
            isActive
              ? 'bg-secondary-50 text-secondary-700 font-semibold'
              : 'text-surface-700 hover:bg-white hover:text-surface-900'
          }`
        }
        title={item.label}
      >
        <Icon className="w-5 h-5 flex-shrink-0" />
      </NavLink>
    )
  }

  return (
    <div>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-surface-700 hover:bg-white hover:text-surface-900 transition-colors"
      >
        <Icon className="w-5 h-5 flex-shrink-0" />
        <span className="flex-1 text-left">{item.label}</span>
        <ChevronIcon className="w-4 h-4" />
      </button>

      {isExpanded && (
        <div className="ml-4 mt-1 space-y-1 border-l border-surface-200 pl-4">
          {item.children.map(child => (
            <MenuItem key={child.path} item={child} isCollapsed={isCollapsed} />
          ))}
        </div>
      )}
    </div>
  )
}

export const Sidebar = ({
  isCollapsed,
  onToggleCollapse,
  isMobileOpen = false,
  onMobileClose
}: SidebarProps) => {
  return (
    <aside
      className={[
        // Base
        'bg-info-100 shadow-soft flex flex-col p-4 border-r border-surface-200 transition-all duration-300',
        // Desktop: siempre visible en el flujo normal, ancho variable
        'md:relative md:translate-x-0 md:flex-shrink-0',
        isCollapsed ? 'md:w-16' : 'md:w-64',
        // Móvil: posición fija, se desliza desde la izquierda
        'fixed inset-y-0 left-0 z-50 w-64 h-full',
        isMobileOpen ? 'translate-x-0' : '-translate-x-full',
        'md:translate-x-0'
      ].join(' ')}
    >
      <div className={`flex items-center mb-4 ${isMobileOpen ? 'justify-between' : 'justify-end'}`}>
        {/* Botón cerrar — solo en móvil cuando está abierto */}
        {isMobileOpen && (
          <button
            onClick={onMobileClose}
            className="md:hidden p-1.5 rounded-md hover:bg-white/50 text-surface-600 hover:text-surface-900 transition-colors"
            aria-label="Cerrar menú"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Botón collapse — solo visible en desktop */}
        <button
          onClick={onToggleCollapse}
          className="hidden md:flex p-1.5 rounded-md hover:bg-white/50 text-surface-600 hover:text-surface-900 transition-colors"
          title={isCollapsed ? 'Expandir menú' : 'Colapsar menú'}
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      <nav className="flex flex-col gap-2">
        {sidebarMenuStructure.map(item => {
          if ('isCollapsible' in item) {
            return (
              <CollapsibleMenuItem
                key={item.label}
                item={item}
                isCollapsed={isCollapsed && !isMobileOpen}
              />
            )
          } else {
            return (
              <MenuItem
                key={item.path}
                item={item}
                isCollapsed={isCollapsed && !isMobileOpen}
              />
            )
          }
        })}
      </nav>
    </aside>
  )
}
