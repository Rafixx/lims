// src/pages/UserPage.tsx
import React, { useState } from 'react'
import {
  useUsers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
  User
} from '../shared/hooks/useUser'

const UserPage: React.FC = () => {
  const { data: users, isLoading, error } = useUsers()
  const createUserMutation = useCreateUser()
  const updateUserMutation = useUpdateUser()
  const deleteUserMutation = useDeleteUser()

  const [newUser, setNewUser] = useState({
    nombre: '',
    email: '',
    rol: ''
  })

  const handleCreate = () => {
    // Agregamos la fecha de creación automáticamente
    createUserMutation.mutate({ ...newUser, fechaCreacion: new Date().toISOString() })
    setNewUser({ nombre: '', email: '', rol: '' })
  }

  const handleDelete = (id: string) => {
    deleteUserMutation.mutate(id)
  }

  const handleUpdate = (user: User) => {
    // Ejemplo: alternar el rol entre "Lector" y "Administrador"
    const newRol = user.rol === 'Lector' ? 'Administrador' : 'Lector'
    updateUserMutation.mutate({ id: user.id, data: { rol: newRol } })
  }

  if (isLoading) return <div>Cargando usuarios...</div>
  if (error) return <div>Error al cargar usuarios.</div>

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Usuarios</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Nombre"
          value={newUser.nombre}
          onChange={e => setNewUser({ ...newUser, nombre: e.target.value })}
          className="border p-2 mr-2 rounded"
        />
        <input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={e => setNewUser({ ...newUser, email: e.target.value })}
          className="border p-2 mr-2 rounded"
        />
        <input
          type="text"
          placeholder="Rol"
          value={newUser.rol}
          onChange={e => setNewUser({ ...newUser, rol: e.target.value })}
          className="border p-2 mr-2 rounded"
        />
        <button onClick={handleCreate} className="bg-blue-500 text-white px-4 py-2 rounded">
          Crear Usuario
        </button>
      </div>
      <ul>
        {users?.map(user => (
          <li key={user.id} className="border p-4 mb-2 flex justify-between items-center">
            <div>
              <p className="font-bold">{user.nombre}</p>
              <p>{user.email}</p>
              <p>{user.rol}</p>
              <p className="text-xs text-gray-500">{user.fechaCreacion}</p>
            </div>
            <div>
              <button
                onClick={() => handleUpdate(user)}
                className="bg-green-500 text-white px-3 py-1 mr-2 rounded"
              >
                Actualizar Rol
              </button>
              <button
                onClick={() => handleDelete(user.id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default UserPage
