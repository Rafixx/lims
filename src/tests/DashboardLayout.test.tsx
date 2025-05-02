import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { UserProvider } from '../shared/contexts/UserContext'
import { TOKEN_KEY } from '../shared/constants'

const fakeToken = [
  btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' })),
  btoa(JSON.stringify({ username: 'demo', exp: Math.floor(Date.now() / 1000) + 60 })),
  'signature'
].join('.')

beforeEach(() => {
  localStorage.setItem(TOKEN_KEY, fakeToken)
})

afterEach(() => {
  localStorage.clear()
})

test('muestra el nombre del usuario si hay token válido', async () => {
  render(
    <MemoryRouter initialEntries={['/dashboard']}>
      <UserProvider>
        <Routes>
          <Route path="/dashboard" element={<DashboardLayout />} />
        </Routes>
      </UserProvider>
    </MemoryRouter>
  )

  const username = await screen.findByText(text => text.includes('demo'))
  expect(username).toBeInTheDocument()
})

test('logout elimina el token y redirige al login', async () => {
  render(
    <MemoryRouter initialEntries={['/dashboard']}>
      <UserProvider>
        <Routes>
          <Route path="/dashboard" element={<DashboardLayout />} />
          <Route path="/login" element={<div>Página de Login</div>} />
        </Routes>
      </UserProvider>
    </MemoryRouter>
  )

  // Esperamos a que aparezca el usuario
  await screen.findByText(text => text.includes('demo'))

  // Clic en cerrar sesión
  fireEvent.click(screen.getByRole('button', { name: /cerrar sesión/i }))

  // Verificamos redirección y eliminación del token
  expect(await screen.findByText(/página de login/i)).toBeInTheDocument()
  expect(localStorage.getItem(TOKEN_KEY)).toBeNull()
})
