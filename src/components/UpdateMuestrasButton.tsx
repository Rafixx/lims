// src/components/UpdateMuestrasButton.tsx
import React from 'react'
import { socket } from '../hooks/useMuestraSync'
import Button from '../customComponents/atoms/Button'

const UpdateMuestrasButton: React.FC = () => {
  const handleClick = () => {
    // Emite el evento al backend para actualizar las muestras
    socket.emit('actualizar_muestras')
  }

  return <Button onClick={handleClick}>Actualizar muestras</Button>
}

export default UpdateMuestrasButton
