//src/features/catalogo/pipeta/services/pipeta.service.tsx
import { apiClient } from '../../../../shared/services/apiClient'
import { Pipeta } from '../interfaces/pipeta.interface'

export const getPipetaById = async (id: string): Promise<Pipeta> => {
  const { data } = await apiClient.get<Pipeta>(`/pipetas/${id}`)
  return data
}
