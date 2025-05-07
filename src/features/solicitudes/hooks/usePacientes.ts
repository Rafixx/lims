import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/shared/services/apiClient'

interface Paciente {
  id: number
  nombre: string
}

export const usePacientes = () =>
  useQuery<Paciente[]>({
    queryKey: ['pacientes'],
    queryFn: async () => {
      const { data } = await apiClient.get('/pacientes')
      return data
    }
  })
