// src/pages/MaquinasPage.tsx
import React, { useState } from 'react'
import {
  useMaquinas,
  useCreateMaquina,
  useUpdateMaquina,
  useDeleteMaquina,
  Maquina
} from '../hooks/useMaquinas'

const MaquinasPage: React.FC = () => {
  const { data: maquinas, isLoading, error } = useMaquinas()
  const createMaquinaMutation = useCreateMaquina()
  const updateMaquinaMutation = useUpdateMaquina()
  const deleteMaquinaMutation = useDeleteMaquina()

  const [newMaquina, setNewMaquina] = useState({
    nombre: '',
    tipo: ''
  })

  const handleCreate = () => {
    createMaquinaMutation.mutate(newMaquina)
    setNewMaquina({ nombre: '', tipo: '' })
  }

  const handleUpdate = (id: string) => {
    // Por ejemplo, alternar el tipo entre "Actualizado" y el valor original
    // Aquí puedes adaptar la lógica según tus requerimientos.
    updateMaquinaMutation.mutate({ id, data: { tipo: 'Actualizado' } })
  }

  const handleDelete = (id: string) => {
    deleteMaquinaMutation.mutate(id)
  }

  if (isLoading) return <div>Cargando máquinas...</div>
  if (error) return <div>Error al cargar máquinas</div>

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Máquinas</h1>

      {/* Formulario para crear nueva máquina */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Nombre"
          value={newMaquina.nombre}
          onChange={e => setNewMaquina({ ...newMaquina, nombre: e.target.value })}
          className="border p-2 mr-2 rounded"
        />
        <input
          type="text"
          placeholder="Tipo"
          value={newMaquina.tipo}
          onChange={e => setNewMaquina({ ...newMaquina, tipo: e.target.value })}
          className="border p-2 mr-2 rounded"
        />
        <button onClick={handleCreate} className="bg-blue-500 text-white px-4 py-2 rounded">
          Crear Máquina
        </button>
      </div>

      {/* Listado de máquinas */}
      <ul>
        {maquinas?.map((maq: Maquina) => (
          <li key={maq.id} className="border p-4 mb-2 flex justify-between items-center">
            <div>
              <p className="font-bold">{maq.nombre}</p>
              <p>{maq.tipo}</p>
            </div>
            <div>
              <button
                onClick={() => handleUpdate(maq.id)}
                className="bg-green-500 text-white px-3 py-1 mr-2 rounded"
              >
                Actualizar
              </button>
              <button
                onClick={() => handleDelete(maq.id)}
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

export default MaquinasPage
