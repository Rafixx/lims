//src/features/listasTrabajo/hooks/useListaTrabajo.tsx
import { useQuery } from '@tanstack/react-query'
import { getListaTrabajo } from '../services/listaTrabajo.service'

export const useListaTrabajo = (id: number) => {
  const listaTrabajoQuery = useQuery({
    queryKey: ['listaTrabajo', id],
    queryFn: () => getListaTrabajo(id)
  })

  return listaTrabajoQuery
}
