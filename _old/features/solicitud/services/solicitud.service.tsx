//src/features/solicitud/services/solicitud.service.tsx
import { apiClient } from '../../../shared/services/apiClient'
import { Solicitud } from '../interfaces/solicitud.interface'

export const getSolicitud = async (idSolicitud: number): Promise<Solicitud> => {
  const { data } = await apiClient.get<Solicitud>(`/solicitudes/${idSolicitud}`)
  return data
}
