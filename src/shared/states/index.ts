/**
 * Punto de entrada centralizado para todo el sistema de estados
 * Exporta todas las funcionalidades relacionadas con el manejo de estados
 */

// Constantes y tipos principales
export { APP_STATES, ESTADOS_CONFIG, ESTADO_TRANSICIONES } from '../constants/appStates'
export type {
  AppEstado,
  SolicitudEstado,
  TecnicaEstado,
  MuestraEstado,
  UsuarioEstado,
  SistemaEstado,
  EstadoConfig
} from '../constants/appStates'

// Utilidades y helpers (exportación explícita para evitar conflictos)
export {
  getEstadoConfig,
  getEstadoLabel,
  getEstadoClasses,
  getEstadoBadgeClasses,
  esTransicionValida,
  getEstadosPermitidos,
  esEstadoFinal,
  getTransicionesConConfig,
  ordenarPorPrioridad,
  filtrarYOrdenarPorEstado,
  esEstadoValido,
  toAppEstado,
  contarPorEstado,
  getEstadisticasEstados,
  tieneMayorPrioridad,
  getEstadoPrioritario
} from '../utils/stateHelpers'

// Hooks
export * from '../hooks/useStateManager'

// Componentes
export {
  default as EstadoBadge,
  SolicitudBadge,
  TecnicaBadge,
  PriorityBadge
} from '../components/atoms/EstadoBadge'

// Re-exportaciones con nombres más amigables para el contexto español
export {
  APP_STATES as Estados,
  ESTADOS_CONFIG as ConfiguracionEstados,
  ESTADO_TRANSICIONES as TransicionesEstados
} from '../constants/appStates'

export {
  getEstadoConfig as obtenerConfigEstado,
  getEstadoLabel as obtenerLabelEstado,
  getEstadoBadgeClasses as obtenerClasesEstado,
  esTransicionValida as validarTransicion,
  getEstadosPermitidos as obtenerEstadosPermitidos
} from '../utils/stateHelpers'
