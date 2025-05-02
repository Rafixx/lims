// src/contexts/UserContext.tsx
import { createContext, useState, useEffect, ReactNode } from 'react'

export interface User {
  id: string
  nombre: string
  email: string
  rol: string
  fechaCreacion: string
}

interface UserContextType {
  token: string | null
  user: User | null
  login: (token: string, user: User) => void
  logout: () => void
}

export const UserContext = createContext<UserContextType>({
  token: null,
  user: null,
  login: () => {},
  logout: () => {}
})

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)

  // Al iniciar, cargar el token del sessionStorage (o localStorage)
  useEffect(() => {
    const storedToken = sessionStorage.getItem('token')
    const storedUser = sessionStorage.getItem('user')
    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const login = (token: string, user: User) => {
    setToken(token)
    setUser(user)
    sessionStorage.setItem('token', token)
    sessionStorage.setItem('user', JSON.stringify(user))
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('user')
  }

  return (
    <UserContext.Provider value={{ token, user, login, logout }}>{children}</UserContext.Provider>
  )
}
