import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { LoginPage } from '../pages/LoginPage'
import { UserProvider } from '../shared/contexts/UserContext'
import * as authService from '../shared/services/authService'
import { TOKEN_KEY } from '../shared/constants'

jest.mock('../shared/services/authService')

const mockedLogin = authService.login as jest.MockedFunction<typeof authService.login>

afterEach(() => {
  localStorage.clear()
  jest.clearAllMocks()
})

test('realiza login y redirige a dashboard', async () => {
  const fakeToken = [
    btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' })),
    btoa(JSON.stringify({ username: 'demo', exp: Math.floor(Date.now() / 1000) + 60 })),
    'signature'
  ].join('.')

  mockedLogin.mockResolvedValue({ token: fakeToken })

  render(
    <MemoryRouter initialEntries={['/login']}>
      <UserProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<div>Página principal</div>} />
        </Routes>
      </UserProvider>
    </MemoryRouter>
  )

  fireEvent.change(screen.getByPlaceholderText(/nombre de usuario/i), {
    target: { value: 'demo' }
  })

  fireEvent.change(screen.getByPlaceholderText(/contraseña/i), {
    target: { value: '123456' }
  })

  fireEvent.click(screen.getByRole('button', { name: /entrar/i }))

  await waitFor(() => {
    expect(mockedLogin).toHaveBeenCalledWith({
      username: 'demo',
      password: '123456'
    })

    expect(localStorage.getItem(TOKEN_KEY)).toBe(fakeToken)
    expect(screen.getByText(/página principal/i)).toBeInTheDocument()
  })
})
