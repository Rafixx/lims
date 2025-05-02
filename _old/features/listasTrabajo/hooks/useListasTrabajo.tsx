//src/features/listasTrabajo/hooks/useListasTrabajo.tsx
import { useQuery } from '@tanstack/react-query'
import { getListasTrabajo } from '../services/listasTrabajo.service'

export const useListasTrabajo = () => {
  const listasTrabajoQuery = useQuery({
    queryKey: ['listasTrabajo'],
    queryFn: () => getListasTrabajo()
  })

  return listasTrabajoQuery
}
