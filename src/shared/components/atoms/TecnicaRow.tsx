// src/customComponents/atoms/TecnicaRow.tsx
import React from 'react'
import StateCell from './StateCell'
import { useFilter } from '../../hooks/useFilter'
import { Tecnica, Resultado } from '../../hooks/useTecnicas'

interface TecnicaRowProps {
  tecnica: Tecnica
}

const TecnicaRow: React.FC<TecnicaRowProps> = ({ tecnica }) => {
  const { filters } = useFilter()

  return (
    <>
      <tr className="bg-gray-50">
        <td className="pl-8 py-2">{tecnica.nombre || tecnica.id}</td>
        <StateCell state={tecnica.estado || 'N/A'} />
      </tr>
      {filters.resultados &&
        tecnica.resultados &&
        tecnica.resultados.map((resultado: Resultado) => (
          <tr key={resultado.id} className="bg-gray-100">
            <td className="pl-12 py-1">{resultado.valor}</td>
            <td className="p-1">{resultado.fechaResultado}</td>
          </tr>
        ))}
    </>
  )
}

export default TecnicaRow
