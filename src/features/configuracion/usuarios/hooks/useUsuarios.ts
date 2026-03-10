import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { usuarioService } from '../services/usuario.service'
import type { CreateUsuarioDto, UpdateUsuarioDto, ChangePasswordDto } from '../interfaces/usuario.types'
import { STALE_TIME, GC_TIME } from '@/shared/constants/constants'

const QUERY_KEY = 'usuarios'
const ROLES_QUERY_KEY = 'roles'

export const useUsuarios = () => {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: () => usuarioService.getUsuarios(),
    staleTime: STALE_TIME,
    gcTime: GC_TIME
  })
}

export const useUsuario = (id?: number) => {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => usuarioService.getUsuario(id!),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    enabled: !!id && id > 0
  })
}

export const useRoles = () => {
  return useQuery({
    queryKey: [ROLES_QUERY_KEY],
    queryFn: () => usuarioService.getRoles(),
    staleTime: STALE_TIME,
    gcTime: GC_TIME
  })
}

export const useCreateUsuario = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateUsuarioDto) => usuarioService.createUsuario(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    }
  })
}

export const useUpdateUsuario = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateUsuarioDto }) =>
      usuarioService.updateUsuario(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY, id] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    }
  })
}

export const useChangePassword = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ChangePasswordDto }) =>
      usuarioService.changePassword(id, data)
  })
}

export const useDeleteUsuario = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => usuarioService.deleteUsuario(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    }
  })
}
