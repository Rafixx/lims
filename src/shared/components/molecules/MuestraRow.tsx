// src/customComponents/molecules/MuestraRow.tsx
import React from 'react'
import StateCell from '../atoms/StateCell'
import ProductoRow from './ProductoRow'
import { Muestra } from '../../hooks/useMuestras'
import { useFilter } from '../../hooks/useFilter'

interface MuestraRowProps {
  muestra: Muestra
}

const MuestraRow: React.FC<MuestraRowProps> = ({ muestra }) => {
  const { filters } = useFilter()

  return (
    <>
      <tr className="bg-white">
        <td className="pl-0 py-2 font-bold">{muestra.identificacionExterna}</td>
        <StateCell state={muestra.estado} />
      </tr>
      {filters.productos &&
        muestra.productos.map(producto => <ProductoRow key={producto.id} producto={producto} />)}
    </>
  )
}

export default MuestraRow
