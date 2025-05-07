import { apiClient } from './apiClient'
import { TOKEN_KEY } from '../constants'

export interface LoginPayload {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
}

export const login = async (data: LoginPayload): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>('/login', data)
  return response.data
}
export const logout = async (): Promise<void> => {
  await apiClient.post('/logout')
  localStorage.removeItem(TOKEN_KEY)
}
