import axios from 'axios'
import { BASE_URL } from '../constants/constants'
import { TOKEN_KEY } from '../constants/constants'

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 403) {
      localStorage.removeItem(TOKEN_KEY)
      window.location.href = '/login'
    }

    // Enriquecer el mensaje de error para que todos los catch blocks
    // puedan usar error.message y obtener feedback concreto
    if (!error.response) {
      error.message = 'No se puede conectar con el servidor. Comprueba tu conexión.'
    } else {
      const backendMessage = error.response.data?.message
      if (typeof backendMessage === 'string' && backendMessage) {
        error.message = backendMessage
      } else {
        const statusMessages: Record<number, string> = {
          400: 'Datos inválidos. Revisa el formulario.',
          401: 'Credenciales incorrectas.',
          403: 'No tienes permiso para realizar esta acción.',
          404: 'El recurso solicitado no existe.',
          409: 'Ya existe un registro con esos datos.',
          422: 'Los datos enviados no son válidos.',
          429: 'Demasiados intentos. Espera unos minutos e inténtalo de nuevo.',
          500: 'Error interno del servidor. Inténtalo más tarde.'
        }
        error.message = statusMessages[error.response.status] ?? `Error ${error.response.status}. Inténtalo de nuevo.`
      }
    }

    return Promise.reject(error)
  }
)
