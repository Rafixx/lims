//src/features/solicitud/hooks/useSolicitud.tsx
import { useQuery } from '@tanstack/react-query'
import { getSolicitud } from '../services/solicitud.service'

export const useSolicitud = (idSolicitud: number) => {
  const solicitudQuery = useQuery({
    queryKey: ['solicitud', idSolicitud],
    queryFn: () => getSolicitud(idSolicitud)
  })

  return solicitudQuery
}
