// ============================================
// WORKLIST FEATURE - PUBLIC API
// ============================================

// 📄 Pages (Páginas principales)
export { WorkListPage } from './pages/WorkListPage'

// 🎯 Hooks (Lógica de negocio)
export * from './hooks/useWorklist'
export * from './hooks/useTecnicosLab'
// ✅ Nuevo hook con integración de estados centralizados
export { useWorklistWithStates } from './hooks/useWorklistNew'

// 🧩 Components (Componentes reutilizables)
export { TecnicaCard } from './components/TecnicaCard'
export { MuestraDetailCard } from './components/MuestraDetailCard'
export { WorklistStats } from './components/WorklistStats'
// ✅ Nuevo componente con estados centralizados
export { WorklistWithStates } from './components/WorklistWithStates'

// 📋 Types (Interfaces y tipos)
export type {
  // Tipos principales
  TecnicaPendiente,
  TecnicaAgrupada,
  TecnicaConProceso,
  TecnicaConMuestra,
  MuestraDetalle,

  // Tipos para estadísticas mejoradas
  EstadisticasWorklist,

  // Tipos de servicio
  AsignacionTecnico,
  ProcesoInfo
} from './interfaces/worklist.types'

// 🔧 Services (Servicios)
export { worklistService } from './services/worklistService'

// 📚 Integration Examples (Ejemplos de integración)
// export { MuestraCard, useWorkListStates } from './integration/estadosCentralizados.example'
