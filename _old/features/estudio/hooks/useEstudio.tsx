//src/features/estudio/hooks/useEstudio.tsx
import { useQuery } from '@tanstack/react-query'
import { getEstudio } from '../services/estudio.service'

export const useEstudio = (idEstudio: string) => {
  const estudioQuery = useQuery({
    queryKey: ['estudio', idEstudio],
    queryFn: () => getEstudio(idEstudio)
  })

  return estudioQuery
}
