//src/features/catalogo/pipeta/services/pipeta.service.tsx
import { apiClient } from '../../../../shared/services/apiClient'
import { Pipeta } from '../interfaces/pipeta.interface'

export const getPipetas = async (): Promise<Pipeta[]> => {
  const { data } = await apiClient.get<Pipeta[]>('/pipetas')
  return data
}
