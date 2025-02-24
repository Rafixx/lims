// src/components/Header.tsx
import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext } from '../contexts/UserContext'
import Button from '../customComponents/atoms/Button'
import { useMenu } from '../contexts/MenuContext'
import { FiHome, FiPower } from 'react-icons/fi'

const Header: React.FC = () => {
  const { token, logout, user } = useContext(UserContext)
  const { menuBackgroundColor, menuState, setMenuState } = useMenu()

  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className={`p-3 ${menuBackgroundColor} text-white flex justify-between items-center`}>
      <div className="p-2">
        <Link to="/">Epidisease - LIMS</Link>
        <p className="text-sm">Estamos en: {menuState}</p>
      </div>
      <div className="flex flex-row gap-4">
        <Button onClick={() => setMenuState('inicio')}>
          <FiHome size={20} />
        </Button>
        <Button onClick={() => setMenuState('resultados')}>Resultados</Button>
        <Button onClick={() => setMenuState('estadistica')}>Estadística</Button>
        <Button onClick={() => setMenuState('configuracion')}>Configuracion</Button>
      </div>
      <nav>
        {token ? (
          <div className="p-2 ">
            <span className="mr-5"> {user?.nombre}</span>
            <Button onClick={handleLogout}>
              <FiPower />
            </Button>
          </div>
        ) : (
          <Button>
            <Link to="/login">Iniciar sesión</Link>
          </Button>
        )}
      </nav>
    </header>
  )
}

export default Header
