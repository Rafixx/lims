// src/services/authService.ts
export interface LoginResponse {
  token: string
  user: {
    id: string
    nombre: string
    email: string
    rol: string
    fechaCreacion: string
  }
}

export const loginService = async (email: string, password: string): Promise<LoginResponse> => {
  const env_BaseURL = import.meta.env.VITE_BASE_URL
  const response = await fetch(`${env_BaseURL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  })
  if (!response.ok) {
    throw new Error('Credenciales inválidas')
  }
  return response.json()
}
