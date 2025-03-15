// src/customComponents/molecules/ProductoRow.tsx
import React from 'react'
import StateCell from '../atoms/StateCell'
import TecnicaRow from '../atoms/TecnicaRow'
import { useFilter } from '../../hooks/useFilter'
import { Producto } from '../../hooks/useProductos' // Asegúrate de que este tipo tenga "id"

interface ProductoRowProps {
  producto: Producto
}

const ProductoRow: React.FC<ProductoRowProps> = ({ producto }) => {
  const { filters } = useFilter()

  return (
    <>
      <tr className="bg-gray-100">
        <td className="pl-4 py-2 font-semibold">{producto.nombre || producto.id}</td>
        <StateCell state={producto.estado || 'N/A'} />
      </tr>
      {filters.tecnicas &&
        producto.tecnicas.map(tecnica => <TecnicaRow key={tecnica.id} tecnica={tecnica} />)}
    </>
  )
}

export default ProductoRow
