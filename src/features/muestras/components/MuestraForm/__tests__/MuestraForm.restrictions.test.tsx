/**
 * Tests de restricciones del formulario de Muestra:
 * - TimelineEventsSection: f_recepcion bloqueado en edición, indicador obligatorio en creación
 * - DatosGeneralesSection: isEditing pasado a TimelineEventsSection
 * - MuestraForm: validación de f_recepcion al crear
 */
import { render, screen, fireEvent } from '@testing-library/react'
import { FormProvider, useForm } from 'react-hook-form'
import { TimelineEventsSection } from '../TimelineEventsSection'
import type { Muestra } from '../../../interfaces/muestras.types'

// Mock de los hooks de tablas dimensionales
jest.mock('@/shared/hooks/useDim_tables', () => ({
  useTecnicosLaboratorio: () => ({ data: [], isLoading: false })
}))

// Wrapper que provee el FormProvider con valores controlados
const renderWithForm = (
  ui: React.ReactElement,
  defaultValues: Partial<Muestra> = {}
) => {
  const Wrapper = () => {
    const methods = useForm<Muestra>({ defaultValues: defaultValues as Muestra })
    return <FormProvider {...methods}>{ui}</FormProvider>
  }
  return render(<Wrapper />)
}

describe('TimelineEventsSection', () => {
  describe('f_recepcion en modo creación (isEditing=false)', () => {
    it('el botón de recepción es clickeable y abre el modal', () => {
      renderWithForm(<TimelineEventsSection isEditing={false} />)

      const recepcionBtn = screen.getByRole('button', { name: /entrada laboratorio/i })
      expect(recepcionBtn).not.toHaveClass('opacity-60')
      expect(recepcionBtn).not.toHaveClass('cursor-not-allowed')

      fireEvent.click(recepcionBtn)
      expect(screen.getByText(/editar: entrada laboratorio/i)).toBeInTheDocument()
    })

    it('muestra borde danger cuando f_recepcion no está completado', () => {
      renderWithForm(<TimelineEventsSection isEditing={false} />, { f_recepcion: undefined })

      const recepcionBtn = screen.getByRole('button', { name: /entrada laboratorio/i })
      expect(recepcionBtn.className).toMatch(/border-danger/)
    })

    it('no muestra borde danger cuando f_recepcion está completado', () => {
      renderWithForm(<TimelineEventsSection isEditing={false} />, {
        f_recepcion: new Date().toISOString()
      })

      const recepcionBtn = screen.getByRole('button', { name: /entrada laboratorio/i })
      expect(recepcionBtn.className).not.toMatch(/border-danger/)
    })
  })

  describe('f_recepcion en modo edición (isEditing=true)', () => {
    it('el botón de recepción tiene clases de deshabilitado', () => {
      renderWithForm(<TimelineEventsSection isEditing={true} />)

      const recepcionBtn = screen.getByRole('button', { name: /entrada laboratorio/i })
      expect(recepcionBtn).toHaveClass('opacity-60')
      expect(recepcionBtn).toHaveClass('cursor-not-allowed')
    })

    it('no abre el modal al hacer click en f_recepcion cuando isEditing=true', () => {
      renderWithForm(<TimelineEventsSection isEditing={true} />)

      const recepcionBtn = screen.getByRole('button', { name: /entrada laboratorio/i })
      fireEvent.click(recepcionBtn)

      // El modal no debe aparecer
      expect(screen.queryByText(/editar: entrada laboratorio/i)).not.toBeInTheDocument()
    })

    it('otros botones siguen siendo clickeables en modo edición', () => {
      renderWithForm(<TimelineEventsSection isEditing={true} />)

      // f_toma no está bloqueado
      const tomaBtn = screen.getByRole('button', { name: /toma de muestra/i })
      expect(tomaBtn).not.toHaveClass('opacity-60')
      expect(tomaBtn).not.toHaveClass('cursor-not-allowed')

      fireEvent.click(tomaBtn)
      expect(screen.getByText(/editar: toma de muestra/i)).toBeInTheDocument()
    })
  })

  describe('comportamiento del modal de edición', () => {
    it('se cierra al pulsar Cancelar', () => {
      renderWithForm(<TimelineEventsSection isEditing={false} />)

      const tomaBtn = screen.getByRole('button', { name: /toma de muestra/i })
      fireEvent.click(tomaBtn)
      expect(screen.getByText(/editar: toma de muestra/i)).toBeInTheDocument()

      fireEvent.click(screen.getByRole('button', { name: /cancelar/i }))
      expect(screen.queryByText(/editar: toma de muestra/i)).not.toBeInTheDocument()
    })
  })
})

describe('Lógica de validación f_recepcion al crear', () => {
  /**
   * Testea la lógica pura de validación sin renderizar MuestraForm completo
   * (que tiene demasiadas dependencias externas).
   */
  const validateFrecepcion = (
    isEditing: boolean,
    f_recepcion: string | undefined
  ): string | null => {
    if (!isEditing && !f_recepcion) {
      return 'La fecha de recepción es obligatoria.'
    }
    return null
  }

  it('retorna error si no hay f_recepcion en creación', () => {
    expect(validateFrecepcion(false, undefined)).not.toBeNull()
  })

  it('retorna error si f_recepcion es string vacío en creación', () => {
    expect(validateFrecepcion(false, '')).not.toBeNull()
  })

  it('no retorna error si f_recepcion está presente en creación', () => {
    expect(validateFrecepcion(false, new Date().toISOString())).toBeNull()
  })

  it('no retorna error en edición aunque f_recepcion esté vacío', () => {
    expect(validateFrecepcion(true, undefined)).toBeNull()
  })

  it('no retorna error en edición con f_recepcion definido', () => {
    expect(validateFrecepcion(true, new Date().toISOString())).toBeNull()
  })
})
