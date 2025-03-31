//src/features/proceso/services/procesos.services.tsx
import { apiClient } from '../../../shared/services/apiClient'
import { Proceso } from '../interfaces/proceso.interface'

export const getProcesos = async (): Promise<Proceso[]> => {
  const { data } = await apiClient.get<Proceso[]>('/procesos')
  return data
}
