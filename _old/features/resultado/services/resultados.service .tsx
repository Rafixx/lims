//src/features/resultado/services/resultados.service.tsx
import { apiClient } from '../../../shared/services/apiClient'
import { TipoResultado } from '../interfaces/tipoResultado.interface'

export const getTiposResultado = async (): Promise<TipoResultado[]> => {
  const { data } = await apiClient.get<TipoResultado[]>('/tiposResultado')
  return data
}
