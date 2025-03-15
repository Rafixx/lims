//src/features/solicitud/services/solicitudes.service.tsx
import { apiClient } from '../../../shared/services/apiClient'
import { Solicitud } from '../interfaces/solicitud.interface'

export const getSolicitudes = async (): Promise<Solicitud[]> => {
  const { data } = await apiClient.get<Solicitud[]>('/solicitudes')
  return data
}
