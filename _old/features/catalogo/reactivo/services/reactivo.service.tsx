//src/features/catalogo/reactivo/services/reactivo.service.tsx
import { apiClient } from '../../../../shared/services/apiClient'
import { Reactivo } from '../interfaces/reactivo.interface'

export const getReactivo = async (id: string): Promise<Reactivo> => {
  const { data } = await apiClient.get<Reactivo>(`/reactivos/${id}`)
  return data
}
