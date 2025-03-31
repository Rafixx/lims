// src/features/proceso/components/ProcesoItem.tsx
import React, { useState } from 'react'
import { Proceso } from '../../proceso/interfaces/proceso.interface'
import { ResultadosList } from '../../resultado/components/ResultadosList'
import Button from '../../../shared/components/atoms/Button'

interface Props {
  proceso: Proceso
}

export const ProcesoItem: React.FC<Props> = ({ proceso }) => {
  const [expanded, setExpanded] = useState(false)

  return (
    <article className="bg-white p-3 rounded shadow-sm">
      <header className="flex justify-between items-center">
        <div className="flex flex-col">
          <span className="font-medium">{proceso.nombre}</span>
          <span className="text-xs text-gray-500">ID: {proceso.procesoId}</span>
          <span className="text-xs">Estado: {proceso.estado}</span>
        </div>
        <Button
          onClick={() => setExpanded(!expanded)}
          className="text-blue-500 text-sm hover:underline focus:outline-none"
          aria-expanded={expanded}
          aria-controls={`resultados-${proceso.procesoId}`}
        >
          {expanded ? 'Ocultar resultados' : 'Ver resultados'}
        </Button>
      </header>
      {expanded && (
        <section id={`resultados-${proceso.procesoId}`} className="mt-2">
          <ResultadosList resultados={proceso.resultados} />
        </section>
      )}
    </article>
  )
}
