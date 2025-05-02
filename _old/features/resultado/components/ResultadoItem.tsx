// src/features/resultado/components/ResultadoItem.tsx
import React from 'react'
import { Resultado } from '../interfaces/tipoResultado.interface'

interface Props {
  resultado: Resultado
}

export const ResultadoItem: React.FC<Props> = ({ resultado }) => {
  return (
    <div className="flex justify-between items-center bg-gray-200 p-2 rounded">
      <span className="text-sm">ID: {resultado.id}</span>
      <span className="text-sm">
        Valor: {resultado.valor} {resultado.unidad}
      </span>
      <time className="text-xs text-gray-500">
        {new Date(resultado.fechaResultado).toLocaleString()}
      </time>
    </div>
  )
}
