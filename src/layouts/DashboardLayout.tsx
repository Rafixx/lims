import { Outlet } from 'react-router-dom'
import { Sidebar } from '../shared/components/organisms/Sidebar'
import { useUser } from '../shared/contexts/UserContext'
import { useNavigate } from 'react-router-dom'
import { LogOut, Menu } from 'lucide-react'
import { Button } from '@/shared/components/molecules/Button'
import { useState } from 'react'

const iconUrl = `${import.meta.env.BASE_URL}icons/icon.svg`

export const DashboardLayout = () => {
  const { user, logout } = useUser()
  const navigate = useNavigate()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={() => setIsMobileMenuOpen(false)}
      />

      <main className="flex-1 bg-gray-50 overflow-auto min-w-0">
        <header className="bg-white shadow p-4 flex justify-between items-center gap-4">
          <span className="flex items-center gap-3">
            {/* Hamburger — solo visible en móvil */}
            <button
              className="md:hidden p-1.5 rounded-md text-surface-600 hover:bg-surface-100 transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Abrir menú"
            >
              <Menu className="w-5 h-5" />
            </button>
            <img src={iconUrl} alt="LIMS Icon" className="h-8 w-8" />
            <h1 className="text-xl font-semibold hidden sm:block">LIMS</h1>
          </span>

          {user && (
            <div className="flex items-center gap-4 bg-gray-100 rounded-lg">
              <div
                data-testid="username-display"
                className="flex items-center gap-3 sm:gap-6 px-3 py-2 bg-secondary/30 rounded-md shadow-sm"
              >
                <div className="text-sm text-gray-800 hidden sm:block">
                  <div className="font-semibold">{user.username}</div>
                  <div className="flex items-center text-xs text-surface-500 gap-2">
                    <span>{user.rol_name}</span>
                  </div>
                </div>
                {/* En móvil solo mostramos las iniciales */}
                <div className="sm:hidden w-7 h-7 rounded-full bg-primary-100 text-primary-700 text-xs font-bold flex items-center justify-center flex-shrink-0">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <Button
                  variant="ghost"
                  className="text-surface-500"
                  onClick={handleLogout}
                  title="Cerrar sesión"
                >
                  <LogOut className="w-5 h-5" />
                </Button>
              </div>
            </div>
          )}
        </header>

        <section className="p-4 sm:p-6">
          <Outlet />
        </section>
      </main>
    </div>
  )
}
