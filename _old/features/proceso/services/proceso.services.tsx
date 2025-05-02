//src/features/proceso/services/proceso.services.tsx
import { apiClient } from '../../../shared/services/apiClient'
import { Proceso } from '../interfaces/proceso.interface'

export const getProceso = async (idProceso: number): Promise<Proceso> => {
  const { data } = await apiClient.get<Proceso>(`/proceso/${idProceso}`)
  return data
}
