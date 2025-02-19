// src/pages/ProductosPage.tsx
import React, { useState } from 'react'
import {
  useProductos,
  useCreateProducto,
  useUpdateProducto,
  useDeleteProducto,
  Producto
} from '../hooks/useProductos'

const ProductosPage: React.FC = () => {
  const { data: productos, isLoading, error } = useProductos()
  const createProductoMutation = useCreateProducto()
  const updateProductoMutation = useUpdateProducto()
  const deleteProductoMutation = useDeleteProducto()

  // Estado local para crear un producto
  const [newProducto, setNewProducto] = useState<Omit<Producto, 'id'>>({
    nombre: '',
    tecnicas: []
  })
  const [techInput, setTechInput] = useState('') // Para ingresar una técnica de ejemplo

  const handleCreate = () => {
    const techniques = techInput ? [techInput] : []
    createProductoMutation.mutate({ ...newProducto, tecnicas: techniques })
    setNewProducto({ nombre: '', tecnicas: [] })
    setTechInput('')
  }

  const handleUpdate = (id: string) => {
    // Ejemplo: actualizar el nombre agregando el prefijo "Actualizado: "
    updateProductoMutation.mutate({ id, data: { nombre: 'Actualizado: ' + id } })
  }

  const handleDelete = (id: string) => {
    deleteProductoMutation.mutate(id)
  }

  if (isLoading) return <div>Cargando productos...</div>
  if (error) return <div>Error al cargar productos.</div>

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Productos</h1>

      {/* Formulario para crear un nuevo producto */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Nombre del producto"
          value={newProducto.nombre}
          onChange={e => setNewProducto({ ...newProducto, nombre: e.target.value })}
          className="border p-2 mr-2 rounded"
        />
        <input
          type="text"
          placeholder="ID de técnica"
          value={techInput}
          onChange={e => setTechInput(e.target.value)}
          className="border p-2 mr-2 rounded"
        />
        <button onClick={handleCreate} className="bg-blue-500 text-white px-4 py-2 rounded">
          Crear Producto
        </button>
      </div>

      {/* Listado de productos */}
      <ul>
        {productos?.map(producto => (
          <li key={producto.id} className="border p-4 mb-2 flex justify-between items-center">
            <div>
              <p className="font-bold">{producto.nombre}</p>
              <p className="text-sm">
                Técnicas: {producto.tecnicas.length ? producto.tecnicas.join(', ') : 'Ninguna'}
              </p>
            </div>
            <div>
              <button
                onClick={() => handleUpdate(producto.id)}
                className="bg-green-500 text-white px-3 py-1 mr-2 rounded"
              >
                Actualizar
              </button>
              <button
                onClick={() => handleDelete(producto.id)}
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

export default ProductosPage
