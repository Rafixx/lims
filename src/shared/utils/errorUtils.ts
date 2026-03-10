import axios from 'axios'

/**
 * Extrae el mensaje de error más informativo posible de cualquier excepción.
 * Prioriza el mensaje del backend (response.data.message), luego mapea
 * códigos HTTP a mensajes legibles, y finalmente usa un fallback genérico.
 */
export function getErrorMessage(error: unknown, fallback = 'Ha ocurrido un error inesperado'): string {
  if (!axios.isAxiosError(error)) {
    if (error instanceof Error) return error.message
    return fallback
  }

  // Sin respuesta del servidor (red caída, CORS, servidor apagado)
  if (!error.response) {
    return 'No se puede conectar con el servidor. Comprueba tu conexión e inténtalo de nuevo.'
  }

  const status = error.response.status
  const data = error.response.data

  // Usar el mensaje del backend si está disponible
  const backendMessage: string | undefined =
    typeof data?.message === 'string' ? data.message :
    typeof data === 'string' ? data :
    undefined

  if (backendMessage) return backendMessage

  // Mensajes por defecto según código HTTP
  switch (status) {
    case 400: return 'Datos inválidos. Revisa el formulario.'
    case 401: return 'Credenciales incorrectas.'
    case 403: return 'No tienes permiso para realizar esta acción.'
    case 404: return 'El recurso solicitado no existe.'
    case 409: return 'Ya existe un registro con esos datos.'
    case 422: return 'Los datos enviados no son válidos.'
    case 429: return 'Demasiados intentos. Espera unos minutos e inténtalo de nuevo.'
    case 500: return 'Error interno del servidor. Inténtalo más tarde.'
    default:  return `Error ${status}. Inténtalo de nuevo.`
  }
}
