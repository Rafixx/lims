//src/features/solicitud/interfaces/solicitud.interface.tsx
import { Muestra } from '../../muestras/interfaces/muestra.interface'

export interface Solicitud {
  id: string
  fechaSolicitud: string
  solicitante: string
  estado: string
  muestras: Muestra[]
}

export enum EstadoSolicitud {
  PENDIENTE = 'Pendiente',
  EN_PROCESO = 'En Proceso',
  FINALIZADA = 'Finalizada'
}
