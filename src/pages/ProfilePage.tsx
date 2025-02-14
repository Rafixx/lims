// src/pages/ProfilePage.tsx
import React from 'react'
import { useUser } from '../contexts/UserContext'

const ProfilePage: React.FC = () => {
  const { username } = useUser()

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Perfil de Usuario</h1>
      {username ? (
        <div className="text-gray-700 space-y-2">
          <p>
            <span className="font-semibold">Username:</span> {username}
          </p>
          {/* Puedes agregar más detalles o acciones relacionadas al usuario */}
        </div>
      ) : (
        <p className="text-red-500">No se encontró información del usuario.</p>
      )}
    </div>
  )
}

export default ProfilePage
