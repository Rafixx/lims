//src/features/proceso/hooks/useProcesos.tsx
import { useQuery } from '@tanstack/react-query'
import { getProcesos } from '../services/procesos.services'

export const useProcesos = () => {
  const procesoQuery = useQuery({
    queryKey: ['proceso'],
    queryFn: () => getProcesos()
  })

  return procesoQuery
}
