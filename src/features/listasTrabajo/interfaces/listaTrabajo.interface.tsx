//src/features/listasTrabajo/interfaces/listaTrabajo.interface.tsx
import { Muestra } from '../../muestras/interfaces/muestra.interface'
import { Proceso } from '../../proceso/interfaces/proceso.interface'
import { Usuario } from '../../usuario/interfaces/usuario.interface'

export interface ListaTrabajo {
  id: string
  tipo: string
  proceso: Proceso
  muestras: Muestra[]
  fecha: string
  tecnico: Usuario
  estado: string
}
