//src/features/usuario/services/usuario.service.tsx
import { apiClient } from '../../../shared/services/apiClient'
import { Usuario } from '../interfaces/usuario.interface'

export const getUsuario = async (): Promise<Usuario[]> => {
  const { data } = await apiClient.get<Usuario[]>('/users')
  return data
}
