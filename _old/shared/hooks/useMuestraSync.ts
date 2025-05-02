// src/hooks/useMuestraSync.ts
import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { io } from 'socket.io-client'
import { env_BaseURL } from '../shared/services/apiClient'
// Crea la instancia del socket apuntando al backend
export const socket = io(env_BaseURL, {
  transports: ['websocket'] // Forzamos el uso exclusivo de WebSocket
})

export const useMuestraSync = () => {
  const queryClient = useQueryClient()

  useEffect(() => {
    const onActualizar = () => {
      // Opcionalmente, podrías usar 'updatedMuestras' para actualizar el estado local,
      // pero lo habitual es invalidar la query para refetch de los datos.
      queryClient.invalidateQueries({ queryKey: ['muestras'] })
    }

    // Escucha los eventos emitidos por el backend
    socket.on('muestra_actualizada', onActualizar)
    socket.on('muestra_nueva', onActualizar)
    socket.on('muestra_eliminada', onActualizar)

    return () => {
      socket.off('muestra_actualizada', onActualizar)
      socket.off('muestra_nueva', onActualizar)
      socket.off('muestra_eliminada', onActualizar)
    }
  }, [queryClient])
}
