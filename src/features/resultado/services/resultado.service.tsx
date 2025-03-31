//src/features/resultado/services/resultado.service.tsx
import { apiClient } from '../../../shared/services/apiClient'
import { TipoResultado } from '../interfaces/tipoResultado.interface'

export const getTipoResultado = async (idResultado: number): Promise<TipoResultado> => {
  const { data } = await apiClient.get<TipoResultado>(`/tiposResultado/${idResultado}`)
  return data
}
