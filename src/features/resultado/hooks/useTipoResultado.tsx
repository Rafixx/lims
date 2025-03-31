//src/features/resultado/hooks/useTipoResultado.tsx
import { useQuery } from '@tanstack/react-query'
import { getTipoResultado } from '../services/resultado.service'

export const useTipoResultado = (idResultado: number) => {
  const tipoResultadoQuery = useQuery({
    queryKey: ['tipoResultado', idResultado],
    queryFn: () => getTipoResultado(idResultado)
  })

  return tipoResultadoQuery
}
