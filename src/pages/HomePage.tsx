// src/pages/HomePage.tsx
import React from 'react'
import SortableList from '../shared/components/molecules/SortableList'
// import { useMenu } from '../contexts/MenuContext'
// import Button from '../customComponents/atoms/Button'
// import { MenuState } from '../contexts/MenuContext'

const HomePage: React.FC = () => {
  // const { menuState, setMenuState } = useMenu()

  // // Función genérica para alternar el menú hacia un estado dado o volver a 'inicio'
  // const toggleMenuState = (targetState: MenuState): void => {
  //   setMenuState(menuState !== targetState ? targetState : 'inicio')
  // }
  const elementosDisponibles = [
    { descripcion: 'Elemento 1' },
    { descripcion: 'Elemento 2' },
    { descripcion: 'Elemento 3' },
    { descripcion: 'Elemento 4' }
  ]

  const handleSortableListChange = (items: { posicion: number; valor: string }[]) => {
    console.warn('Items actualizados:', items)
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Bienvenido a LIMS</h1>
      <p className="mb-6 text-gray-700">
        Este es el sistema de gestión de información de laboratorio. Aquí podrás gestionar muestras,
        consultar resultados y más.
      </p>
      <p className="mb-6 text-gray-700">
        <div className="max-w-lg mx-auto p-4">
          <SortableList list_in={elementosDisponibles} onChange={handleSortableListChange} />
        </div>
      </p>
    </div>
  )
}

export default HomePage
