// src/pages/HomePage.tsx
import React from 'react'
import { useMenu } from '../contexts/MenuContext'
import Button from '../customComponents/atoms/Button'
import { MenuState } from '../contexts/MenuContext'

const HomePage: React.FC = () => {
  const { menuState, setMenuState } = useMenu()

  // Función genérica para alternar el menú hacia un estado dado o volver a 'inicio'
  const toggleMenuState = (targetState: MenuState): void => {
    setMenuState(menuState !== targetState ? targetState : 'inicio')
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Bienvenido a LIMS</h1>
      <p className="mb-6 text-gray-700">
        Este es el sistema de gestión de información de laboratorio. Aquí podrás gestionar muestras,
        consultar resultados y más.
      </p>
      <p className="mb-6 text-gray-700">
        Aquí se muestran los datos del usuario. Actualmente el estado del menú es:{' '}
        <strong>{menuState}</strong>
      </p>

      <div className="flex w-0 flex-row gap-4">
        <Button onClick={() => toggleMenuState('resultados')}>Cambiar Menú Resultados</Button>
        <Button onClick={() => toggleMenuState('estadistica')}>Cambiar Menú Estadística</Button>
        <Button onClick={() => toggleMenuState('configuracion')}>Cambiar Menú Configuracion</Button>
      </div>
    </div>
  )
}

export default HomePage
