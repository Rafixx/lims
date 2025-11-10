/** Entidad base para dim_pacientes */
export interface Paciente {
  id: number
  nombre: string
  sip?: string
  direccion?: string
}

/** Entidad base para dim_clientes */
export interface Cliente {
  id: number
  nombre: string
  razon_social?: string
  nif?: string
  direccion?: string
}

/** Entidad base para dim_centros */
export interface Centro {
  id: number
  codigo: string
  descripcion?: string
}

/** Entidad base para dim_tecnicos_responsables */
export interface TecnicoLaboratorio {
  id_usuario: number
  nombre?: string
}

/** Entidad base para dim_tipo_muestra */
export interface TipoMuestra {
  id: number
  cod_tipo_muestra: string
  tipo_muestra?: string
}

/** Entidad base para dim_criterios_validacion */
export interface CriterioValidacion {
  id: number
  codigo: string
  descripcion: string
}

/** Entidad base para dim_ubicacion */
export interface Ubicacion {
  id: number
  codigo: string
  ubicacion?: string
}

/** Entidad base para dim_pruebas */
export interface Prueba {
  id: number
  cod_prueba: string
  prueba?: string
}

/** Entidad base para dim_tecnicas_proc */
export interface TecnicaProc {
  id: number
  tecnica_proc: string
  orden?: number
  plantillaTecnica?: PlantillaTecnica
}

/** Entidad base para dim_maquinas */
export interface Maquina {
  id: number
  codigo: string
  maquina?: string
  perfil_termico?: string
}

/** Entidad base para dim_pipetas */
export interface Pipeta {
  id: number
  codigo: string
  modelo?: string
  zona?: string
}

/** Entidad base para dim_reactivos */
export interface Reactivo {
  id: number
  num_referencia?: string
  reactivo?: string
  lote?: string
  volumen_formula?: string
}

/** Entidad base para dim_plantillas_tecnicas */
export interface PlantillaTecnica {
  id: number
  cod_plantilla_tecnica: string
  tecnica: string
}

export interface PlantillaPasos {
  id: number
  codigo?: string
  descripcion?: string
  orden?: number
}
