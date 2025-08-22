import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/shared/services/apiClient'
// import { Solicitud } from '../interfaces/solicitud.interface'
import { SolicitudAPIResponse } from '../interfaces/api.types'

interface NuevaSolicitudDTO {
  id_cliente: number
  id_prueba: number
  f_creacion: string
  created_by: number
}

export const useCreateSolicitud = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (nueva: NuevaSolicitudDTO) =>
      apiClient.post<SolicitudAPIResponse>('/solicitudes', nueva).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['solicitudes'] })
    }
  })
}
