// ============================================
// WORKLIST FEATURE - PUBLIC API (NUEVA ARQUITECTURA)
// ============================================

// 📄 Pages (Páginas principales)
export { WorkListsPage } from './pages/WorkListsPage'
export { CreateWorklistPage } from './pages/CreateWorklistPage'
export { WorklistDetailPage } from './pages/WorklistDetailPage'

// 🎯 Hooks (Nueva lógica de negocio)
export * from './hooks/useWorklists'
export * from './hooks/useTecnicosLab'

// 🧩 Components (Componentes reutilizables - mantenidos)
export { TecnicaCard } from './components/TecnicaCard'
export { MuestraDetailCard } from './components/MuestraDetailCard'
export { WorklistStats } from './components/WorklistStats'
export { WorklistWithStates } from './components/WorklistWithStates'
export { WorklistCard } from './components/WorkListCard'

// 📋 Types (Nuevas interfaces y tipos)
export type {
  // Tipos principales
  Worklist,
  TecnicaWorklist,
  TecnicaSinAsignar,
  TecnicaSeleccionable,

  // Tipos de configuración
  DimTecnicasProc,
  WorklistEstadisticas,
  TecnicasAgrupadasWorklist,

  // Tipos de Request/Response
  CreateWorklistRequest,
  AsignarTecnicasRequest,
  RemoverTecnicasRequest,
  AsignarTecnicoRequest,
  ApiResponse,

  // Tipos de utilidad
  FiltrosTecnicas,
  TecnicoLab
} from './interfaces/worklist.types'

// 🔧 Services (Nuevo servicio)
export { worklistService } from './services/worklistService'

// =======================================
// LEGACY EXPORTS (Para compatibilidad)
// =======================================

// 🔄 Mantener compatibilidad temporal
// export { WorkListPage } from './pages/WorkListPage' // TODO: Página no existe
// export {
//   useTecnicasAgrupadasPorProceso,
//   useTecnicasPorProceso,
//   useWorklistStats
// } from './hooks/useWorklist'
// export { useWorklistWithStates } from './hooks/useWorklistNew'
