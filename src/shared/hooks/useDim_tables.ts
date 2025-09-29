import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { dimTablesService } from '../services/dim_tables.services'
import type {
  Centro,
  Cliente,
  CriterioValidacion,
  Paciente,
  Prueba,
  TecnicaProc,
  TipoMuestra,
  Ubicacion,
  TecnicoLaboratorio,
  Maquina,
  Pipeta,
  Reactivo
} from '../interfaces/dim_tables.types'
import { STALE_TIME, GC_TIME } from '@/shared/constants/constants'

// Query keys centralizadas para mantener consistencia
export const dimTablesQueryKeys = {
  all: ['dim-tables'] as const,
  centros: () => [...dimTablesQueryKeys.all, 'centros'] as const,
  centro: (id: number) => [...dimTablesQueryKeys.centros(), id] as const,
  clientes: () => [...dimTablesQueryKeys.all, 'clientes'] as const,
  cliente: (id: number) => [...dimTablesQueryKeys.clientes(), id] as const,
  criteriosValidacion: () => [...dimTablesQueryKeys.all, 'criterios-validacion'] as const,
  criterioValidacion: (id: number) => [...dimTablesQueryKeys.criteriosValidacion(), id] as const,
  pacientes: () => [...dimTablesQueryKeys.all, 'pacientes'] as const,
  paciente: (id: number) => [...dimTablesQueryKeys.pacientes(), id] as const,
  pruebas: () => [...dimTablesQueryKeys.all, 'pruebas'] as const,
  prueba: (id: number) => [...dimTablesQueryKeys.pruebas(), id] as const,
  tecnicasProc: () => [...dimTablesQueryKeys.all, 'tecnicas-proc'] as const,
  tecnicaProc: (id: number) => [...dimTablesQueryKeys.tecnicasProc(), id] as const,
  tiposMuestra: () => [...dimTablesQueryKeys.all, 'tipos-muestra'] as const,
  tipoMuestra: (id: number) => [...dimTablesQueryKeys.tiposMuestra(), id] as const,
  ubicaciones: () => [...dimTablesQueryKeys.all, 'ubicaciones'] as const,
  ubicacion: (id: number) => [...dimTablesQueryKeys.ubicaciones(), id] as const,
  tecnicosLaboratorio: () => [...dimTablesQueryKeys.all, 'tecnicos-laboratorio'] as const,
  tecnicoLaboratorio: (id: number) => [...dimTablesQueryKeys.tecnicosLaboratorio(), id] as const,
  maquinas: () => [...dimTablesQueryKeys.all, 'maquinas'] as const,
  maquina: (id: number) => [...dimTablesQueryKeys.maquinas(), id] as const,
  pipetas: () => [...dimTablesQueryKeys.all, 'pipetas'] as const,
  pipeta: (id: number) => [...dimTablesQueryKeys.pipetas(), id] as const,
  reactivos: () => [...dimTablesQueryKeys.all, 'reactivos'] as const,
  reactivo: (id: number) => [...dimTablesQueryKeys.reactivos(), id] as const
}

// ================================
// HOOKS PARA CENTROS
// ================================

export const useCentros = (options?: Omit<UseQueryOptions<Centro[]>, 'queryKey' | 'queryFn'>) => {
  return useQuery<Centro[], Error>({
    queryKey: dimTablesQueryKeys.centros(),
    queryFn: () => dimTablesService.getCentros(),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    ...options
  })
}

export const useCentro = (
  id: number,
  options?: Omit<UseQueryOptions<Centro>, 'queryKey' | 'queryFn' | 'enabled'>
) => {
  return useQuery<Centro, Error>({
    queryKey: dimTablesQueryKeys.centro(id),
    queryFn: () => dimTablesService.getCentro(id),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    enabled: !!id && id > 0,
    ...options
  })
}

// ================================
// HOOKS PARA CLIENTES
// ================================

export const useClientes = (options?: Omit<UseQueryOptions<Cliente[]>, 'queryKey' | 'queryFn'>) => {
  return useQuery<Cliente[], Error>({
    queryKey: dimTablesQueryKeys.clientes(),
    queryFn: () => dimTablesService.getClientes(),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    ...options
  })
}

export const useCliente = (
  id?: number,
  options?: Omit<UseQueryOptions<Cliente>, 'queryKey' | 'queryFn' | 'enabled'>
) => {
  return useQuery<Cliente, Error>({
    queryKey: dimTablesQueryKeys.cliente(id || 0),
    queryFn: () => dimTablesService.getCliente(id!),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    enabled: !!id && id > 0,
    ...options
  })
}

// ================================
// HOOKS PARA CRITERIOS VALIDACIÓN
// ================================

export const useCriteriosValidacion = (
  options?: Omit<UseQueryOptions<CriterioValidacion[]>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<CriterioValidacion[], Error>({
    queryKey: dimTablesQueryKeys.criteriosValidacion(),
    queryFn: () => dimTablesService.getCriteriosValidacion(),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    ...options
  })
}

export const useCriterioValidacion = (
  id: number,
  options?: Omit<UseQueryOptions<CriterioValidacion>, 'queryKey' | 'queryFn' | 'enabled'>
) => {
  return useQuery<CriterioValidacion, Error>({
    queryKey: dimTablesQueryKeys.criterioValidacion(id),
    queryFn: () => dimTablesService.getCriterioValidacion(id),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    enabled: !!id && id > 0,
    ...options
  })
}

// ================================
// HOOKS PARA PACIENTES
// ================================

export const usePacientes = (
  options?: Omit<UseQueryOptions<Paciente[]>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<Paciente[], Error>({
    queryKey: dimTablesQueryKeys.pacientes(),
    queryFn: () => dimTablesService.getPacientes(),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    ...options
  })
}

export const usePaciente = (
  id?: number,
  options?: Omit<UseQueryOptions<Paciente>, 'queryKey' | 'queryFn' | 'enabled'>
) => {
  return useQuery<Paciente, Error>({
    queryKey: dimTablesQueryKeys.paciente(id || 0),
    queryFn: () => dimTablesService.getPaciente(id!),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    enabled: !!id && id > 0,
    ...options
  })
}

// ================================
// HOOKS PARA PRUEBAS
// ================================

export const usePruebas = (options?: Omit<UseQueryOptions<Prueba[]>, 'queryKey' | 'queryFn'>) => {
  return useQuery<Prueba[], Error>({
    queryKey: dimTablesQueryKeys.pruebas(),
    queryFn: () => dimTablesService.getPruebas(),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    ...options
  })
}

export const usePrueba = (
  id: number,
  options?: Omit<UseQueryOptions<Prueba>, 'queryKey' | 'queryFn' | 'enabled'>
) => {
  return useQuery<Prueba, Error>({
    queryKey: dimTablesQueryKeys.prueba(id),
    queryFn: () => dimTablesService.getPrueba(id),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    enabled: !!id && id > 0,
    ...options
  })
}

export const useTecnicasProcByPrueba = (
  id: number,
  options?: Omit<UseQueryOptions<TecnicaProc[]>, 'queryKey' | 'queryFn' | 'enabled'>
) => {
  return useQuery<TecnicaProc[], Error>({
    queryKey: [...dimTablesQueryKeys.prueba(id), 'tecnicas-proc'],
    queryFn: () => dimTablesService.getTecnicasProcByPrueba(id),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    enabled: !!id && id > 0,
    ...options
  })
}

// ================================
// HOOKS PARA TÉCNICAS PROC
// ================================

export const useTecnicasProc = (
  options?: Omit<UseQueryOptions<TecnicaProc[]>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<TecnicaProc[], Error>({
    queryKey: dimTablesQueryKeys.tecnicasProc(),
    queryFn: () => dimTablesService.getTecnicasProc(),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    ...options
  })
}

export const useTecnicaProc = (
  id: number,
  options?: Omit<UseQueryOptions<TecnicaProc>, 'queryKey' | 'queryFn' | 'enabled'>
) => {
  return useQuery<TecnicaProc, Error>({
    queryKey: dimTablesQueryKeys.tecnicaProc(id),
    queryFn: () => dimTablesService.getTecnicaProc(id),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    enabled: !!id && id > 0,
    ...options
  })
}

// ================================
// HOOKS PARA TIPOS MUESTRA
// ================================

export const useTiposMuestra = (
  options?: Omit<UseQueryOptions<TipoMuestra[]>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<TipoMuestra[], Error>({
    queryKey: dimTablesQueryKeys.tiposMuestra(),
    queryFn: () => dimTablesService.getTiposMuestra(),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    ...options
  })
}

export const useTipoMuestra = (
  id: number,
  options?: Omit<UseQueryOptions<TipoMuestra>, 'queryKey' | 'queryFn' | 'enabled'>
) => {
  return useQuery<TipoMuestra, Error>({
    queryKey: dimTablesQueryKeys.tipoMuestra(id),
    queryFn: () => dimTablesService.getTipoMuestra(id),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    enabled: !!id && id > 0,
    ...options
  })
}

// ================================
// HOOKS PARA UBICACIONES
// ================================

export const useUbicaciones = (
  options?: Omit<UseQueryOptions<Ubicacion[]>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<Ubicacion[], Error>({
    queryKey: dimTablesQueryKeys.ubicaciones(),
    queryFn: () => dimTablesService.getUbicaciones(),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    ...options
  })
}

export const useUbicacion = (
  id: number,
  options?: Omit<UseQueryOptions<Ubicacion>, 'queryKey' | 'queryFn' | 'enabled'>
) => {
  return useQuery<Ubicacion, Error>({
    queryKey: dimTablesQueryKeys.ubicacion(id),
    queryFn: () => dimTablesService.getUbicacion(id),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    enabled: !!id && id > 0,
    ...options
  })
}

// ================================
// HOOKS PARA TÉCNICOS
// ================================

export const useTecnicosLaboratorio = (
  options?: Omit<UseQueryOptions<TecnicoLaboratorio[]>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<TecnicoLaboratorio[], Error>({
    queryKey: dimTablesQueryKeys.tecnicosLaboratorio(),
    queryFn: () => dimTablesService.getTecnicosLaboratorio(),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    ...options
  })
}

export const useTecnicoLaboratorio = (
  id: number,
  options?: Omit<UseQueryOptions<TecnicoLaboratorio>, 'queryKey' | 'queryFn' | 'enabled'>
) => {
  return useQuery<TecnicoLaboratorio, Error>({
    queryKey: dimTablesQueryKeys.tecnicoLaboratorio(id),
    queryFn: () => dimTablesService.getTecnicoLaboratorio(id),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    enabled: !!id && id > 0,
    ...options
  })
}

// ================================
// HOOKS PARA MÁQUINAS
// ================================

export const useMaquinas = (options?: Omit<UseQueryOptions<Maquina[]>, 'queryKey' | 'queryFn'>) => {
  return useQuery<Maquina[], Error>({
    queryKey: dimTablesQueryKeys.maquinas(),
    queryFn: () => dimTablesService.getMaquinas(),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    ...options
  })
}

export const useMaquina = (
  id: number,
  options?: Omit<UseQueryOptions<Maquina>, 'queryKey' | 'queryFn' | 'enabled'>
) => {
  return useQuery<Maquina, Error>({
    queryKey: dimTablesQueryKeys.maquina(id),
    queryFn: () => dimTablesService.getMaquina(id),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    enabled: !!id && id > 0,
    ...options
  })
}

// ================================
// HOOKS PARA PIPETAS
// ================================

export const usePipetas = (options?: Omit<UseQueryOptions<Pipeta[]>, 'queryKey' | 'queryFn'>) => {
  return useQuery<Pipeta[], Error>({
    queryKey: dimTablesQueryKeys.pipetas(),
    queryFn: () => dimTablesService.getPipetas(),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    ...options
  })
}

export const usePipeta = (
  id: number,
  options?: Omit<UseQueryOptions<Pipeta>, 'queryKey' | 'queryFn' | 'enabled'>
) => {
  return useQuery<Pipeta, Error>({
    queryKey: dimTablesQueryKeys.pipeta(id),
    queryFn: () => dimTablesService.getPipeta(id),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    enabled: !!id && id > 0,
    ...options
  })
}

// ================================
// HOOKS PARA REACTIVOS
// ================================

export const useReactivos = (
  options?: Omit<UseQueryOptions<Reactivo[]>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<Reactivo[], Error>({
    queryKey: dimTablesQueryKeys.reactivos(),
    queryFn: () => dimTablesService.getReactivos(),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    ...options
  })
}

export const useReactivo = (
  id: number,
  options?: Omit<UseQueryOptions<Reactivo>, 'queryKey' | 'queryFn' | 'enabled'>
) => {
  return useQuery<Reactivo, Error>({
    queryKey: dimTablesQueryKeys.reactivo(id),
    queryFn: () => dimTablesService.getReactivo(id),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    enabled: !!id && id > 0,
    ...options
  })
}
