import { apiClient } from './apiClient'

export interface CreateUserDto {
  nombre: string
  username: string
  email: string
  password: string
  id_rol: number
}

export const createUser = async (data: CreateUserDto) => {
  const response = await apiClient.post('/usuarios', data)
  return response.data
}
