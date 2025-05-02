//src/features/catalogo/reactivo/services/reactivo.service.tsx
import { apiClient } from '../../../../shared/services/apiClient'
import { Reactivo } from '../interfaces/reactivo.interface'

export const getReactivos = async (): Promise<Reactivo[]> => {
  const { data } = await apiClient.get<Reactivo[]>('/reactivos')
  return data
}
