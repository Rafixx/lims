import { apiClient } from '@/shared/services/apiClient'
import type {
  Usuario,
  Rol,
  CreateUsuarioDto,
  UpdateUsuarioDto,
  ChangePasswordDto
} from '../interfaces/usuario.types'

class UsuarioService {
  private readonly basePath = '/usuarios'
  private readonly rolesPath = '/roles'

  async getUsuarios(): Promise<Usuario[]> {
    const response = await apiClient.get<Usuario[]>(this.basePath)
    return response.data
  }

  async getUsuario(id: number): Promise<Usuario> {
    const response = await apiClient.get<Usuario>(`${this.basePath}/${id}`)
    return response.data
  }

  async createUsuario(data: CreateUsuarioDto): Promise<Usuario> {
    const response = await apiClient.post<Usuario>(this.basePath, data)
    return response.data
  }

  async updateUsuario(id: number, data: UpdateUsuarioDto): Promise<Usuario> {
    const response = await apiClient.put<Usuario>(`${this.basePath}/${id}`, data)
    return response.data
  }

  async changePassword(id: number, data: ChangePasswordDto): Promise<void> {
    await apiClient.put(`${this.basePath}/${id}/password`, data)
  }

  async deleteUsuario(id: number): Promise<void> {
    await apiClient.delete(`${this.basePath}/${id}`)
  }

  async getRoles(): Promise<Rol[]> {
    const response = await apiClient.get<Rol[]>(this.rolesPath)
    return response.data
  }
}

export const usuarioService = new UsuarioService()
