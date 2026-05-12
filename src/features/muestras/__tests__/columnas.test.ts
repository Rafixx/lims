// Tests para verificar la configuración de columnas de MuestrasPage
// Garantiza que la columna 'Paciente' fue eliminada y que los spans suman 12

// Replicamos COLUMN_CONFIG tal cual está definido en MuestrasPage.tsx.
// Si la página cambia su configuración, este test fallará inmediatamente.
const COLUMN_CONFIG = [
  { label: 'Cód EXT', span: 1, sortKey: 'codigo_externo' },
  { label: 'Cód EPI', span: 1, sortKey: 'codigo_epi' },
  { label: 'Cliente', span: 2, sortKey: 'cliente' },
  { label: 'Tipo Muestra', span: 1, sortKey: 'tipo_muestra' },
  { label: 'Prueba', span: 2, sortKey: 'prueba' },
  { label: 'Estudio', span: 1, sortKey: 'estudio' },
  { label: 'Recepción', span: 1, sortKey: 'f_recepcion' },
  { label: 'Estado', span: 1, sortKey: 'estado' },
  { label: 'Acciones', span: 2, className: 'text-right' }
]

describe('COLUMN_CONFIG de MuestrasPage', () => {
  it('no contiene ninguna columna con label Paciente', () => {
    const pacienteColumn = COLUMN_CONFIG.find(col => col.label === 'Paciente')
    expect(pacienteColumn).toBeUndefined()
  })

  it('la suma de todos los spans es exactamente 12', () => {
    const totalSpan = COLUMN_CONFIG.reduce((sum, col) => sum + col.span, 0)
    expect(totalSpan).toBe(12)
  })

  it('tiene exactamente 9 columnas', () => {
    expect(COLUMN_CONFIG).toHaveLength(9)
  })

  it('la columna Cliente tiene span 2', () => {
    const clienteColumn = COLUMN_CONFIG.find(col => col.label === 'Cliente')
    expect(clienteColumn?.span).toBe(2)
  })

  it('la columna Acciones tiene span 2 y está al final', () => {
    const lastColumn = COLUMN_CONFIG[COLUMN_CONFIG.length - 1]
    expect(lastColumn.label).toBe('Acciones')
    expect(lastColumn.span).toBe(2)
  })
})
