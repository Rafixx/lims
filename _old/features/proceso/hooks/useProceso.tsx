//src/features/proceso/hooks/useProceso.tsx
import { useQuery } from '@tanstack/react-query'
import { getProceso } from '../services/proceso.services'

export const useProceso = (idProceso: number) => {
  const procesoQuery = useQuery({
    queryKey: ['proceso', idProceso],
    queryFn: () => getProceso(idProceso)
  })

  return procesoQuery
}
