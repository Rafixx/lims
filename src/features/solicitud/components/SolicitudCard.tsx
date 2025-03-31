//src/features/listadoSolicitudes/components/SolicitudCard.tsx
import { useState } from 'react'
import { Solicitud } from '../../solicitud/interfaces/solicitud.interface'
import { MuestrasList } from '../../muestras/components/MuestrasList'
import Button from '../../../shared/components/atoms/Button'

interface Props {
  solicitud: Solicitud
}

export const SolicitudCard = ({ solicitud }: Props) => {
  const [expanded, setExpanded] = useState(false)
  const colorEstado = (): string => {
    return `bg-estados-${solicitud.estado}-200`
  }

  return (
    <article className="bg-white shadow rounded p-4 mb-4">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Solicitud de {solicitud.solicitante}</h2>
          <p className="text-sm text-gray-500">
            {new Date(solicitud.fechaSolicitud).toLocaleString()}
          </p>
          <p className="text-sm">
            Estado: <span className={`px-2 rounded-md ${colorEstado()}`}>{solicitud.estado}</span>
          </p>
        </div>
        <Button
          onClick={() => setExpanded(!expanded)}
          variant="secondary"
          aria-expanded={expanded}
          aria-controls={`detalle-${solicitud.id}`}
        >
          {expanded ? 'Ocultar detalles' : 'Ver detalles'}
        </Button>
      </header>
      {expanded && (
        <section id={`detalle-${solicitud.id}`} className="mt-4 border-t pt-4">
          <MuestrasList muestras={solicitud.muestras} />
        </section>
      )}
    </article>
  )
}
