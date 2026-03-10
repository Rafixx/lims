export type RegistroMasivoRequest = {
  estudio: string
  id_prueba: number
  id_tipo_muestra: number
  total_muestras: number
  plate_config: {
    width: number
    heightLetter: string
    code_prefix: string
  }
  id_cliente?: number
  id_paciente?: number
  id_centro?: number
  id_tecnico_resp?: number
  id_criterio_validacion?: number
  condiciones_envio?: string
  tiempo_hielo?: string
  observaciones?: string
}

export type RegistroMasivoResult = {
  placas_creadas: number
  total_posiciones: number
  total_muestras: number
  posiciones_vacias: number
  codigos_placa: string[]
  codigos_epi_rango: { primero: string; ultimo: string }
  mensaje: string
}

export type RegistroMasivoFormData = {
  estudio: string
  id_prueba: number | null
  id_tipo_muestra: number | null
  total_muestras: number | ''
  plate_width: number
  plate_heightLetter: string
  code_prefix: string
  id_cliente: number | null
  id_paciente: number | null
  id_centro: number | null
  id_tecnico_resp: number | null
  id_criterio_validacion: number | null
  condiciones_envio: string
  tiempo_hielo: string
  observaciones: string
}
