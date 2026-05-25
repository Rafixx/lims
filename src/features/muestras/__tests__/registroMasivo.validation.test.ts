import { RegistroMasivoFormData, RegistroMasivoRequest } from '../interfaces/registroMasivo.types'

// Replica del estado inicial del wizard para verificar valores por defecto
const buildInitialForm = (): RegistroMasivoFormData => ({
  estudio: '',
  id_prueba: null,
  id_tipo_muestra: null,
  total_muestras: '',
  plate_width: 12,
  plate_heightLetter: 'H',
  code_prefix: '',
  f_recepcion: new Date().toISOString().slice(0, 16),
  id_cliente: null,
  id_paciente: null,
  id_centro: null,
  id_tecnico_resp: null,
  id_criterio_validacion: null,
  condiciones_envio: '',
  tiempo_hielo: '',
  observaciones: ''
})

// Helper que replica la lógica del wizard al construir el payload
const buildPayload = (
  formData: RegistroMasivoFormData
): Omit<RegistroMasivoRequest, 'id_prueba' | 'id_tipo_muestra' | 'total_muestras'> & {
  id_prueba: number | null
  id_tipo_muestra: number | null
  total_muestras: number | ''
} => ({
  estudio: formData.estudio,
  id_prueba: formData.id_prueba,
  id_tipo_muestra: formData.id_tipo_muestra,
  total_muestras: formData.total_muestras,
  plate_config: {
    width: formData.plate_width,
    heightLetter: formData.plate_heightLetter,
    code_prefix: formData.code_prefix || 'PLACA'
  },
  f_recepcion: formData.f_recepcion,
  id_cliente: formData.id_cliente as number
})

describe('RegistroMasivo — validaciones de estado inicial', () => {
  it('f_recepcion no está vacío en el estado inicial', () => {
    const form = buildInitialForm()
    expect(form.f_recepcion).not.toBe('')
    expect(form.f_recepcion.length).toBeGreaterThan(0)
  })

  it('f_recepcion tiene formato datetime-local válido (YYYY-MM-DDTHH:mm)', () => {
    const form = buildInitialForm()
    expect(form.f_recepcion).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/)
  })
})

describe('RegistroMasivo — construcción del payload', () => {
  it('siempre incluye f_recepcion en el payload', () => {
    const form = buildInitialForm()
    const payload = buildPayload(form)
    expect(payload).toHaveProperty('f_recepcion')
    expect(payload.f_recepcion).toBe(form.f_recepcion)
  })
})
