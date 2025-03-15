//src/features/solicitud/services/muestra.service.tsx
import { apiClient } from '../../../shared/services/apiClient'
import { Muestra } from '../interfaces/muestra.interface'

export const getMuestra = async (idSolicitud: string): Promise<Muestra[]> => {
  const { data } = await apiClient.get<Muestra[]>(`/muestras/solicitud/${idSolicitud}`)
  return data
}
