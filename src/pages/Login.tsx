// src/pages/Login.tsx
import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom' // O el hook de navegación que uses (por ejemplo, de react-router-dom v6)
import { loginService } from '../shared/services/authService'
import { UserContext } from '../shared/contexts/UserContext'
import Card from '../shared/components/molecules/Card'

const Login: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const { login } = useContext(UserContext)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    //para pruebas
    setEmail('maria.lopez@empresa.com')
    setPassword('password')

    try {
      const data = await loginService(email, password)
      login(data.token, data.user)
      navigate('/') // Redirige a la home o a la ruta protegida
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center h-full">
      <Card className="w-96">
        <h1 className="text-center font-bold text-xl">Iniciar Sesión</h1>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="m-2">
            <label>Email</label>
            <input
              className="border border-gray-300 rounded-lg p-2 w-full"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="m-2">
            <label>Contraseña</label>
            <input
              className="border border-gray-300 rounded-lg p-2 w-full"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-primary text-white p-2 mt-2"
          >
            {loading ? 'Ingresando...' : 'Login'}
          </button>
        </form>
      </Card>
    </div>
  )
}

export default Login
