import { Outlet } from 'react-router-dom'
import { Sidebar } from '../shared/components/organisms/Sidebar'
import { useUser } from '../shared/contexts/UserContext'
import { useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { Button } from '@/shared/components/molecules/Button'

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
          <h1 className="text-xl font-semibold">LIMS</h1>
          {user && (
            <div className="flex items-center gap-4 bg-gray-100 rounded-lg">
              <div
                data-testid="username-display"
                className="flex items-center gap-6 px-3 py-2 bg-secondary/30 rounded-md shadow-sm"
              >
                <div className="text-sm text-gray-800">
                  <div className="font-semibold">{user.username}</div>
                  <div className="flex items-center text-xs text-gray-500 gap-2">
                    <span>{user.rol_name}</span>
                  </div>
                </div>
                <Button
                  variant="dark_ghost"
                  className="text-gray-500"
                  onClick={handleLogout}
                  title="Cerrar sesión"
                >
                  <LogOut className="w-6 h-6" />
                </Button>
              </div>
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
