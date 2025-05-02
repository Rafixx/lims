import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { jwtDecode } from 'jwt-decode'
import { TOKEN_KEY } from '../constants'

interface DecodedToken {
  username: string
  email?: string
  id_rol?: number
  exp?: number
}

interface UserContextType {
  user: DecodedToken | null
  login: (token: string) => void
  logout: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<DecodedToken | null>(null)

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
  }, [])

  return <UserContext.Provider value={{ user, login, logout }}>{children}</UserContext.Provider>
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser debe usarse dentro de UserProvider')
  }
  return context
}
