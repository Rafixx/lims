//src/features/solicitud/services/estudio.service.tsx
import { apiClient } from '../../../shared/services/apiClient'
import { Estudio } from '../interfaces/estudio.interface'

export const getEstudio = async (idEstudio: string): Promise<Estudio> => {
  const { data } = await apiClient.get<Estudio>(`/estudios/${idEstudio}`)
  return data
}
