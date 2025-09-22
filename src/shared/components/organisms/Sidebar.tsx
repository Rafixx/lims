import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  sidebarMenuStructure,
  MenuItemBase,
  MenuItemWithChildren
} from '@/shared/config/menuConfig'
import { ChevronDown, ChevronRight } from 'lucide-react'

const MenuItem = ({ item }: { item: MenuItemBase }) => {
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
    >
      <Icon className="w-5 h-5" />
      {item.label}
    </NavLink>
  )
}

const CollapsibleMenuItem = ({ item }: { item: MenuItemWithChildren }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const Icon = item.icon
  const ChevronIcon = isExpanded ? ChevronDown : ChevronRight

  return (
    <div>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-surface-700 hover:bg-white hover:text-surface-900 transition-colors"
      >
        <Icon className="w-5 h-5" />
        <span className="flex-1 text-left">{item.label}</span>
        <ChevronIcon className="w-4 h-4" />
      </button>

      {isExpanded && (
        <div className="ml-4 mt-1 space-y-1 border-l border-surface-200 pl-4">
          {item.children.map(child => (
            <MenuItem key={child.path} item={child} />
          ))}
        </div>
      )}
    </div>
  )
}

export const Sidebar = () => {
  return (
    <aside className="w-64 bg-info-100 shadow-soft h-full flex flex-col p-4 border-r border-surface-200">
      <nav className="flex flex-col gap-2">
        {sidebarMenuStructure.map(item => {
          if ('isCollapsible' in item) {
            return <CollapsibleMenuItem key={item.label} item={item} />
          } else {
            return <MenuItem key={item.path} item={item} />
          }
        })}
      </nav>
    </aside>
  )
}
