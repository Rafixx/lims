//src/features/listasTrabajo/services/listaTrabajo.service.tsx
import { apiClient } from '../../../shared/services/apiClient'
import { ListaTrabajo } from '../interfaces/listaTrabajo.interface'

export const getListaTrabajo = async (id: number): Promise<ListaTrabajo> => {
  const { data } = await apiClient.get<ListaTrabajo>(`/listasTrabajo/${id}`)
  return data
}
