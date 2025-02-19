// src/pages/TecnicasPage.tsx
import React, { useState } from 'react'
import {
  useTecnicas,
  useCreateTecnica,
  useUpdateTecnica,
  useDeleteTecnica,
  Tecnica
} from '../hooks/useTecnicas'

const TecnicasPage: React.FC = () => {
  const { data: tecnicas, isLoading, error } = useTecnicas()
  const createTecnicaMutation = useCreateTecnica()
  const updateTecnicaMutation = useUpdateTecnica()
  const deleteTecnicaMutation = useDeleteTecnica()

  const [newTecnica, setNewTecnica] = useState<Omit<Tecnica, 'id'>>({
    nombre: '',
    productoId: '',
    maquinaId: null,
    parametros: []
  })

  const handleCreate = () => {
    createTecnicaMutation.mutate(newTecnica)
    setNewTecnica({ nombre: '', productoId: '', maquinaId: null, parametros: [] })
  }

  const handleUpdate = (id: string) => {
    // Ejemplo: actualizar el nombre agregando "Actualizado: " al inicio
    updateTecnicaMutation.mutate({ id, data: { nombre: 'Actualizado: ' + id } })
  }

  const handleDelete = (id: string) => {
    deleteTecnicaMutation.mutate(id)
  }

  if (isLoading) return <div>Cargando técnicas...</div>
  if (error) return <div>Error al cargar técnicas.</div>

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Técnicas</h1>

      {/* Formulario para crear una nueva técnica */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Nombre de la técnica"
          value={newTecnica.nombre}
          onChange={e => setNewTecnica({ ...newTecnica, nombre: e.target.value })}
          className="border p-2 mr-2 rounded"
        />
        <input
          type="text"
          placeholder="ID del producto"
          value={newTecnica.productoId}
          onChange={e => setNewTecnica({ ...newTecnica, productoId: e.target.value })}
          className="border p-2 mr-2 rounded"
        />
        <input
          type="text"
          placeholder="ID de la máquina (opcional)"
          value={newTecnica.maquinaId || ''}
          onChange={e =>
            setNewTecnica({
              ...newTecnica,
              maquinaId: e.target.value ? e.target.value : null
            })
          }
          className="border p-2 mr-2 rounded"
        />
        <button onClick={handleCreate} className="bg-blue-500 text-white px-4 py-2 rounded">
          Crear Técnica
        </button>
      </div>

      {/* Listado de técnicas */}
      <ul>
        {tecnicas?.map((tec: Tecnica) => (
          <li key={tec.id} className="border p-4 mb-2 flex justify-between items-center">
            <div>
              <p className="font-bold">{tec.nombre}</p>
              <p className="text-sm">Producto: {tec.productoId}</p>
              <p className="text-sm">Máquina: {tec.maquinaId || 'N/A'}</p>
            </div>
            <div>
              <button
                onClick={() => handleUpdate(tec.id)}
                className="bg-green-500 text-white px-3 py-1 mr-2 rounded"
              >
                Actualizar
              </button>
              <button
                onClick={() => handleDelete(tec.id)}
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

export default TecnicasPage
