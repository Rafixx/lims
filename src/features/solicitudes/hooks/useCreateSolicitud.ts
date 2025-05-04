import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/shared/services/apiClient'
import { Solicitud } from '../interfaces/solicitud.interface'

interface NuevaSolicitudDTO {
  id_cliente: number
  id_prueba: number
  f_creacion: string
}

export const useCreateSolicitud = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (nueva: NuevaSolicitudDTO) =>
      apiClient.post<Solicitud>('/solicitudes', nueva).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['solicitudes'] })
    }
  })
}
