export type Usuario = {
  id_usuario: number
  nombre: string
  username: string
  email: string
  id_rol: number
  rol_name?: string
  activo?: boolean
}

export type Rol = {
  id_rol: number
  name: string
}

export type CreateUsuarioDto = Omit<Usuario, 'id_usuario' | 'rol_name' | 'activo'> & {
  password: string
}

export type UpdateUsuarioDto = Partial<Omit<Usuario, 'id_usuario' | 'rol_name' | 'activo'>>

export type ChangePasswordDto = {
  currentPassword: string
  newPassword: string
}
