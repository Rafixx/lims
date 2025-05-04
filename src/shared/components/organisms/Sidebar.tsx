import { Link } from 'react-router-dom'
import { menuItems } from '@/shared/config/menuConfig'

export const Sidebar = () => {
  return (
    <aside className="w-64 bg-gray-800 text-white p-4">
      <h2 className="text-xl font-bold mb-4">LIMS</h2>
      <nav className="space-y-2">
        {menuItems.map(item => (
          <Link key={item.path} to={item.path} className="block hover:underline">
            {item.icon} {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
