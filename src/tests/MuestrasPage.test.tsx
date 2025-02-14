// src/tests/MuestrasPage.test.tsx
import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import MuestrasPage from '../pages/MuestrasPage'
import { server } from '../mocks/server'

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

const queryClient = new QueryClient()

test('Debe mostrar la lista de muestras', async () => {
  render(
    <QueryClientProvider client={queryClient}>
      <MuestrasPage />
    </QueryClientProvider>
  )

  await waitFor(() => screen.getByText(/M001/i))
  expect(screen.getByText(/Pendiente/i)).toBeInTheDocument()
})
