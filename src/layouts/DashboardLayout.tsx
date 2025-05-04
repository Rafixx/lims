import { Outlet } from 'react-router-dom'
import { Sidebar } from '../shared/components/organisms/Sidebar'
import { useUser } from '../shared/contexts/UserContext'
import { useNavigate } from 'react-router-dom'

export const DashboardLayout = () => {
  const { user, logout } = useUser()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 bg-gray-50 overflow-auto">
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Panel Principal</h1>
          {user && (
            <div className="flex items-center gap-4">
              <span data-testid="username-display" className="text-gray-700 font-medium">
                👤 {user.username}
              </span>
              <button
                onClick={handleLogout}
                className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </header>
        <section className="p-6">
          <Outlet />
        </section>
      </main>
    </div>
  )
}
