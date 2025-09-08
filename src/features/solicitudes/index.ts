// src/features/solicitudes/index.ts

// Componentes principales
export { SolicitudesPage } from './pages/SolicitudesPage'
export { SolicitudCard } from './components/SolicitudCard'
export { SolicitudForm } from './components/solicitudForm/SolicitudForm'

// Hooks principales
export {
  useSolicitudes,
  useSolicitudById,
  useCreateSolicitud,
  useUpdateSolicitud,
  useDeleteSolicitud
} from './hooks/useSolicitudes'

// Hooks de datos auxiliares
export { useClientes } from './hooks/useClientes'
export { usePacientes } from './hooks/usePacientes'
export { usePruebas } from './hooks/usePruebas'

// Servicios
export * from './services/solicitudService'

// Interfaces y tipos
export type { SolicitudAPIResponse } from './interfaces/api.types'
export type { CreateSolicitudDTO } from './interfaces/dto.types'
export type { SolicitudFormValues } from './interfaces/form.types'
