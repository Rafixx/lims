// src/components/UpdateMuestraButton.tsx
import React from 'react'
import { apiClient } from '../services/apiClient'
import Button from '../customComponents/atoms/Button'
import { FiRotateCcw } from 'react-icons/fi'

interface UpdateMuestraButtonProps {
  id: string
}

const UpdateMuestraButton: React.FC<UpdateMuestraButtonProps> = ({ id }) => {
  const handleClick = async () => {
    try {
      // Supongamos que definiste en tus rutas un endpoint PUT en /api/muestras/:id/estado
      const { data } = await apiClient.put(`/api/muestras/${id}/estado`)
      console.warn('Muestra actualizada:', data)
      // Aquí podrías, por ejemplo, notificar al usuario o refrescar la lista
    } catch (error) {
      console.error('Error actualizando la muestra:', error)
    }
  }

  return (
    <Button onClick={handleClick}>
      <FiRotateCcw />
    </Button>
  )
}

export default UpdateMuestraButton
