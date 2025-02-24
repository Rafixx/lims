// src/pages/ProfilePage.tsx
import React, { useContext } from 'react'
import { UserContext } from '../contexts/UserContext'

const ProfilePage: React.FC = () => {
  const { user } = useContext(UserContext)
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-3xl font-bold mb-4">Perfil de Usuario</h1>
      <p>
        <strong>Nombre:</strong> {user?.nombre}
      </p>
      <p>
        <strong>Email:</strong> {user?.email}
      </p>
      <p>
        <strong>Rol:</strong> {user?.rol}
      </p>
    </div>
  )
}

export default ProfilePage
