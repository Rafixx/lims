//src/features/listadoSolicitudes/components/SolicitudCard.tsx
// import { useState } from 'react'
import Button, { ButtonVariants } from '../../../shared/components/atoms/Button'
import { ListaTrabajo } from '../interfaces/listaTrabajo.interface'
// import { ProcesoItem } from '../../proceso/components/ProcesoItem'

interface Props {
  listaTrabajo: ListaTrabajo
  onSelect?: (listaTrabajo: ListaTrabajo | null) => void
  isSelected?: boolean
}

export const ListaTrabajoCard = ({ listaTrabajo, onSelect, isSelected }: Props) => {
  const colorEstado = (): string => {
    return `bg-estados-${listaTrabajo.estado}-200`
  }

  return (
    <article className="bg-white shadow rounded p-4 mb-4">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">{listaTrabajo.proceso.nombre}</h2>
          <p className="text-sm text-gray-500">{new Date(listaTrabajo.fecha).toLocaleString()}</p>
          <div className="text-sm space-x-2">
            Estado: <span className="text-sm text-gray-500 mr-4">{listaTrabajo.estado}</span>
            Técnico al cargo:
            <span className="text-sm text-gray-500 mr-4">{listaTrabajo.tecnico.nombre}</span>
          </div>
        </div>
        <Button
          onClick={() => {
            // Si la tarjeta está seleccionada, se deselecciona; si no, se selecciona
            if (isSelected && onSelect) {
              onSelect(null)
            } else if (onSelect) {
              onSelect(listaTrabajo)
            }
          }}
          variant={ButtonVariants.SECONDARY}
          aria-controls={`detalle-${listaTrabajo.id}`}
        >
          {isSelected ? 'Ocultar detalles' : 'Ver detalles'}
        </Button>
      </header>
    </article>
  )
}
