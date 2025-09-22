import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/shared/services/apiClient'

export interface Paciente {
  nombre: string
  sip: string
  direccion: string
}

export const usePaciente = (id?: number) =>
  useQuery<Paciente>({
    queryKey: ['paciente', id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/pacientes/${id}`)
      return data
    },
    enabled: !!id // evita ejecutar la query si no hay ID
  })
