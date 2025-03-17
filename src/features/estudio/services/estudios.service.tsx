//src/features/solicitud/services/estudio.service.tsx
import { apiClient } from '../../../shared/services/apiClient'
import { Estudio } from '../interfaces/estudio.interface'

export const getEstudios = async (): Promise<Estudio[]> => {
  const { data } = await apiClient.get<Estudio[]>(`/estudios`)
  return data
}
