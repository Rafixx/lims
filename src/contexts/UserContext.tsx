// src/contexts/UserContext.tsx
import React, { createContext, useState, useContext } from 'react'

interface UserContextValue {
  username: string
  setUsername: (username: string) => void
}

const UserContext = createContext<UserContextValue | undefined>(undefined)

interface UserProviderProps {
  children: React.ReactNode
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [username, setUsername] = useState('')

  return <UserContext.Provider value={{ username, setUsername }}>{children}</UserContext.Provider>
}

export const useUser = (): UserContextValue => {
  const context = useContext(UserContext)
  if (!context) throw new Error('useUser debe usarse dentro de UserProvider')
  return context
}
