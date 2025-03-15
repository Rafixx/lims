//src/features/solicitud/hooks/useSolicitudes.tsx
import { useQuery } from '@tanstack/react-query'
import { getSolicitudes } from '../services/solicitudes.service'

export const useSolicitudes = () => {
  const solicitudesQuery = useQuery({
    queryKey: ['solicitudes'],
    queryFn: () => getSolicitudes(),
    staleTime: 1000 * 60
  })

  return solicitudesQuery
}
