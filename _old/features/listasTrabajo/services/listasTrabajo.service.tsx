//src/features/listasTrabajo/services/listasTrabajo.service.tsx
import { apiClient } from '../../../shared/services/apiClient'
import { ListaTrabajo } from '../interfaces/listaTrabajo.interface'

export const getListasTrabajo = async (): Promise<ListaTrabajo[]> => {
  const { data } = await apiClient.get<ListaTrabajo[]>('/listasTrabajo')
  return data
}
