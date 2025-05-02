// src/features/estudio/components/EstudioCard.tsx
import React, { useState } from 'react'
import { ProcesosList } from '../../proceso/components/ProcesosList'
import { Estudio } from '../interfaces/estudio.interface'
import Button, { ButtonVariants } from '../../../shared/components/atoms/Button'

interface Props {
  estudio: Estudio
}

export const EstudioCard: React.FC<Props> = ({ estudio }) => {
  const [expanded, setExpanded] = useState(false)

  return (
    <article className="bg-gray-100 p-4 rounded mb-4">
      <header className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold">{estudio.nombre}</h3>
          <p className="text-xs text-gray-500">ID: {estudio.id}</p>
          <p className="text-sm">
            Estado: <strong>{estudio.estado}</strong>
          </p>
        </div>
        {estudio.procesos.length !== 0 ? (
          <Button
            onClick={() => setExpanded(!expanded)}
            variant={ButtonVariants.SECONDARY}
            aria-expanded={expanded}
            aria-controls={`procesos-${estudio.id}`}
          >
            {expanded ? 'Ocultar procesos' : 'Ver procesos'}
          </Button>
        ) : (
          'Sin procesos asociados'
        )}
      </header>
      {expanded && (
        <section id={`procesos-${estudio.estudioId}`} className="mt-4">
          <ProcesosList procesos={estudio.procesos} />
        </section>
      )}
    </article>
  )
}
