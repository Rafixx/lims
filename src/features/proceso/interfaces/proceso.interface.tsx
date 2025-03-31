//src/features/proceso/interfaces/proceso.interface.tsx
import { TipoResultado } from '../../resultado/interfaces/tipoResultado.interface'

export interface Proceso {
  procesoId: string
  nombre: string
  estado: string
  resultados: TipoResultado[]
}
