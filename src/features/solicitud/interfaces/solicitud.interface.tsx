//src/features/solicitud/interfaces/solicitud.interface.tsx
export interface Solicitud {
  id: string
  fechaSolicitud: string
  solicitante: string
  estado: EstadoSolicitud
  // muestras: Muestra[];
}

export enum EstadoSolicitud {
  PENDIENTE = 'pendiente',
  EN_PROCESO = 'en_proceso',
  FINALIZADA = 'finalizada'
}
