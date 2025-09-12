// ============================================
// SOLICITUDES FEATURE - PUBLIC API
// ============================================

// 📄 Pages (Páginas principales)
export { SolicitudesSimplePage } from './pages/SolicitudesSimplePage'
export { SolicitudFormPage } from './pages/SolicitudesFormPage'

// 🎯 Hooks (Lógica de negocio)
export {
  useSolicitudes,
  useSolicitud,
  useCreateSolicitud,
  useUpdateSolicitud,
  useDeleteSolicitud
} from './hooks/useSolicitudes'

// 🧩 Components (Componentes reutilizables)
export { SolicitudCard } from './components/SolicitudCard'
export { SolicitudesStats } from './components/SolicitudesStats'
export { SolicitudForm } from './components/solicitudForm/SolicitudForm'

// 📋 Types (Interfaces y tipos)
export type {
  // Tipos principales
  Solicitud,
  SolicitudAPIResponse,
  Muestra,

  // Tipos para API
  CreateSolicitudRequest,
  UpdateSolicitudRequest,

  // Tipos para hooks
  UseSolicitudesReturn,

  // Entidades relacionadas
  Cliente,
  Paciente,
  Prueba,
  Tecnica,
  TipoMuestra
} from './interfaces/solicitudes.types'

// 🎲 Constants & Defaults (Constantes y valores por defecto)
export { DEFAULT_MUESTRA, EMPTY_SOLICITUD_FORM } from './interfaces/defaults'

// 🔧 Services (Servicios - solo si necesitas acceso directo)
// Nota: Generalmente no se exportan, se usan a través de hooks
// export { solicitudesService } from './api/solicitudesService'
