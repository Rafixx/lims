//src/features/estudio/hooks/useEstudios.tsx
import { useQuery } from '@tanstack/react-query'
import { getEstudios } from '../services/estudios.service'

export const useEstudios = () => {
  const estudiosQuery = useQuery({
    queryKey: ['estudios'],
    queryFn: getEstudios,
    staleTime: 1000 * 60 // 1 minuto
  })

  return estudiosQuery
}
