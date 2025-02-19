// src/pages/ProfilePage.tsx
import React from 'react'
import { useMenu } from '../contexts/MenuContext'
import Button from '../customComponents/atoms/Button'
import { MenuState } from '../contexts/MenuContext'

const ProfilePage: React.FC = () => {
  const { menuState, setMenuState } = useMenu()

  // Función genérica para alternar el menú hacia un estado dado o volver a 'inicio'
  const toggleMenuState = (targetState: MenuState): void => {
    setMenuState(menuState !== targetState ? targetState : 'inicio')
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-3xl font-bold mb-4">Perfil de Usuario</h1>
      <p className="mb-6 text-gray-700">
        Aquí se muestran los datos del usuario. Actualmente el estado del menú es:{' '}
        <strong>{menuState}</strong>
      </p>
      <div className="flex flex-col gap-4">
        <Button onClick={() => toggleMenuState('resultados')}>Cambiar Menú Resultados</Button>
        <Button onClick={() => toggleMenuState('estadistica')}>Cambiar Menú Estadística</Button>
        <Button onClick={() => toggleMenuState('catalogo')}>Cambiar Menú Catalogo</Button>
      </div>
    </div>
  )
}

export default ProfilePage
