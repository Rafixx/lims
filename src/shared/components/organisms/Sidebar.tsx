import { NavLink } from 'react-router-dom'
import { sideBarMenuItems } from '@/shared/config/menuConfig'

export const Sidebar = () => {
  return (
    <aside className="w-64 bg-white shadow h-full flex flex-col p-4 border-r">
      {/* <h2 className="text-lg font-bold text-blue-700 mb-6">LIMS Panel</h2> */}
      <nav className="flex flex-col gap-2">
        {sideBarMenuItems.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md text-sm ${
                isActive
                  ? 'bg-secondary/20 text-blue-700 font-semibold'
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
