//src/features/proceso/interfaces/proceso.interface.tsx
import { TipoResultado } from '../../resultado/interfaces/tipoResultado.interface'
import { Pipeta } from '../../catalogo/pipeta/interfaces/pipeta.interface'
import { Reactivo } from '../../catalogo/reactivo/interfaces/reactivo.interface'

export interface Proceso {
  procesoId: string
  nombre: string
  estado: string
  resultados: TipoResultado[]
  pipetas?: Pipeta[]
  reactivos?: Reactivo[]
}
