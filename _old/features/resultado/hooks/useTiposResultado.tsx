//src/features/resultado/hooks/useTiposResultado.tsx
import { useQuery } from '@tanstack/react-query'
import { getTiposResultado } from '../services/resultados.service '

export const useTiposResultado = () => {
  const tiposResultadoQuery = useQuery({
    queryKey: ['tiposResultado'],
    queryFn: () => getTiposResultado()
  })

  return tiposResultadoQuery
}
