import { buildMuestraPayload } from '../utils/buildMuestraPayload'
import { Muestra } from '../interfaces/muestras.types'

const baseMuestra: Muestra = {
  id_muestra: 5,
  tipo_array: false,
  codigo_epi: 'EPI2025-001',
  f_recepcion: '2025-05-11T10:00:00.000Z',
  tipo_muestra: null,
  prueba: null,
  centro: null,
  criterio_validacion: null,
  ubicacion: null,
  tecnico_resp: null,
  solicitud: null,
  paciente: null,
}

describe('buildMuestraPayload', () => {
  it('transforma tipo_muestra a id_tipo_muestra', () => {
    const input: Muestra = {
      ...baseMuestra,
      tipo_muestra: { id: 3, cod_tipo_muestra: 'SANGRE001', tipo_muestra: 'SANGRE' },
    }
    const result = buildMuestraPayload(input)
    expect(result.id_tipo_muestra).toBe(3)
  })

  it('transforma prueba a id_prueba', () => {
    const input: Muestra = {
      ...baseMuestra,
      prueba: { id: 7, cod_prueba: 'SG', prueba: 'ScoliGEN' },
    }
    const result = buildMuestraPayload(input)
    expect(result.id_prueba).toBe(7)
  })

  it('transforma centro a id_centro', () => {
    const input: Muestra = {
      ...baseMuestra,
      centro: { id: 2, codigo: '002', descripcion: 'Hospital Clínico' },
    }
    const result = buildMuestraPayload(input)
    expect(result.id_centro).toBe(2)
  })

  it('deja id_tipo_muestra como undefined cuando tipo_muestra es null', () => {
    const input: Muestra = { ...baseMuestra, tipo_muestra: null }
    const result = buildMuestraPayload(input)
    expect(result.id_tipo_muestra).toBeUndefined()
  })

  it('preserva campos escalares sin modificarlos', () => {
    const input: Muestra = {
      ...baseMuestra,
      codigo_epi: 'EPI2025-999',
      f_recepcion: '2025-06-01T00:00:00.000Z',
    }
    const result = buildMuestraPayload(input)
    expect(result.codigo_epi).toBe('EPI2025-999')
    expect(result.f_recepcion).toBe('2025-06-01T00:00:00.000Z')
  })
})
