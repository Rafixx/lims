//src/features/aparato/services/aparatos.service.tsx
import { apiClient } from '../../../../shared/services/apiClient'
import { Aparato } from '../interfaces/aparato.interface'

export const getAparatos = async (): Promise<Aparato[]> => {
  const { data } = await apiClient.get<Aparato[]>('/aparatos')
  return data
}
