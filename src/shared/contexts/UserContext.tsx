import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { jwtDecode } from 'jwt-decode'
import { TOKEN_KEY } from '../constants/constants'

interface DecodedToken {
  id: number
  username: string
  rol_name: string
  exp?: number
}

interface UserContextType {
  user: DecodedToken | null
  login: (token: string) => void
  logout: () => void
  loading: boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<DecodedToken | null>(null)
  const [loading, setLoading] = useState(true)

  const login = (token: string) => {
    localStorage.setItem(TOKEN_KEY, token)
    try {
      const decoded: DecodedToken = jwtDecode(token)
      if (!decoded.exp || decoded.exp * 1000 > Date.now()) {
        setUser(decoded)
      }
    } catch {
      setUser(null)
    }
  }

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY)
    setUser(null)
  }

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (token) {
      login(token)
    }
    setLoading(false)
  }, [])

  return (
    <UserContext.Provider value={{ user, login, logout, loading }}>{children}</UserContext.Provider>
  )
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser debe usarse dentro de UserProvider')
  }
  return context
}
