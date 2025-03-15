//src/features/estudio/interfaces/estudio.interface.tsx
import { Proceso } from '../../proceso/interfaces/proceso.interface'

export interface Estudio {
  estudioId: string
  nombre: string
  estado: string
  procesos: Proceso[]
}
