// src/features/resultado/components/ResultadosList.tsx
import React from 'react'
import { Resultado } from '../interfaces/tipoResultado.interface'
import { ResultadoItem } from './ResultadoItem'

interface Props {
  resultados: Resultado[]
}

export const ResultadosList: React.FC<Props> = ({ resultados }) => {
  return (
    <div className="space-y-2">
      {resultados.map(resultado => (
        <ResultadoItem key={resultado.id} resultado={resultado} />
      ))}
    </div>
  )
}
