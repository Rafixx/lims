//src/shared/components/organisms/Header.tsx
import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext } from '../../contexts/UserContext'
import Button, { ButtonVariants } from '../atoms/Button'
import PrimaryMenu from './menu/PrimaryMenu'
import SubMenu from './menu/SubMenu'
import { FiPower } from 'react-icons/fi'

const Header: React.FC = () => {
  const { token, logout, user } = useContext(UserContext)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="bg-primary text-white">
      <div className="p-3 flex justify-between items-center">
        <div className="w-48">
          <Link to="/">Epidisease - LIMS</Link>
          {/* Aquí podrías mostrar información sobre el estado activo */}
        </div>
        <PrimaryMenu />
        <nav>
          {token ? (
            <div className="flex items-center gap-4">
              <span>{user?.nombre}</span>
              <Button
                variant={ButtonVariants.MENU}
                className="hover:bg-slate-100 hover:text-primary"
                onClick={handleLogout}
              >
                <FiPower size={20} />
              </Button>
            </div>
          ) : (
            <Button variant={ButtonVariants.MENU} className="hover:bg-slate-100 hover:text-primary">
              <Link to="/login">Iniciar sesión</Link>
            </Button>
          )}
        </nav>
      </div>
      {/* Puedes colocar el SubMenu justo debajo del menú principal */}
      <SubMenu />
    </header>
  )
}

export default Header
