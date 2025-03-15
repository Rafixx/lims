//src/features/solicitud/hooks/useMuestra.tsx
import { useQuery } from '@tanstack/react-query'
import { getMuestra } from '../services/muestra.service'

export const useMuestra = (idSolicitud: string) => {
  const muestraQuery = useQuery({
    queryKey: ['muestra', idSolicitud],
    queryFn: () => getMuestra(idSolicitud),
    staleTime: 1000 * 60 // 1 minuto
  })

  return muestraQuery
}
