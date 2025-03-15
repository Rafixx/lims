//src/features/solicitud/interfaces/muestra.interface.tsx
import { Estudio } from '../../estudio/interfaces/estudio.interface'

export interface Muestra {
  id: string
  idSolicitud: string
  identificacionExterna: string
  codigoInterno: string
  fechaIngreso: string
  estado: string
  ubicacion: string
  estudios: Estudio[]
}
