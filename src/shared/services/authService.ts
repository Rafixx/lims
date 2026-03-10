import { apiClient } from './apiClient'
import { TOKEN_KEY } from '../constants/constants'

export interface LoginPayload {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  user: {
    id_usuario: number
    username: string
    nombre: string
    email: string
    rol_name: string
  }
}

export const login = async (data: LoginPayload): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>('/login', data)
  return response.data
}

export const logout = (): void => {
  localStorage.removeItem(TOKEN_KEY)
}
