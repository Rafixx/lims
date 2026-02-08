import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query'
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
  Reactivo,
  PlantillaPasos
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
  tecnicasProcByPrueba: (id: number, activa: boolean) =>
    [...dimTablesQueryKeys.prueba(id), 'tecnicas-proc', activa] as const,
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
  reactivo: (id: number) => [...dimTablesQueryKeys.reactivos(), id] as const,
  plantillasPasos: () => [...dimTablesQueryKeys.all, 'plantillas-pasos'] as const,
  plantillaPaso: (id: number) => [...dimTablesQueryKeys.plantillasPasos(), id] as const
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

// Mutaciones para centros
export const useCreateCentro = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Omit<Centro, 'id'>) => dimTablesService.createCentro(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dimTablesQueryKeys.centros() })
    }
  })
}

export const useUpdateCentro = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Omit<Centro, 'id'>> }) =>
      dimTablesService.updateCentro(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: dimTablesQueryKeys.centro(id) })
      queryClient.invalidateQueries({ queryKey: dimTablesQueryKeys.centros() })
    }
  })
}

export const useDeleteCentro = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => dimTablesService.deleteCentro(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: dimTablesQueryKeys.centros() })
      queryClient.invalidateQueries({ queryKey: dimTablesQueryKeys.centro(id) })
    }
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

// Mutaciones para clientes
export const useCreateCliente = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Omit<Cliente, 'id'>) => dimTablesService.createCliente(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dimTablesQueryKeys.clientes() })
    }
  })
}

export const useUpdateCliente = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Omit<Cliente, 'id'>> }) =>
      dimTablesService.updateCliente(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: dimTablesQueryKeys.cliente(id) })
      queryClient.invalidateQueries({ queryKey: dimTablesQueryKeys.clientes() })
    }
  })
}

export const useDeleteCliente = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => dimTablesService.deleteCliente(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: dimTablesQueryKeys.clientes() })
      queryClient.invalidateQueries({ queryKey: dimTablesQueryKeys.cliente(id) })
    }
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

// Mutaciones para criterios de validación
export const useCreateCriterioValidacion = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Omit<CriterioValidacion, 'id'>) =>
      dimTablesService.createCriterioValidacion(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dimTablesQueryKeys.criteriosValidacion() })
    }
  })
}

export const useUpdateCriterioValidacion = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Omit<CriterioValidacion, 'id'>> }) =>
      dimTablesService.updateCriterioValidacion(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: dimTablesQueryKeys.criterioValidacion(id) })
      queryClient.invalidateQueries({ queryKey: dimTablesQueryKeys.criteriosValidacion() })
    }
  })
}

export const useDeleteCriterioValidacion = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => dimTablesService.deleteCriterioValidacion(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: dimTablesQueryKeys.criteriosValidacion() })
      queryClient.invalidateQueries({ queryKey: dimTablesQueryKeys.criterioValidacion(id) })
    }
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

// Mutaciones para pacientes
export const useCreatePaciente = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Omit<Paciente, 'id'>) => dimTablesService.createPaciente(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dimTablesQueryKeys.pacientes() })
    }
  })
}

export const useUpdatePaciente = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Omit<Paciente, 'id'>> }) =>
      dimTablesService.updatePaciente(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: dimTablesQueryKeys.paciente(id) })
      queryClient.invalidateQueries({ queryKey: dimTablesQueryKeys.pacientes() })
    }
  })
}

export const useDeletePaciente = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => dimTablesService.deletePaciente(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: dimTablesQueryKeys.pacientes() })
      queryClient.invalidateQueries({ queryKey: dimTablesQueryKeys.paciente(id) })
    }
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

// Mutaciones para pruebas
export const useCreatePrueba = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Omit<Prueba, 'id'>) => dimTablesService.createPrueba(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dimTablesQueryKeys.pruebas() })
    }
  })
}

export const useUpdatePrueba = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Omit<Prueba, 'id'>> }) =>
      dimTablesService.updatePrueba(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: dimTablesQueryKeys.prueba(id) })
      queryClient.invalidateQueries({ queryKey: dimTablesQueryKeys.pruebas() })
    }
  })
}

export const useDeletePrueba = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => dimTablesService.deletePrueba(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: dimTablesQueryKeys.pruebas() })
      queryClient.invalidateQueries({ queryKey: dimTablesQueryKeys.prueba(id) })
    }
  })
}

export const useTecnicasProcByPrueba = (
  id: number,
  activa = true,
  options?: Omit<UseQueryOptions<TecnicaProc[]>, 'queryKey' | 'queryFn' | 'enabled'>
) => {
  return useQuery<TecnicaProc[], Error>({
    queryKey: dimTablesQueryKeys.tecnicasProcByPrueba(id, activa),
    queryFn: () => dimTablesService.getTecnicasProcByPrueba(id, activa),
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

// Mutaciones para técnicas proc
export const useCreateTecnicaProc = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Omit<TecnicaProc, 'id'>) => dimTablesService.createTecnicaProc(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dimTablesQueryKeys.tecnicasProc() })
    }
  })
}

export const useUpdateTecnicaProc = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Omit<TecnicaProc, 'id'>> }) =>
      dimTablesService.updateTecnicaProc(id, data),
    onSuccess: (updated, { id }) => {
      queryClient.invalidateQueries({ queryKey: dimTablesQueryKeys.tecnicaProc(id) })
      queryClient.invalidateQueries({ queryKey: dimTablesQueryKeys.tecnicasProc() })
      if (updated?.id_prueba) {
        queryClient.invalidateQueries({
          queryKey: dimTablesQueryKeys.prueba(updated.id_prueba)
        })
      }
    }
  })
}

export const useBatchUpdateTecnicasProcOrden = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (items: { id: number; orden: number }[]) =>
      dimTablesService.batchUpdateTecnicasProcOrden(items),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dimTablesQueryKeys.tecnicasProc() })
    }
  })
}

export const useDeleteTecnicaProc = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => dimTablesService.deleteTecnicaProc(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: dimTablesQueryKeys.tecnicasProc() })
      queryClient.invalidateQueries({ queryKey: dimTablesQueryKeys.tecnicaProc(id) })
    }
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

// Mutaciones para tipos de muestra
export const useCreateTipoMuestra = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Omit<TipoMuestra, 'id'>) => dimTablesService.createTipoMuestra(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dimTablesQueryKeys.tiposMuestra() })
    }
  })
}

export const useUpdateTipoMuestra = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Omit<TipoMuestra, 'id'>> }) =>
      dimTablesService.updateTipoMuestra(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: dimTablesQueryKeys.tipoMuestra(id) })
      queryClient.invalidateQueries({ queryKey: dimTablesQueryKeys.tiposMuestra() })
    }
  })
}

export const useDeleteTipoMuestra = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => dimTablesService.deleteTipoMuestra(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: dimTablesQueryKeys.tiposMuestra() })
      queryClient.invalidateQueries({ queryKey: dimTablesQueryKeys.tipoMuestra(id) })
    }
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

// Mutaciones para ubicaciones
export const useCreateUbicacion = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Omit<Ubicacion, 'id'>) => dimTablesService.createUbicacion(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dimTablesQueryKeys.ubicaciones() })
    }
  })
}

export const useUpdateUbicacion = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Omit<Ubicacion, 'id'>> }) =>
      dimTablesService.updateUbicacion(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: dimTablesQueryKeys.ubicacion(id) })
      queryClient.invalidateQueries({ queryKey: dimTablesQueryKeys.ubicaciones() })
    }
  })
}

export const useDeleteUbicacion = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => dimTablesService.deleteUbicacion(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: dimTablesQueryKeys.ubicaciones() })
      queryClient.invalidateQueries({ queryKey: dimTablesQueryKeys.ubicacion(id) })
    }
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

// Mutaciones para máquinas
export const useCreateMaquina = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Omit<Maquina, 'id'>) => dimTablesService.createMaquina(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dimTablesQueryKeys.maquinas() })
    }
  })
}

export const useUpdateMaquina = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Omit<Maquina, 'id'>> }) =>
      dimTablesService.updateMaquina(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: dimTablesQueryKeys.maquina(id) })
      queryClient.invalidateQueries({ queryKey: dimTablesQueryKeys.maquinas() })
    }
  })
}

export const useDeleteMaquina = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => dimTablesService.deleteMaquina(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: dimTablesQueryKeys.maquinas() })
      queryClient.invalidateQueries({ queryKey: dimTablesQueryKeys.maquina(id) })
    }
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

// Mutaciones para pipetas
export const useCreatePipeta = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Omit<Pipeta, 'id'>) => dimTablesService.createPipeta(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dimTablesQueryKeys.pipetas() })
    }
  })
}

export const useUpdatePipeta = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Omit<Pipeta, 'id'>> }) =>
      dimTablesService.updatePipeta(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: dimTablesQueryKeys.pipeta(id) })
      queryClient.invalidateQueries({ queryKey: dimTablesQueryKeys.pipetas() })
    }
  })
}

export const useDeletePipeta = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => dimTablesService.deletePipeta(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: dimTablesQueryKeys.pipetas() })
      queryClient.invalidateQueries({ queryKey: dimTablesQueryKeys.pipeta(id) })
    }
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

// Mutaciones para reactivos
export const useCreateReactivo = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Omit<Reactivo, 'id'>) => dimTablesService.createReactivo(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dimTablesQueryKeys.reactivos() })
    }
  })
}

export const useUpdateReactivo = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Omit<Reactivo, 'id'>> }) =>
      dimTablesService.updateReactivo(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: dimTablesQueryKeys.reactivo(id) })
      queryClient.invalidateQueries({ queryKey: dimTablesQueryKeys.reactivos() })
    }
  })
}

export const useDeleteReactivo = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => dimTablesService.deleteReactivo(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: dimTablesQueryKeys.reactivos() })
      queryClient.invalidateQueries({ queryKey: dimTablesQueryKeys.reactivo(id) })
    }
  })
}

// ================================
// HOOKS PARA PLANTILLAS_PASOS
// ================================

export const usePlantillaPasos = () => {
  return useQuery({
    queryKey: ['dim-tables', 'plantillas-pasos'],
    queryFn: () => dimTablesService.getPlantillasPasos(),
    staleTime: STALE_TIME,
    gcTime: GC_TIME
  })
}

export const usePlantillaPaso = (id: number) => {
  return useQuery({
    queryKey: ['dim-tables', 'plantillas-pasos', id],
    queryFn: () => dimTablesService.getPlantillaPaso(id),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    enabled: !!id && id > 0
  })
}

export const useCreatePlantillaPaso = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Omit<PlantillaPasos, 'id'>) => dimTablesService.createPlantillaPaso(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dim-tables', 'plantillas-pasos'] })
    }
  })
}

export const useUpdatePlantillaPaso = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Omit<PlantillaPasos, 'id'>> }) =>
      dimTablesService.updatePlantillaPaso(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['dim-tables', 'plantillas-pasos', id] })
      queryClient.invalidateQueries({ queryKey: ['dim-tables', 'plantillas-pasos'] })
    }
  })
}

export const useDeletePlantillaPaso = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => dimTablesService.deletePlantillaPaso(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['dim-tables', 'plantillas-pasos'] })
      queryClient.invalidateQueries({ queryKey: ['dim-tables', 'plantillas-pasos', id] })
    }
  })
}
