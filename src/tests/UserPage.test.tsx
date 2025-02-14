// src/tests/UserPage.test.tsx
import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import UserPage from '../pages/UserPage'
import { server } from '../mocks/server'

// Inicia MSW antes de los tests y ciérralo al final
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

const queryClient = new QueryClient()

test('debe mostrar la información del usuario', async () => {
  render(
    <QueryClientProvider client={queryClient}>
      <UserPage />
    </QueryClientProvider>
  )

  // Espera a que se muestre la información del usuario
  await waitFor(() => screen.getByText(/User Info/i))
  expect(screen.getByText(/John/i)).toBeInTheDocument()
  expect(screen.getByText(/Maverick/i)).toBeInTheDocument()
})
