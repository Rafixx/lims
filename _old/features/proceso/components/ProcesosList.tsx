// src/features/proceso/components/ProcesoItem.tsx
import React from 'react'
import { Proceso } from '../interfaces/proceso.interface'
import { ProcesoItem } from './ProcesoItem'

interface Props {
  procesos: Proceso[]
}

export const ProcesosList: React.FC<Props> = ({ procesos }) => {
  return (
    <div className="space-y-2">
      {procesos.map(proceso => (
        <ProcesoItem key={proceso.procesoId} proceso={proceso} />
      ))}
    </div>
  )
}
