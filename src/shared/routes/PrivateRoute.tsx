import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { TOKEN_KEY } from '../constants'

interface Props {
  children: ReactNode
}

export const PrivateRoute = ({ children }: Props) => {
  const token = localStorage.getItem(TOKEN_KEY)
  return token ? children : <Navigate to="/login" />
}
