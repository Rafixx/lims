//src/features/proceso/interfaces/proceso.interface.tsx
import { Resultado } from '../../resultado/interfaces/resultado.interface'

export interface Proceso {
  procesoId: string
  nombre: string
  estado: string
  resultados: Resultado[]
}
