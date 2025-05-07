import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useUser } from '@/shared/contexts/UserContext'

interface Props {
  children: ReactNode
}

export const PrivateRoute = ({ children }: Props) => {
  const { user, loading } = useUser()

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Cargando sesión...
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" />
  }

  return children
}
