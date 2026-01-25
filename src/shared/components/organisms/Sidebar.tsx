import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  sidebarMenuStructure,
  MenuItemBase,
  MenuItemWithChildren
} from '@/shared/config/menuConfig'
import { ChevronDown, ChevronRight, ChevronLeft } from 'lucide-react'

interface SidebarProps {
  isCollapsed: boolean
  onToggleCollapse: () => void
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

export const Sidebar = ({ isCollapsed, onToggleCollapse }: SidebarProps) => {
  return (
    <aside
      className={`${isCollapsed ? 'w-16' : 'w-64'} bg-info-100 shadow-soft h-full flex flex-col p-4 border-r border-surface-200 transition-all duration-300`}
    >
      <div className="flex items-center justify-end mb-4">
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-md hover:bg-white/50 text-surface-600 hover:text-surface-900 transition-colors"
          title={isCollapsed ? 'Expandir menú' : 'Colapsar menú'}
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      <nav className="flex flex-col gap-2">
        {sidebarMenuStructure.map(item => {
          if ('isCollapsible' in item) {
            return <CollapsibleMenuItem key={item.label} item={item} isCollapsed={isCollapsed} />
          } else {
            return <MenuItem key={item.path} item={item} isCollapsed={isCollapsed} />
          }
        })}
      </nav>
    </aside>
  )
}
