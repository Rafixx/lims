import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { SolicitudesPage } from '../pages/SolicitudesPage'
import { UserProvider } from '@/shared/contexts/UserContext'
import { NotificationProvider } from '@/shared/components/Notification/NotificationContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

beforeAll(() => {
  if (!global.fetch) {
    global.fetch = jest.fn()
  }
})

beforeEach(() => {
  jest
    .spyOn(global, 'fetch')
    .mockImplementation((input: string | Request | URL, init?: RequestInit): Promise<Response> => {
      const url =
        typeof input === 'string' ? input : input instanceof Request ? input.url : input.toString()

      if (url.includes('/clientes')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([{ id: 1, nombre: 'Cliente 1' }])
        } as Response)
      }

      if (url.includes('/pruebas')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([{ id: 1, prueba: 'Prueba A' }])
        } as Response)
      }

      if (
        url.includes('/solicitudes') &&
        (init?.method === 'POST' || (input instanceof Request && input.method === 'POST'))
      ) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true })
        } as Response)
      }

      return Promise.resolve({
        ok: false,
        json: () => Promise.resolve({})
      } as Response)
    })
})

afterEach(() => {
  jest.restoreAllMocks()
})
const queryClient = new QueryClient()

const renderWithProviders = () => {
  render(
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>
        <NotificationProvider>
          <UserProvider>
            <SolicitudesPage />
          </UserProvider>
        </NotificationProvider>
      </QueryClientProvider>
    </MemoryRouter>
  )
}
describe('SolicitudesPage', () => {
  it('crea una solicitud y comprobar queryClient', async () => {
    renderWithProviders()
    const user = userEvent.setup()

    await user.click(screen.getByRole('button', { name: /nueva solicitud/i }))
    await user.type(screen.getByLabelText(/nº solicitud/i), 'TEST_001')
    // Esperar que los selects tengan opciones antes de interactuar
    const clienteSelect = await screen.findByLabelText(/cliente/i)
    await waitFor(() => {
      expect(clienteSelect.querySelectorAll('option').length).toBeGreaterThan(1)
    })

    await user.selectOptions(clienteSelect, '1')

    const pruebaSelect = await screen.findByLabelText(/prueba/i)
    await waitFor(() => {
      expect(pruebaSelect.querySelectorAll('option').length).toBeGreaterThan(1)
    })
    await user.selectOptions(pruebaSelect, '1')
    await user.type(screen.getByLabelText(/fecha de entrada/i), '2025-05-02')
    await user.click(screen.getByRole('button', { name: /guardar/i }))

    const solicitudes = queryClient.getQueryData(['solicitudes'])
    // Verificar que existe una solicitud en el queryClient que tiene el num_solicitud TEST_001
    expect(solicitudes).toBeDefined()
    expect(solicitudes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          num_solicitud: 'TEST_001'
        })
      ])
    )
  })
})
