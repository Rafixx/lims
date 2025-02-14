// src/hooks/useMuestras.ts
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export interface Muestra {
  id: number
  codigoInterno: string
  estado: string
}

const fetchMuestras = async (): Promise<Muestra[]> => {
  const { data } = await axios.get('http://localhost:3000/api/muestras')
  return data
}

export const useMuestras = () => {
  return useQuery<Muestra[]>({
    queryKey: ['muestras'],
    queryFn: fetchMuestras,
    refetchInterval: 5000 // Opcional: refetch cada 5 segundos
  })
}
